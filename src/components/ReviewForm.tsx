// frontend/src/components/ReviewForm.tsx

import React, { useState, FormEvent } from 'react';
import { Star } from 'lucide-react';
import { reviewService } from '../services/api';

interface ReviewFormProps {
  gameId: string;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ gameId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment.length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await reviewService.createReview({
        gameId,
        rating,
        comment,
      });
      
      // Reset form
      setRating(0);
      setComment('');
      
      // Notify parent
      onReviewSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-2xl font-bold mb-4">Write a Review</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Rating */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Your Rating *
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="btn btn-primary btn-glow"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-gray-600 self-center">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label htmlFor="comment" className="block text-gray-700 font-semibold mb-2">
            Your Review *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            minLength={10}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Share your thoughts about this game... (minimum 10 characters)"
          />
          <p className="text-sm text-gray-500 mt-1">
            {comment.length} / 10 minimum characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || rating === 0 || comment.length < 10}
          className="btn btn-primary btn-glow disabled:btn-disabled"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>

        <p className="text-sm text-gray-500 mt-3 text-center">
          * Required fields
        </p>
      </form>
    </div>
  );
};

export default ReviewForm;