// frontend/src/components/ReviewsList.tsx

import React, { useState, useEffect } from 'react';
import { Review } from '../types';
import { Star, ThumbsUp, ShieldCheck, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reviewService } from '../services/api';

interface ReviewsListProps {
  reviews: Review[];
  onReviewDeleted: () => void;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, onReviewDeleted }) => {
  const { user, isAuthenticated } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [likedReviews, setLikedReviews] = useState<Set<string>>(
    new Set(reviews.filter(r => r.isLiked).map(r => r.id))
  );
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>(
    reviews.reduce((acc, r) => {
      acc[r.id] = r.helpfulCount;
      return acc;
    }, {} as Record<string, number>)
  );

  // Update state when reviews change
  useEffect(() => {
    setLikedReviews(new Set(reviews.filter(r => r.isLiked).map(r => r.id)));
    setHelpfulCounts(reviews.reduce((acc, r) => {
      acc[r.id] = r.helpfulCount;
      return acc;
    }, {} as Record<string, number>));
  }, [reviews]);

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      setDeletingId(reviewId);
      await reviewService.deleteReview(reviewId);
      onReviewDeleted();
    } catch (err) {
      alert('Failed to delete review');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleHelpful = async (reviewId: string) => {
    if (!isAuthenticated) {
      alert('Please login to like reviews');
      return;
    }

    try {
      const wasLiked = likedReviews.has(reviewId);
      const currentCount = helpfulCounts[reviewId] || 0;

      // Optimistic update
      setLikedReviews(prev => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.delete(reviewId);
        } else {
          newSet.add(reviewId);
        }
        return newSet;
      });

      setHelpfulCounts(prev => ({
        ...prev,
        [reviewId]: wasLiked ? currentCount - 1 : currentCount + 1,
      }));

      const updatedReview = await reviewService.markHelpful(reviewId);
      
      // Update with actual data from server
      setHelpfulCounts(prev => ({
        ...prev,
        [reviewId]: updatedReview.helpfulCount,
      }));
      
      setLikedReviews(prev => {
        const newSet = new Set(prev);
        if (updatedReview.isLiked) {
          newSet.add(reviewId);
        } else {
          newSet.delete(reviewId);
        }
        return newSet;
      });
    } catch (err) {
      // Revert optimistic update on error
      const wasLiked = likedReviews.has(reviewId);
      const currentCount = helpfulCounts[reviewId] || 0;
      
      setLikedReviews(prev => {
        const newSet = new Set(prev);
        if (!wasLiked) {
          newSet.delete(reviewId);
        } else {
          newSet.add(reviewId);
        }
        return newSet;
      });

      setHelpfulCounts(prev => ({
        ...prev,
        [reviewId]: wasLiked ? currentCount + 1 : currentCount - 1,
      }));

      console.error('Failed to toggle helpful');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (reviews.length === 0) {
    return (
      <div className=" py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No reviews yet. Be the first to review this game!</p>
      </div>
    );
  }

  // Calculate average rating
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div>
      {/* Summary */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-4">
          <div className="">
            <div className="text-4xl text-center font-bold text-blue-600">
              {avgRating}
            </div>
            <div className="flex mt-1">
              {renderStars(Math.round(avgRating))}
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </p>
            <p className="text-sm text-gray-600">
              {reviews.filter(r => r.isVerifiedPurchase).length} verified purchases
            </p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex gap-2 mb-2">
                  <span className="font-semibold text-gray-800">
                    {review.user?.username || 'Anonymous'}
                  </span>
                  {review.isVerifiedPurchase && (
                    <span className="flex gap-1 text-green-600 text-sm">
                      <ShieldCheck className="w-4 h-4" />
                      Verified Purchase
                    </span>
                  )}
                </div>
                {renderStars(review.rating)}
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {new Date(review.reviewDate).toLocaleDateString()}
                </p>
                {user && user.id === review.userId && (
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={deletingId === review.id}
                    className="mt-2 text-red-600 hover:text-red-700 text-sm flex  gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            </div>

            <p className="text-gray-700 mb-3 leading-relaxed">{review.comment}</p>

            <div className="flex gap-4 text-sm text-gray-600">
              <button
                onClick={() => handleToggleHelpful(review.id)}
                disabled={!isAuthenticated}
                className={`flex items-center gap-1 transition-colors ${
                  likedReviews.has(review.id)
                    ? 'text-blue-600'
                    : 'hover:text-blue-600'
                } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                title={!isAuthenticated ? 'Login to like reviews' : likedReviews.has(review.id) ? 'Unlike' : 'Like'}
              >
                <ThumbsUp 
                  className={`w-4 h-4 ${likedReviews.has(review.id) ? 'fill-current' : ''}`}
                />
                Helpful ({helpfulCounts[review.id] || review.helpfulCount})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;