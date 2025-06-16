const Rating = ({ rating, className = '' }) => {
  const getRatingColor = (rating) => {
    switch (rating) {
      case 'G':
      case 'PG':
        return 'bg-success text-black';
      case 'PG-13':
      case 'TV-14':
        return 'bg-warning text-black';
      case 'R':
      case 'TV-MA':
        return 'bg-error text-white';
      default:
        return 'bg-secondary text-accent';
    }
  };

  return (
    <span className={`inline-block px-2 py-1 text-xs font-bold rounded ${getRatingColor(rating)} ${className}`}>
      {rating}
    </span>
  );
};

export default Rating;