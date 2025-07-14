
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home, ArrowLeft, ArrowRight } from 'lucide-react';

interface WebViewFrameProps {
  url: string;
}

const WebViewFrame: React.FC<WebViewFrameProps> = ({ url }) => {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<string[]>([url]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Reset state when URL prop changes
    setCurrentUrl(url);
    setHistory([url]);
    setHistoryIndex(0);
    setError(null);
    setIsLoading(true);
  }, [url]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load the school web app. Please check the URL and try again.');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = currentUrl;
    }
  };

  const handleGoHome = () => {
    setIsLoading(true);
    setCurrentUrl(url);
    setHistory([...history.slice(0, historyIndex + 1), url]);
    setHistoryIndex(historyIndex + 1);
  };

  const handleGoBack = () => {
    if (historyIndex > 0) {
      setIsLoading(true);
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
    }
  };

  const handleGoForward = () => {
    if (historyIndex < history.length - 1) {
      setIsLoading(true);
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-4 bg-gray-100 p-2 rounded-md">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGoBack}
          disabled={historyIndex === 0}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGoForward}
          disabled={historyIndex >= history.length - 1}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGoHome}
        >
          <Home className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
        <div className="flex-1 truncate bg-white px-3 py-1 text-sm rounded border">
          {currentUrl}
        </div>
      </div>

      {error ? (
        <Card className="flex-1">
          <CardContent className="flex flex-col items-center justify-center h-full p-6">
            <div className="text-red-500 text-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 mx-auto mb-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
              <h3 className="text-lg font-medium mb-2">Connection Error</h3>
              <p className="text-sm">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={handleRefresh}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="relative flex-1 min-h-[500px]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-sm text-gray-600">Loading school web app...</p>
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={currentUrl}
            className="w-full h-full border-0 rounded-md"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            title="School Web App"
          />
        </div>
      )}
    </div>
  );
};

export default WebViewFrame;