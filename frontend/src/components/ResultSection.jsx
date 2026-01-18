import React from 'react'
import ReactMarkdown from 'react-markdown'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export function ResultSection({ markdown }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(markdown)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (!markdown) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto mt-12 mb-20"
        >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/40 overflow-hidden">
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white/50">
                    <h2 className="text-xl font-bold text-slate-800">Summary Result</h2>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy Markdown'}
                    </button>
                </div>

                <div className="p-8 md:p-12 overflow-x-auto">
                    <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-primary-600 prose-strong:text-slate-800 prose-code:text-primary-600 prose-code:bg-primary-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none">
                        <ReactMarkdown>{markdown}</ReactMarkdown>
                    </article>
                </div>
            </div>
        </motion.div>
    )
}
