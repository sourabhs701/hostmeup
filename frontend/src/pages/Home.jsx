import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-4xl mx-auto text-center space-y-12">
                {/* Main Content */}
                <div className="space-y-8">
                    <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                        Welcome to <span className="text-primary">HostMeUp</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Your secure and reliable file hosting solution. Store, organize, and share your files with ease.
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        to="/register"
                        className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2"
                    >
                        Get Started
                    </Link>

                    <Link
                        to="/login"
                        className="px-8 py-4 bg-card text-card-foreground border border-border rounded-lg font-semibold text-lg hover:bg-accent transition-colors duration-200 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Sign In
                    </Link>
                </div>

                {/* Simple Feature Highlight */}
                <div className="pt-8">
                    <p className="text-sm text-muted-foreground">
                        Secure • Fast • Reliable
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;
