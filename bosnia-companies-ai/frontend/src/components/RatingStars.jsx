import { Star } from 'lucide-react';

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-1.5">
      <Star className="w-5 h-5 fill-bosnia-yellow text-bosnia-yellow" />
      <span className="font-semibold text-white text-lg">{rating.toFixed(1)}</span>
    </div>
  );
}

export default RatingStars;
