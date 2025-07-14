
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home, ArrowLeft, ArrowRight } from 'lucide-react';

interface WebViewFrameProps {
  url: string;
}

const WebViewFrame: React.FC<WebViewFrameProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setCurrentUrl(url);
  }, [url]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    // In a real app, we would track navigation state here
    // For this demo, we'll simulate it
    setCanGoBack(Math.random() > 0.3);
    setCanGoForward(Math.random() > 0.7);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = currentUrl;
    }
  };

  const handleGoBack = () => {
    // In a real app, we would use the webview's history API
    // For this demo, we'll just simulate it
    setIsLoading(true);
    setTimeout(() => {
      setCanGoBack(Math.random() > 0.5);
      setCanGoForward(true);
      setIsLoading(false);
    }, 500);
  };

  const handleGoForward = () => {
    // In a real app, we would use the webview's history API
    // For this demo, we'll just simulate it
    setIsLoading(true);
    setTimeout(() => {
      setCanGoBack(true);
      setCanGoForward(Math.random() > 0.5);
      setIsLoading(false);
    }, 500);
  };

  const handleGoHome = () => {
    setIsLoading(true);
    setCurrentUrl(url);
  };

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="bg-muted p-2 flex items-center space-x-2 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleGoBack}
          disabled={!canGoBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleGoForward}
          disabled={!canGoForward}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleRefresh}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleGoHome}
        >
          <Home className="h-4 w-4" />
        </Button>
        <div className="flex-1 truncate text-xs bg-background rounded px-2 py-1">
          {currentUrl}
        </div>
      </div>
      <div className="relative flex-1 min-h-[500px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={currentUrl}
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          title="School Web App"
          sandbox="allow-same-origin allow-scripts allow-forms"
        />
      </div>
    </Card>
  );
};

export default WebViewFrame;