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
    <main className="relative min-h-screen pb-24 starfield">
      <div className="container py-6 space-y-6">
        <div>
          <Progress value={progress} className="h-2" />
        </div>

        {step === 1 && (
          <section className="space-y-3">
            <p className="text-sm text-foreground/70">Move the map and drop the crosshair on the stone location.</p>
            <div className="relative">
              <EmbeddedMap className="w-full h-[50vh] rounded-xl" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-6 w-6 border-2 border-primary rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-foreground/70">Latitude</label>
                <Input value={lat ?? ''} onChange={(e) => setLat(parseFloat(e.target.value))} placeholder="40.4168" />
              </div>
              <div>
                <label className="text-xs text-foreground/70">Longitude</label>
                <Input value={lng ?? ''} onChange={(e) => setLng(parseFloat(e.target.value))} placeholder="-3.7038" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)}>Next</Button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-3">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Stone Name" />
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address (optional)" />
            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Next</Button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-3">
            <input type="file" multiple onChange={onFileChange} />
            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={onSubmit}>Submit</Button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
