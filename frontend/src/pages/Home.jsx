import React from 'react';
import { Button } from '@/components/ui/button';

const Home = () => {
    const handleGithubSignIn = () => {
        const clientId = "Ov23liGWt1TpZAekTWA5"
        const redirectUri = `http://localhost:3000/auth/github`
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`
        window.location.href = githubAuthUrl
    }
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
                    <Button
                        onClick={handleGithubSignIn}
                        className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2"
                    >
                        Sign-in with Github
                    </Button>
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
