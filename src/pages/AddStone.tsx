import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EmbeddedMap from '@/components/ui/EmbeddedMap';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { dataProvider } from '@/lib/data-provider/supabase-provider';
import { StarField } from '@/components/StarField';
import heroImage from '@/assets/shining-stone-hero.jpg';

export default function AddStone() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number | undefined>();
  const [lng, setLng] = useState<number | undefined>();
  const [photos, setPhotos] = useState<File[]>([]);

  useEffect(() => {
    document.title = 'Add Stone | Shining Stone';
  }, []);

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
    <div className="relative min-h-screen starfield overflow-hidden">
      <StarField />
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background/90" />

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/60 rounded-full animate-float hidden sm:block" />
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-secondary/80 rounded-full animate-twinkle hidden sm:block" />
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-accent/40 rounded-full animate-pulse hidden sm:block" />

      <main className="relative z-10">
        <div className="container py-6 space-y-6 pb-24">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold stellar-text">Add Your Magical Stone</h1>
            <Progress value={progress} className="h-2 bg-card/60" />
          </div>

          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-foreground/70">Click on the map to set the stone location, or enter coordinates manually.</p>
              <div className="relative">
                <EmbeddedMap 
                  className="w-full h-[40vh] rounded-xl shadow-cosmic" 
                  center={{ lat: lat || 40.4168, lng: lng || -3.7038 }}
                  zoom={lat && lng ? 15 : 5}
                  onMapClick={(position) => {
                    setLat(position.lat);
                    setLng(position.lng);
                  }}
                  markers={lat && lng ? [{ id: 'selected', position: { lat, lng }, title: 'Selected Location' }] : []}
                />
                {(!lat || !lng) && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-6 w-6 border-2 border-primary rounded-full shadow-glow animate-pulse" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-foreground/70 block mb-1">Latitude</label>
                  <Input value={lat ?? ''} onChange={(e) => setLat(parseFloat(e.target.value))} placeholder="40.4168" className="bg-card/60 backdrop-blur" />
                </div>
                <div>
                  <label className="text-xs text-foreground/70 block mb-1">Longitude</label>
                  <Input value={lng ?? ''} onChange={(e) => setLng(parseFloat(e.target.value))} placeholder="-3.7038" className="bg-card/60 backdrop-blur" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!lat || !lng}
                  className="shadow-glow hover:shadow-glow/80 disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Stone Name" className="bg-card/60 backdrop-blur" />
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What makes this spot special for a date?" className="bg-card/60 backdrop-blur min-h-[100px]" />
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address (optional)" className="bg-card/60 backdrop-blur" />
              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(1)} className="bg-card/60 backdrop-blur">Back</Button>
                <Button onClick={() => setStep(3)} className="shadow-glow hover:shadow-glow/80">Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm text-foreground/70 block">Upload photos (optional)</label>
                <input type="file" multiple onChange={onFileChange} className="w-full text-sm text-foreground/80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
              </div>
              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(2)} className="bg-card/60 backdrop-blur">Back</Button>
                <Button onClick={onSubmit} className="shadow-glow hover:shadow-glow/80">✨ Create Stone</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}