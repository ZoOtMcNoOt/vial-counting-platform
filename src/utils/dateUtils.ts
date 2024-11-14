export const formatLocalDateTime = (utcTimestamp: string) => {
  try {
    // Parse UTC timestamp
    const utcDate = new Date(utcTimestamp);
    
    if (isNaN(utcDate.getTime())) {
      throw new Error('Invalid timestamp');
    }

    // Convert UTC to local time by accounting for timezone offset
    const localDate = new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * 60000));

    // Format in local timezone
    return localDate.toLocaleString('en-US', {
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