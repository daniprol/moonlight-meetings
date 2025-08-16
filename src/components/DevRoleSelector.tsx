import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { devConfig, getDevRole, setDevRole } from '@/lib/dev-config';
import { AppRole } from '@/types/auth';

const DevRoleSelector = () => {
  if (!devConfig.enabled) return null;

  const currentRole = getDevRole();
  const roles: AppRole[] = ['normal', 'editor', 'admin'];

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-lg p-3 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="secondary" className="text-xs">DEV MODE</Badge>
        <span className="text-xs text-muted-foreground">Role:</span>
      </div>
      <Select value={currentRole || 'normal'} onValueChange={setDevRole}>
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {roles.map(role => (
            <SelectItem key={role} value={role} className="text-xs">
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DevRoleSelector;