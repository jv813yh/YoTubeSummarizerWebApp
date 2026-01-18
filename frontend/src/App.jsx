import React, { useState } from 'react'
import { Layout } from '@/layouts/Layout'
import { Hero } from '@/components/Hero'
import { SummarizerForm } from '@/components/SummarizerForm'
import { ResultSection } from '@/components/ResultSection'

function App() {
    const [summary, setSummary] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSummarize = async ({ url, style, language }) => {
        setIsLoading(true)
        setError(null)
        setSummary(null)

        try {
            // In production, use env var. Localhost for now.
            const response = await fetch('http://localhost:8000/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, style, language }),
            })

            if (!response.ok) {
                throw new Error('Failed to fetch summary')
            }

            const data = await response.json()
            setSummary(data.markdown)
        } catch (err) {
            console.error(err)
            setError('Something went wrong. Please check usage limits or try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Layout>
            <Hero />
            <SummarizerForm onSummarize={handleSummarize} isLoading={isLoading} />

            {error && (
                <div className="max-w-md mx-auto mt-8 p-4 bg-red-50 text-red-600 rounded-xl text-center font-medium border border-red-100">
                    {error}
                </div>
            )}

            {summary && <ResultSection markdown={summary} />}
        </Layout>
    )
}

export default App
