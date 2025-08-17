import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useIntl } from 'react-intl';
import { Button } from '@/components/ui/button';
import { StarField } from '@/components/StarField';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ArrowLeft } from 'lucide-react';
import starryBackground from '@/assets/starry-sky-pattern.jpg';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Set contextual error message based on the route
    if (location.pathname.startsWith('/stone/')) {
      setErrorMessage("The stone you're trying to visit doesn't exist yet");
    } else if (location.pathname.startsWith('/profile/')) {
      setErrorMessage("This profile has vanished like a precious gem");
    } else {
      setErrorMessage("This path leads to nowhere, just like a lost stone");
    }

    // Set page title
    document.title = `Page Not Found | ${intl.formatMessage({ id: 'title' })}`;
  }, [location.pathname, intl]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Generate a random stone-themed funny title
  const stoneTitles = [
    "Oops! This gem went missing",
    "404: Stone not found in our quarry",
    "This page crumbled away",
    "Lost in the stone age",
    "No precious stones here",
    "This rock rolled away"
  ];
  
  const randomTitle = stoneTitles[Math.floor(Math.random() * stoneTitles.length)];

  return (
    <div className="min-h-screen bg-background">
      <StarField />
      
      {/* Subtle background pattern */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${starryBackground})` }}
      />
      
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      
      <main className="relative z-10 min-h-screen">
        {/* Header with back button */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border/50">
          <div className="container py-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
                className="h-10 w-10 p-0 rounded-xl hover:bg-muted"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-semibold text-foreground">404</h1>
            </div>
          </div>
        </div>

        <div className="container py-6 pb-24">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            {/* Large gemstone icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mb-4">
              <svg 
                viewBox="0 0 24 24" 
                className="w-12 h-12 text-primary"
                fill="currentColor"
              >
                <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z"/>
                <path d="M12 2v20" stroke="white" strokeWidth="0.5" opacity="0.3"/>
                <path d="M4 7l8 5 8-5" stroke="white" strokeWidth="0.5" opacity="0.3"/>
                <circle cx="8" cy="6" r="1" fill="white" opacity="0.6"/>
                <circle cx="16" cy="10" r="0.5" fill="white" opacity="0.8"/>
                <circle cx="10" cy="15" r="0.8" fill="white" opacity="0.4"/>
              </svg>
            </div>

            {/* Funny title */}
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-foreground">{randomTitle}</h2>
              <div className="max-w-md mx-auto">
                <p className="text-lg text-muted-foreground mb-2">404 - Page Not Found</p>
                {errorMessage && (
                  <p className="text-sm text-muted-foreground/80 italic">
                    {errorMessage}
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleGoBack}
                variant="outline" 
                className="h-12 px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="h-12 px-6"
              >
                Return Home
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
