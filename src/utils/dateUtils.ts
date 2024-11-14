export const formatLocalDateTime = (utcTimestamp: string) => {
  try {
    const date = new Date(utcTimestamp);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      throw new Error('Invalid timestamp');
    }

    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};