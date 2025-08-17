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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { NavigationGuard } from '@/components/forms/NavigationGuard';
import starryBackground from '@/assets/starry-sky-pattern.jpg';

// Form validation schema with internationalized messages
const createFormSchema = (intl: any) => z.object({
  latitude: z.number({
    required_error: intl.formatMessage({ id: 'form.validation.latitudeRequired' }),
    invalid_type_error: intl.formatMessage({ id: 'form.validation.latitudeInvalid' }),
  }).min(-90, intl.formatMessage({ id: 'form.validation.latitudeRange' }))
    .max(90, intl.formatMessage({ id: 'form.validation.latitudeRange' })),
  longitude: z.number({
    required_error: intl.formatMessage({ id: 'form.validation.longitudeRequired' }), 
    invalid_type_error: intl.formatMessage({ id: 'form.validation.longitudeInvalid' }),
  }).min(-180, intl.formatMessage({ id: 'form.validation.longitudeRange' }))
    .max(180, intl.formatMessage({ id: 'form.validation.longitudeRange' })),
  name: z.string()
    .min(1, intl.formatMessage({ id: 'form.validation.nameRequired' }))
    .min(3, intl.formatMessage({ id: 'form.validation.nameMinLength' }))
    .max(100, intl.formatMessage({ id: 'form.validation.nameMaxLength' })),
  description: z.string()
    .max(500, intl.formatMessage({ id: 'form.validation.descriptionMaxLength' }))
    .optional(),
  address: z.string()
    .max(200, intl.formatMessage({ id: 'form.validation.addressMaxLength' }))
    .optional(),
  photos: z.instanceof(FileList).optional(),
});

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

export default function AddStone() {
  const { user } = useAuth();
  const intl = useIntl();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create schema with current intl instance
  const formSchema = createFormSchema(intl);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      latitude: undefined,
      longitude: undefined,
      name: "",
      description: "",
      address: "",
    },
  });

  // Check if form has been modified (for navigation guard)
  const isFormDirty = form.formState.isDirty && step > 1;

  useEffect(() => {
    document.title = `${intl.formatMessage({ id: 'page.addPlace' })} | ${intl.formatMessage({ id: 'title' })}`;
  }, [intl]);

  const progress = useMemo(() => (step / 3) * 100, [step]);

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: intl.formatMessage({ id: 'form.status.error' }),
        description: intl.formatMessage({ id: 'form.status.loginRequired' }),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const photos = values.photos ? Array.from(values.photos) : [];
      
      await dataProvider.addStone(
        { 
          name: values.name, 
          description: values.description || '', 
          address_text: values.address || '', 
          latitude: values.latitude, 
          longitude: values.longitude 
        },
        photos,
        user.id
      );

      toast({
        title: intl.formatMessage({ id: 'form.status.success' }),
        description: intl.formatMessage({ id: 'form.status.successMessage' }),
      });

      // Reset form and go back to step 1
      form.reset();
      setStep(1);
    } catch (error) {
      toast({
        title: intl.formatMessage({ id: 'form.status.error' }),
        description: intl.formatMessage({ id: 'form.status.errorMessage' }),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStep = async (targetStep: number) => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    
    if (targetStep > 1) {
      fieldsToValidate = ['latitude', 'longitude'];
    }
    if (targetStep > 2) {
      fieldsToValidate = [...fieldsToValidate, 'name'];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(targetStep);
    }
  };

  const goToNextStep = () => validateStep(step + 1);
  const goToPrevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-background">
      <StarField />
      
      {/* Navigation Guard */}
      <NavigationGuard
        shouldBlock={isFormDirty}
        confirmationTitle={intl.formatMessage({ id: 'form.confirmation.title' })}
        confirmationMessage={intl.formatMessage({ id: 'form.confirmation.message' })}
        onNavigationAllowed={() => {
          form.reset();
          setStep(1);
        }}
      />
      
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{intl.formatMessage({ id: 'addStone.latitude' })} *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              type="number"
                              step="any"
                              placeholder="40.4168"
                              className="h-12"
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{intl.formatMessage({ id: 'addStone.longitude' })} *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="any"
                              placeholder="-3.7038"
                              className="h-12"
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="button" onClick={goToNextStep} className="h-12 px-6">
                      {intl.formatMessage({ id: 'addStone.continue' })}
                    </Button>
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
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{intl.formatMessage({ id: 'addStone.placeName' })} *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={intl.formatMessage({ id: 'addStone.placeNamePlaceholder' })}
                              className="h-12"
                            />
                          </FormControl>
                          <FormDescription>
                            {intl.formatMessage({ id: 'form.description.placeName' })}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{intl.formatMessage({ id: 'addStone.description' })}</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              placeholder={intl.formatMessage({ id: 'addStone.descriptionPlaceholder' })}
                              className="min-h-[120px] resize-none"
                            />
                          </FormControl>
                          <FormDescription>
                            {intl.formatMessage({ id: 'form.description.description' })}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{intl.formatMessage({ id: 'addStone.address' })}</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              placeholder={intl.formatMessage({ id: 'addStone.addressPlaceholder' })}
                              className="h-12"
                            />
                          </FormControl>
                          <FormDescription>
                            {intl.formatMessage({ id: 'form.description.address' })}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={goToPrevStep} className="h-12 flex-1">
                      {intl.formatMessage({ id: 'addStone.back' })}
                    </Button>
                    <Button type="button" onClick={goToNextStep} className="h-12 flex-1">
                      {intl.formatMessage({ id: 'addStone.continue' })}
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">{intl.formatMessage({ id: 'addStone.step3.title' })}</h3>
                    <p className="text-sm text-muted-foreground">{intl.formatMessage({ id: 'addStone.step3.description' })}</p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="photos"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>{intl.formatMessage({ id: 'addStone.photos' })}</FormLabel>
                        <FormControl>
                          <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center bg-muted/20">
                            <input 
                              {...field}
                              type="file" 
                              multiple 
                              accept="image/*"
                              onChange={(e) => onChange(e.target.files)}
                              className="w-full text-sm text-foreground file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                              {intl.formatMessage({ id: 'form.description.photos' })}
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                        
                        {value && value.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground">
                              {value.length} {intl.formatMessage({ id: 'addStone.photosSelected' })}
                            </p>
                            <div className="text-xs text-muted-foreground space-y-1">
                              {Array.from(value).map((file, i) => (
                                <div key={i}>{file.name}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={goToPrevStep} className="h-12 flex-1">
                      {intl.formatMessage({ id: 'addStone.back' })}
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="h-12 flex-1">
                      {isSubmitting 
                        ? intl.formatMessage({ id: 'form.status.creating' }) 
                        : intl.formatMessage({ id: 'addStone.createPlace' })
                      }
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}