from youtube_transcript_api import YouTubeTranscriptApi
import sys
print(f"Python executable: {sys.executable}")
print("Inspecting YouTubeTranscriptApi object:")
try:
    print(dir(YouTubeTranscriptApi))
    print(f"Has get_transcript: {hasattr(YouTubeTranscriptApi, 'get_transcript')}")
except Exception as e:
    print(f"Error inspecting: {e}")