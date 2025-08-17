import { useEffect, useState } from 'react';
import { dataProvider } from '@/lib/data-provider/supabase-provider';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarField } from '@/components/StarField';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import starryBackground from '@/assets/starry-sky-pattern.jpg';
import StoneImage from '@/components/ui/StoneImage';

export default function MyStones() {
  const { user } = useAuth();
  const intl = useIntl();
  const navigate = useNavigate();
  const [myStones, setMyStones] = useState<any[]>([]);

  useEffect(() => {
    document.title = `${intl.formatMessage({ id: 'page.myCollection' })} | ${intl.formatMessage({ id: 'title' })}`;
  }, [intl]);

  useEffect(() => {
    if (user) dataProvider.getStonesByCreator(user.id).then(setMyStones);
  }, [user]);

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
        {/* Header */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border/50">
          <div className="container py-4">
            <h1 className="text-2xl font-semibold text-foreground">{intl.formatMessage({ id: 'page.myCollection' })}</h1>
          </div>
        </div>

        <div className="container py-6 pb-24">
          <Tabs defaultValue="created" className="space-y-6">
            <TabsList className="bg-card border border-border/50 p-1 rounded-xl shadow-sm">
              <TabsTrigger value="created" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg">{intl.formatMessage({ id: 'my.tabs.created', defaultMessage: 'My stones' })}</TabsTrigger>
              <TabsTrigger value="want" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg">{intl.formatMessage({ id: 'my.tabs.wantToVisit' })}</TabsTrigger>
              <TabsTrigger value="reviewed" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg">{intl.formatMessage({ id: 'my.tabs.reviewed' })}</TabsTrigger>
            </TabsList>
            <TabsContent value="created" className="space-y-4">
              {myStones.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <span className="text-2xl">💫</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">{intl.formatMessage({ id: 'my.created.empty.title', defaultMessage: 'No stones added yet' })}</h3>
                    <p className="text-muted-foreground">{intl.formatMessage({ id: 'my.created.empty.description', defaultMessage: 'Add your first stone to see it here.' })}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {myStones.map((s) => (
                    <Card key={s.id} className="bg-card border-border/50 hover:shadow-md transition-all duration-300 rounded-2xl cursor-pointer" onClick={() => navigate(`/stone/${s.id}`)}>
                      <div className="p-4">
                        <div className="flex gap-3">
                          <StoneImage 
                            stoneId={s.id} 
                            stoneName={s.name} 
                            thumbnailPath={s.thumbnail_path}
                            size="md"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-2">{s.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{s.address_text || s.description}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="want" className="py-16 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <span className="text-2xl">🌙</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">{intl.formatMessage({ id: 'my.wantToVisit.title' })}</h3>
                  <p className="text-muted-foreground">{intl.formatMessage({ id: 'my.wantToVisit.description' })}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviewed" className="py-16 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">{intl.formatMessage({ id: 'my.reviewed.title' })}</h3>
                  <p className="text-muted-foreground">{intl.formatMessage({ id: 'my.reviewed.description' })}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}