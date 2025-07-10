import { useState, useEffect } from 'react';
import { Database, Cloud, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ConnectionStatus {
  postgresql: 'connected' | 'disconnected' | 'checking';
  firebase: 'connected' | 'disconnected' | 'checking';
}

export function ConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    postgresql: 'checking',
    firebase: 'checking'
  });

  useEffect(() => {
    checkConnections();
    const interval = setInterval(checkConnections, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkConnections = async () => {
    try {
      // Check PostgreSQL connection
      const pgResponse = await fetch('/api/health/postgres');
      const pgStatus = pgResponse.ok ? 'connected' : 'disconnected';

      // Check Firebase connection by testing a simple query
      const firebaseResponse = await fetch('/api/programs?limit=1');
      const firebaseStatus = firebaseResponse.ok ? 'connected' : 'disconnected';

      setStatus({
        postgresql: pgStatus,
        firebase: firebaseStatus
      });
    } catch (error) {
      setStatus({
        postgresql: 'disconnected',
        firebase: 'disconnected'
      });
    }
  };

  const getStatusIcon = (connectionStatus: string) => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'disconnected':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      case 'checking':
        return <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />;
      default:
        return <AlertCircle className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStatusColor = (connectionStatus: string) => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'checking':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 right-4 z-40 flex flex-col space-y-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`flex items-center space-x-2 px-3 py-1 cursor-pointer transition-all duration-200 hover:scale-105 rounded-full border border-border ${getStatusColor(status.postgresql)}`}
            >
              <Database className="w-3 h-3" />
              {getStatusIcon(status.postgresql)}
              <span className="text-xs font-medium">PostgreSQL</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>PostgreSQL: {status.postgresql}</p>
            <p className="text-xs text-muted-foreground">Used for images and sessions</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`flex items-center space-x-2 px-3 py-1 cursor-pointer transition-all duration-200 hover:scale-105 rounded-full border border-border ${getStatusColor(status.firebase)}`}
            >
              <Cloud className="w-3 h-3" />
              {getStatusIcon(status.firebase)}
              <span className="text-xs font-medium">Firebase</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Firebase: {status.firebase}</p>
            <p className="text-xs text-muted-foreground">Used for program and activity data</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}