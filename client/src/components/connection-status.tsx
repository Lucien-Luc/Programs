import { useState, useEffect } from 'react';
import { Database, Cloud, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ConnectionStatus {
  firebase: 'connected' | 'disconnected' | 'checking';
  postgres: 'connected' | 'disconnected' | 'checking';
  lastChecked: Date;
}

export function ConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    firebase: 'checking',
    postgres: 'checking',
    lastChecked: new Date()
  });

  const checkConnections = async () => {
    setStatus(prev => ({
      ...prev,
      firebase: 'checking',
      postgres: 'checking'
    }));

    try {
      // Check Firebase connection
      const firebaseResponse = await fetch('/api/health/firebase');
      const firebaseStatus = firebaseResponse.ok ? 'connected' : 'disconnected';

      // Check PostgreSQL connection
      const postgresResponse = await fetch('/api/health/postgres');
      const postgresStatus = postgresResponse.ok ? 'connected' : 'disconnected';

      setStatus({
        firebase: firebaseStatus,
        postgres: postgresStatus,
        lastChecked: new Date()
      });
    } catch (error) {
      setStatus({
        firebase: 'disconnected',
        postgres: 'disconnected',
        lastChecked: new Date()
      });
    }
  };

  useEffect(() => {
    checkConnections();
    // Check every 30 seconds
    const interval = setInterval(checkConnections, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (connectionStatus: 'connected' | 'disconnected' | 'checking') => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'checking':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    }
  };

  const getStatusBadge = (connectionStatus: 'connected' | 'disconnected' | 'checking', label: string) => {
    const variant = connectionStatus === 'connected' ? 'default' : 
                   connectionStatus === 'disconnected' ? 'destructive' : 'secondary';
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {getStatusIcon(connectionStatus)}
        {label}
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium">Database Status</span>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(status.firebase, 'Firebase')}
              {getStatusBadge(status.postgres, 'PostgreSQL')}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Last checked: {status.lastChecked.toLocaleTimeString()}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkConnections}
              disabled={status.firebase === 'checking' || status.postgres === 'checking'}
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for navigation or smaller spaces
export function CompactConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    firebase: 'checking',
    postgres: 'checking',
    lastChecked: new Date()
  });

  const checkConnections = async () => {
    try {
      const [firebaseResponse, postgresResponse] = await Promise.all([
        fetch('/api/health/firebase'),
        fetch('/api/health/postgres')
      ]);

      setStatus({
        firebase: firebaseResponse.ok ? 'connected' : 'disconnected',
        postgres: postgresResponse.ok ? 'connected' : 'disconnected',
        lastChecked: new Date()
      });
    } catch (error) {
      setStatus({
        firebase: 'disconnected',
        postgres: 'disconnected',
        lastChecked: new Date()
      });
    }
  };

  useEffect(() => {
    checkConnections();
    const interval = setInterval(checkConnections, 30000);
    return () => clearInterval(interval);
  }, []);

  const allConnected = status.firebase === 'connected' && status.postgres === 'connected';
  const anyDisconnected = status.firebase === 'disconnected' || status.postgres === 'disconnected';
  const isChecking = status.firebase === 'checking' || status.postgres === 'checking';

  const getOverallStatus = () => {
    if (isChecking) return { icon: Loader2, color: 'text-blue-500', label: 'Checking...' };
    if (allConnected) return { icon: CheckCircle, color: 'text-green-500', label: 'All systems operational' };
    if (anyDisconnected) return { icon: AlertCircle, color: 'text-red-500', label: 'Connection issues detected' };
    return { icon: AlertCircle, color: 'text-yellow-500', label: 'Partial connectivity' };
  };

  const statusInfo = getOverallStatus();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="flex items-center gap-2">
      <StatusIcon className={`w-4 h-4 ${statusInfo.color} ${isChecking ? 'animate-spin' : ''}`} />
      <span className="text-sm font-medium">{statusInfo.label}</span>
    </div>
  );
}