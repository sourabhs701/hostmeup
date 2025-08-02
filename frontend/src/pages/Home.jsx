import React from 'react';
import { Button } from '@/components/ui/button';

const Home = () => {
    const handleGithubSignIn = () => {
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID
        console.log(import.meta.env.VITE_GITHUB_CLIENT_ID)
        const redirectUri = `${window.location.origin}/auth/github`
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`
        window.location.href = githubAuthUrl
    }
    return (
        <div className="min-h-screen bg-background flex items-center justify-center flex-col p-4 sm:p-6">
            <div className="max-w-4xl w-full text-center space-y-8 sm:space-y-12">

                <div>
                    <img src="https://cdn.srb.codes/36205701/logo.png" alt="Cloud Logo" className="mx-auto w-20 sm:w-24 md:w-32" />
                </div>

                <div className="space-y-3 sm:space-y-4">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground leading-tight">
                        Effortless Cloud Storage
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
                        Secure and reliable file hosting — store, organize, and share with confidence.
                    </p>
                </div>

                <div className="flex justify-center items-center px-4 sm:px-0">
                    <Button
                        onClick={handleGithubSignIn}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-base sm:text-lg hover:bg-primary/90 transition-colors duration-200 max-w-xs"
                    >
                        Sign in with GitHub
                    </Button>
                </div>

                <div>
                    <p className="text-xs sm:text-sm text-muted-foreground tracking-wide">
                        Secure • Fast • Reliable
                    </p>
                </div>

            </div>
            <div className='max-w-4xl my-10 flex justify-center flex-col items-center' >
                <img src='https://cdn.srb.codes/36205701/system_design.png' className='rounded-3xl' />
            </div>
        </div>
    );
};

export default Home;
