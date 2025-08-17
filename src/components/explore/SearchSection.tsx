import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

interface SearchSectionProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  isSearching?: boolean;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  onSearch,
  searchQuery,
  onSearchQueryChange,
  isSearching = false,
}) => {
  const intl = useIntl();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Search */}
        <div className="relative">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                placeholder={intl.formatMessage({ id: 'explore.searchPlaceholder' })}
                className="pl-10 h-12 text-base bg-background border-border/50 rounded-xl"
              />
            </div>
            <Button 
              type="submit"
              className="h-12 px-6 rounded-xl font-medium"
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="w-5 h-5 animate-spin border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full" />
              ) : (
                intl.formatMessage({ id: 'explore.search' })
              )}
            </Button>
          </div>
        </div>

        {/* Future: Filters row */}
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm">Filters coming soon</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchSection;