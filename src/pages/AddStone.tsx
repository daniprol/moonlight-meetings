import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EmbeddedMap from '@/components/ui/EmbeddedMap';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { dataProvider } from '@/lib/data-provider/supabase-provider';

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
    <main className="relative min-h-screen starfield">
      <div className="container py-6 space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold stellar-text">Add Your Magical Stone</h1>
          <Progress value={progress} className="h-2 bg-card/60" />
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-foreground/70">Move the map and drop the crosshair on the stone location.</p>
            <div className="relative">
              <EmbeddedMap className="w-full h-[40vh] rounded-xl shadow-cosmic" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-6 w-6 border-2 border-primary rounded-full shadow-glow animate-pulse" />
              </div>
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
              <Button onClick={() => setStep(2)} className="shadow-glow hover:shadow-glow/80">Next</Button>
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
  );
}