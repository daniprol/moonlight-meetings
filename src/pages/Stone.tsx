import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataProvider } from '@/lib/data-provider/supabase-provider';
import { useAuth } from '@/contexts/AuthContext';
import { Stone, Review } from '@/lib/data-provider/interface';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { StarField } from '@/components/StarField';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import EmbeddedMap from '@/components/ui/EmbeddedMap';
import { useToast } from '@/hooks/use-toast';
import { useIntl } from 'react-intl';
import { ArrowLeft, Star, MapPin, Calendar, Camera, MessageCircle, Heart } from 'lucide-react';
import starryBackground from '@/assets/starry-sky-pattern.jpg';

export default function StonePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const intl = useIntl();
  const { toast } = useToast();
  
  const [stone, setStone] = useState<Stone | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadStone();
  }, [id]);

  useEffect(() => {
    if (stone) {
      document.title = `${stone.name} | ${intl.formatMessage({ id: 'title' })}`;
    }
  }, [stone, intl]);

  const loadStone = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [stoneData, reviewsData] = await Promise.all([
        dataProvider.getStoneById(id),
        dataProvider.getReviewsForStone(id)
      ]);
      
      if (!stoneData) {
        navigate('/not-found');
        return;
      }
      
      setStone(stoneData);
      setReviews(reviewsData);
      
      // Check if favorited (when we have favorites functionality)
      if (user) {
        try {
          const favorites = await dataProvider.getFavoriteStones(user.id);
          setIsFavorite(favorites.some(fav => fav.id === id));
        } catch (err) {
          console.log('Could not load favorites');
        }
      }
    } catch (error) {
      console.error('Error loading stone:', error);
      toast({
        title: "Error",
        description: "Failed to load stone details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user || !stone) return;
    
    try {
      if (isFavorite) {
        await dataProvider.removeFavorite(user.id, stone.id);
        setIsFavorite(false);
        toast({ title: "Removed from favorites" });
      } else {
        await dataProvider.addFavorite(user.id, stone.id);
        setIsFavorite(true);
        toast({ title: "Added to favorites" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive"
      });
    }
  };

  const handleReviewSubmit = async () => {
    if (!user || !stone || !newReview.comment.trim()) return;
    
    try {
      setSubmittingReview(true);
      const review = await dataProvider.addReview({
        stone_id: stone.id,
        rating: newReview.rating,
        comment: newReview.comment
      }, user.id);
      
      setReviews(prev => [review, ...prev]);
      setNewReview({ rating: 5, comment: '' });
      
      // Reload stone to get updated average rating
      const updatedStone = await dataProvider.getStoneById(stone.id);
      if (updatedStone) setStone(updatedStone);
      
      toast({ title: "Review added successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add review",
        variant: "destructive"
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={interactive ? () => onRatingChange?.(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`h-4 w-4 ${
                star <= rating 
                  ? 'fill-primary text-primary' 
                  : 'fill-muted text-muted-foreground'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Stone not found</h2>
          <Button onClick={() => navigate('/explore')}>Back to Explore</Button>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="p-2 h-auto"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-foreground truncate">{stone.name}</h1>
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFavoriteToggle}
                  className="ml-auto p-2 h-auto"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="container py-6 space-y-6 pb-24">
          {/* Photos Section */}
          <Card className="bg-card border-border/50 rounded-2xl overflow-hidden">
            <div className="aspect-[4/3] bg-muted flex items-center justify-center relative">
              {photos.length > 0 ? (
                <img 
                  src={photos[0]} 
                  alt={stone.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Camera className="h-12 w-12" />
                  <p className="text-sm">No photos available</p>
                </div>
              )}
              {photos.length > 1 && (
                <Badge variant="secondary" className="absolute bottom-3 right-3">
                  +{photos.length - 1} more
                </Badge>
              )}
            </div>
          </Card>

          {/* Stone Info */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl font-bold text-foreground">{stone.name}</h1>
                <div className="flex items-center gap-2 shrink-0">
                  {renderStars(Math.round(stone.average_rating))}
                  <span className="text-sm font-medium">{stone.average_rating.toFixed(1)}</span>
                </div>
              </div>
              
              {stone.address_text && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{stone.address_text}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Added {new Date(stone.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {stone.description && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{stone.description}</p>
                </div>
              </>
            )}
          </div>

          {/* Map */}
          {stone.latitude && stone.longitude && (
            <Card className="bg-card border-border/50 rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <EmbeddedMap
                  center={{ lat: stone.latitude, lng: stone.longitude }}
                  zoom={15}
                  className="w-full h-[300px] rounded-2xl"
                />
              </CardContent>
            </Card>
          )}

          {/* Reviews Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Reviews ({reviews.length})
              </h2>
            </div>

            {/* Add Review */}
            {user && (
              <Card className="bg-card border-border/50 rounded-2xl">
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-medium text-foreground">Write a review</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Rating</label>
                    {renderStars(newReview.rating, true, (rating) => 
                      setNewReview(prev => ({ ...prev, rating }))
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Comment</label>
                    <Textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Share your experience..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                  
                  <Button
                    onClick={handleReviewSubmit}
                    disabled={!newReview.comment.trim() || submittingReview}
                    className="w-full"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <Card className="bg-card border-border/50 rounded-2xl">
                <CardContent className="p-8 text-center">
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                      <MessageCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-foreground">No reviews yet</h3>
                    <p className="text-sm text-muted-foreground">Be the first to share your experience!</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <Card key={review.id} className="bg-card border-border/50 rounded-2xl">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          {renderStars(review.rating)}
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-foreground leading-relaxed">{review.comment}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}