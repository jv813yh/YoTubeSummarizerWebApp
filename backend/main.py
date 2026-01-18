from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from youtube_transcript_api import YouTubeTranscriptApi
from openai import OpenAI
import os
import re
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# API Client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
class SummarizeRequest(BaseModel):
    url: str
    style: str
    language: str
STYLE_DEFINITIONS = {
    "executive": """markdown
# Executive Summary
- Start with a short TL;DR (2–3 sentences).
- Use a "## Key Points" section with bullet points.
- End with "## Conclusion".
- Minimal formatting, professional tone.""",
    "study_notes": """markdown
# Study Notes
- Use hierarchical headings (##, ###).
- Include definitions where concepts appear.
- Use bullet points and numbered lists.
- Highlight important terms using **bold**.""",
    "technical": """markdown
# Technical Breakdown
- Use sections: Overview, Concepts, Workflow, Limitations.
- Include pseudo-steps or flow descriptions when relevant.
- Prefer precise technical language.""",
    "blog": """markdown
# Blog-Style Summary
- Start with a compelling title.
- Use short paragraphs.
- Include subheadings and emphasis.
- Friendly but informative tone."""
}
SYSTEM_PROMPT = """You are an AI assistant integrated into a web application that summarizes YouTube videos.
Your task:
- Analyze the transcript or extracted text of a YouTube video.
- Produce a concise, accurate, and well-structured summary.
- Output the result strictly in VALID MARKDOWN.
- Follow the selected markdown style provided by the user.
- Do NOT include explanations about how you generated the summary.
- Do NOT include disclaimers or meta-commentary.
- Do NOT reference timestamps unless explicitly requested.
General rules:
- Be factual and neutral.
- Preserve key ideas, concepts, and conclusions from the video.
- Prefer clarity over verbosity.
- Use bullet points, headings, and emphasis consistently.
- Never hallucinate content not present in the transcript.
If transcript content is missing or incomplete:
- Clearly state: "⚠️ Transcript content is incomplete; summary may be partial."
- Then summarize only what is available.
"""
def extract_video_id(url):
    # Regex for standard YouTube URLs
    regex = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match = re.search(regex, url)
    if match:
        return match.group(1)
    return None
def get_transcript_text(video_id):
    # Strategy pattern to handle weird library versions/conflicts
    strategies = [
        ("Standard Static", lambda: YouTubeTranscriptApi.get_transcript(video_id)),
        ("Standard List", lambda: YouTubeTranscriptApi.list_transcripts(video_id).find_transcript(['en']).fetch()),
        ("Instance get_transcript", lambda: YouTubeTranscriptApi().get_transcript(video_id)),
        ("Instance fetch", lambda: YouTubeTranscriptApi().fetch(video_id)),
        ("Static fetch", lambda: YouTubeTranscriptApi.fetch(video_id)),
        ("Static list", lambda: YouTubeTranscriptApi.list(video_id)),
    ]
    print(f"Attempting to fetch transcript for {video_id}...")
    
    for name, strategy in strategies:
        try:
            # Check if method exists before calling to avoid simple AttributeErrors logging too much
            # But the lambda wraps the call, so we just try/except.
            # However, for 'Static list' etc, we need to check if .list exists on the class/obj inside the lambda?
            # Simpler: Just run the strategy.
            print(f"Trying strategy: {name}")
            transcript_list = strategy()
            
            # If we get here, it worked. Process result.
            if isinstance(transcript_list, list):
                return " ".join([t['text'] for t in transcript_list if 'text' in t])
            else:
                return str(transcript_list)
        except Exception as e:
            print(f"Strategy '{name}' failed with error: {type(e).__name__}: {e}") # Verbose Debug log
            continue
            print("All transcript fetch strategies failed.")
            return None

def chunk_text(text, chunk_size=12000):
    # Rough char count approximation (approx 3k-4k tokens)
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
@app.get("/")
def read_root():
    return {"message": "VendyGo Tools API is running"}
@app.post("/summarize")
async def summarize_video(request: SummarizeRequest):
    video_id = extract_video_id(request.url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")
    print(f"Processing Video ID: {video_id}")
    transcript = get_transcript_text(video_id)
    
    if not transcript:
        # Fallback or error
        print(f"Failed to retrieve transcript for {video_id}.")
        # For demo purposes if transcript fails (e.g. no captions), we return error.
        raise HTTPException(status_code=404, detail=f"Could not retrieve transcript for video {video_id}. It might not have captions or is restricted.")
    # Chunking strategy
    chunks = chunk_text(transcript)
    
    style_def = STYLE_DEFINITIONS.get(request.style, STYLE_DEFINITIONS["executive"])
    
    final_summary = ""
    if not client.api_key:
         # MOCK RESPONSE IF NO API KEY
         return {"message": "Success (Mock)", "markdown": f"# Mock Summary for {request.url}\n\n**Note: OPENAI_API_KEY not found.**\n\n## Key Points\n- Video ID extracted: `{video_id}`\n- Transcript length: {len(transcript)} chars\n- Style: {request.style}\n- Language: {request.language}\n\nTo get real AI summaries, please add your API Key to the `.env` file backend."}
    # If single chunk
    if len(chunks) == 1:
        user_prompt = f"""
YouTube URL: {request.url}
Transcript Content:
{chunks[0]}
Selected Markdown Style:
{style_def}
Target Language:
{request.language}
Instructions:
- Summarize the video according to the selected markdown style.
- Keep the summary readable inside a web dashboard.
- Use headings and formatting appropriate for the selected style.
- Output ONLY markdown, nothing else.
"""
        try:
            response = client.chat.completions.create(
                model="gpt-4o", # or gpt-3.5-turbo
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ]
            )
            final_summary = response.choices[0].message.content
        except Exception as e:
             raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")
    else:
        # Multi-chunk strategy (Simplified Map-Reduce)
        # 1. Summarize each chunk
        chunk_summaries = []
        for i, chunk in enumerate(chunks):
            print(f"Summarizing chunk {i+1}/{len(chunks)}")
            chunk_prompt = f"Summarize this part of the video transcript ({i+1}/{len(chunks)}). Keep it concise. \n\n {chunk}"
            try:
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant summarizing video segments."},
                        {"role": "user", "content": chunk_prompt}
                    ]
                )
                chunk_summaries.append(response.choices[0].message.content)
            except Exception as e:
                print(f"Error on chunk {i}: {e}")
        
        # 2. Final Synthesis
        combined_summaries = "\n\n".join(chunk_summaries)
        final_prompt = f"""
YouTube URL: {request.url}
Combined Summaries of Parts:
{combined_summaries}
Selected Markdown Style:
{style_def}
Target Language:
{request.language}
Instructions:
- Refine the previous markdown summary.
- Improve clarity and structure.
- Remove redundancy.
- Ensure consistent formatting.
- Keep content length roughly the same as the combined summaries but cleaner.
"""
        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": final_prompt}
                ]
            )
            final_summary = response.choices[0].message.content
        except Exception as e:
             raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")
    return {"markdown": final_summary}