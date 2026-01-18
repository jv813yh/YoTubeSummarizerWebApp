import React from 'react'

export function Layout({ children }) {
    return (
        <div className="min-h-screen w-full bg-[#fdfaf6] relative overflow-hidden font-sans text-slate-800 selection:bg-primary-100 selection:text-primary-900">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-100/60 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-100/40 rounded-full blur-[90px] pointer-events-none" />

            {/* Grid Pattern (Optional subtle texture) */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wMykiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />

            {/* Navbar Placeholder */}
            <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                <div className="font-bold text-2xl tracking-tighter bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                    VendyGo
                </div>
                <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                    <a href="#" className="hover:text-primary-600 transition-colors">Services</a>
                    <a href="#" className="hover:text-primary-600 transition-colors">About us</a>
                </div>
                <button className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                    Contact us
                </button>
            </nav>

            {/* Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-10">
                {children}
            </main>
        </div>
    )
}
