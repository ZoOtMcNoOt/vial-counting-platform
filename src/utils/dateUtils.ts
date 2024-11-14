export const formatLocalDateTime = (utcTimestamp: string) => {
  try {
    // Create date object and ensure UTC interpretation
    const utcDate = new Date(utcTimestamp);
    
    if (isNaN(utcDate.getTime())) {
      throw new Error('Invalid timestamp');
    }

    // Get local timezone offset
    const localDate = new Date(utcDate.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));

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