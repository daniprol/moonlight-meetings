import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EmbeddedMap from '@/components/ui/EmbeddedMap';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { dataProvider } from '@/lib/data-provider/supabase-provider';
import { StarField } from '@/components/StarField';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useIntl } from 'react-intl';
import starryBackground from '@/assets/starry-sky-pattern.jpg';

export default function AddStone() {
  const { user } = useAuth();
  const intl = useIntl();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number | undefined>();
  const [lng, setLng] = useState<number | undefined>();
  const [photos, setPhotos] = useState<File[]>([]);

  useEffect(() => {
    document.title = `${intl.formatMessage({ id: 'page.addPlace' })} | ${intl.formatMessage({ id: 'title' })}`;
  }, [intl]);

  const progress = useMemo(() => (step / 3) * 100, [step]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setPhotos(Array.from(e.target.files));
  };

  const onSubmit = async () => {
    if (!user) return;
    await dataProvider.addStone(
      { name, description, address_text: address, latitude: lat, longitude: lng },
      photos,
      user.id
    );
    setStep(1);
    setName('');
    setDescription('');
    setAddress('');
    setPhotos([]);
    alert('Stone added!');
  };

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
            <h1 className="text-2xl font-semibold text-foreground">{intl.formatMessage({ id: 'page.addPlace' })}</h1>
          </div>
        </div>

        <div className="container py-6 space-y-6 pb-24">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-foreground">{intl.formatMessage({ id: 'addStone.step' })} {step} {intl.formatMessage({ id: 'addStone.of' })} 3</h2>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% {intl.formatMessage({ id: 'addStone.complete' })}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">{intl.formatMessage({ id: 'addStone.step1.title' })}</h3>
                <p className="text-sm text-muted-foreground">{intl.formatMessage({ id: 'addStone.step1.description' })}</p>
              </div>
              
              <div className="bg-card rounded-2xl p-1 shadow-sm border border-border/50">
                <div className="relative">
                  <EmbeddedMap className="w-full h-[350px] rounded-xl" />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-6 w-6 border-2 border-primary rounded-full bg-background shadow-md" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{intl.formatMessage({ id: 'addStone.latitude' })}</label>
                  <Input 
                    value={lat ?? ''} 
                    onChange={(e) => setLat(parseFloat(e.target.value))} 
                    placeholder="40.4168" 
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{intl.formatMessage({ id: 'addStone.longitude' })}</label>
                  <Input
                    value={lng ?? ''} 
                    onChange={(e) => setLng(parseFloat(e.target.value))} 
                    placeholder="-3.7038" 
                    className="h-12"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} className="h-12 px-6">{intl.formatMessage({ id: 'addStone.continue' })}</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">{intl.formatMessage({ id: 'addStone.step2.title' })}</h3>
                <p className="text-sm text-muted-foreground">{intl.formatMessage({ id: 'addStone.step2.description' })}</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{intl.formatMessage({ id: 'addStone.placeName' })}</label>
                  <Input
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder={intl.formatMessage({ id: 'addStone.placeNamePlaceholder' })}
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{intl.formatMessage({ id: 'addStone.description' })}</label>
                  <Textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder={intl.formatMessage({ id: 'addStone.descriptionPlaceholder' })}
                    className="min-h-[120px] resize-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{intl.formatMessage({ id: 'addStone.address' })}</label>
                  <Input 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    placeholder={intl.formatMessage({ id: 'addStone.addressPlaceholder' })}
                    className="h-12"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="h-12 flex-1">{intl.formatMessage({ id: 'addStone.back' })}</Button>
                <Button onClick={() => setStep(3)} className="h-12 flex-1">{intl.formatMessage({ id: 'addStone.continue' })}</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">{intl.formatMessage({ id: 'addStone.step3.title' })}</h3>
                <p className="text-sm text-muted-foreground">{intl.formatMessage({ id: 'addStone.step3.description' })}</p>
              </div>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center bg-muted/20">
                  <input 
                    type="file" 
                    multiple 
                    onChange={onFileChange} 
                    className="w-full text-sm text-foreground file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-2">{intl.formatMessage({ id: 'addStone.photos' })}</p>
                </div>
                
                {photos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">{photos.length} {intl.formatMessage({ id: 'addStone.photosSelected' })}</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      {photos.map((file, i) => (
                        <div key={i}>{file.name}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="h-12 flex-1">{intl.formatMessage({ id: 'addStone.back' })}</Button>
                <Button onClick={onSubmit} className="h-12 flex-1">{intl.formatMessage({ id: 'addStone.createPlace' })}</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}