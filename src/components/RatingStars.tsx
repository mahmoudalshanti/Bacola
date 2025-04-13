import { Star } from "lucide-react";

function StarRating({
  rate,
  maxStars = 5,
  size = 24, // Default size
}: {
  rate: number;
  maxStars?: number;
  size?: number; // Optional size prop
}) {
  const generateStarRating = () => {
    if (rate < 0 || rate > maxStars) {
      return "Invalid rating";
    }

    let stars = [];
    for (let i = 1; i <= maxStars; i++) {
      if (i <= rate) {
        stars.push(
          <Star key={i} className={`size-${size}`} fill="gold" color="gold" />
        );
      } else {
        stars.push(
          <Star
            key={i}
            className={`size-${size} fill-gray-300  text-gray-300`}
          />
        );
      }
    }
    return stars;
  };

  return <div className="flex">{generateStarRating()}</div>;
}

export default StarRating;
