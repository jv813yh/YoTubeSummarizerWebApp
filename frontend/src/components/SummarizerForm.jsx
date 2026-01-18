import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Youtube, Wand2, Check } from 'lucide-react'
import { MARKDOWN_STYLES, LANGUAGES } from '@/lib/constants'
import { cn } from '@/lib/utils'
export function SummarizerForm({ onSummarize, isLoading }) {
    const [url, setUrl] = useState('')
    const [email, setEmail] = useState('')
    const [selectedStyle, setSelectedStyle] = useState(MARKDOWN_STYLES[0].id)
    const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0].id)
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!url) return
        onSummarize({ url, style: selectedStyle, language: selectedLanguage, email })
    }
    return (
        <div className="w-full max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* URL Input */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Youtube className="h-6 w-6 text-red-500" />
                    </div>
                    <input
                        type="url"
                        placeholder="Paste YouTube Link here..."
                        className="w-full pl-14 pr-6 py-6 bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl text-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-slate-700 placeholder:text-slate-400"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                {/* Email Input */}
                <div className="relative group">
                    <input
                        type="email"
                        placeholder="Send summary to email (Optional)..."
                        className="w-full px-6 py-4 bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-slate-700 placeholder:text-slate-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                {/* Options Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Style Selector */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider ml-1">Summary Style</label>
                        <div className="grid grid-cols-1 gap-2">
                            {MARKDOWN_STYLES.map((style) => (
                                <div
                                    key={style.id}
                                    onClick={() => setSelectedStyle(style.id)}
                                    className={cn(
                                        "cursor-pointer p-3 rounded-xl border transition-all flex items-center gap-3",
                                        selectedStyle === style.id
                                            ? "bg-white border-primary-500 shadow-md scale-[1.02]"
                                            : "bg-white/50 border-transparent hover:bg-white hover:shadow-sm"
                                    )}
                                >
                                    <div className={cn(
                                        "w-4 h-4 rounded-full border flex items-center justify-center",
                                        selectedStyle === style.id ? "border-primary-500 bg-primary-500" : "border-slate-300"
                                    )}>
                                        {selectedStyle === style.id && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-800">{style.name}</div>
                                        <div className="text-xs text-slate-400">{style.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Language Selector */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider ml-1">Target Language</label>
                        <div className="grid grid-cols-2 gap-2">
                            {LANGUAGES.map((lang) => (
                                <div
                                    key={lang.id}
                                    onClick={() => setSelectedLanguage(lang.id)}
                                    className={cn(
                                        "cursor-pointer p-3 rounded-xl border transition-all flex items-center gap-3",
                                        selectedLanguage === lang.id
                                            ? "bg-white border-primary-500 shadow-md scale-[1.02]"
                                            : "bg-white/50 border-transparent hover:bg-white hover:shadow-sm"
                                    )}
                                >
                                    <span className="text-xl">{lang.flag}</span>
                                    <span className="font-medium text-slate-700">{lang.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Action Button */}
                <div className="flex justify-center pt-4">
                    <button
                        type="submit"
                        disabled={isLoading || !url}
                        className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white transition-all duration-200 bg-slate-900 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Analyzing Video...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                <span>Generate Summary</span>
                            </div>
                        )}
                    </button>
                </div>
            </form >
        </div >
    )
}