import React from 'react'

export function Hero() {
    return (
        <div className="text-center py-12 md:py-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                AI-Powered Summarization
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                Unlock insights from <br />
                <span className="bg-gradient-to-br from-primary-600 to-purple-600 bg-clip-text text-transparent">
                    any video content
                </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed">
                Transform hours of video content into concise, structured summaries.
                Choose your style, language, and let AI do the heavy lifting.
            </p>
        </div>
    )
}
