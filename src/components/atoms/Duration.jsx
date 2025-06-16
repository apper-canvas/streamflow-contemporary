const Duration = ({ duration, type = 'movie', className = '' }) => {
  const formatDuration = (minutes) => {
    if (type === 'movie') {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    } else {
      // For series, show total season time or episode count
      const hours = Math.floor(minutes / 60);
      return hours > 10 ? `${Math.floor(hours / 10)} seasons` : `${hours}h total`;
    }
  };

  return (
    <span className={`text-sm text-accent/70 ${className}`}>
      {formatDuration(duration)}
    </span>
  );
};

export default Duration;