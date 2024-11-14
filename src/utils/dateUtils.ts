export const formatLocalDateTime = (utcTimestamp: string) => {
    const date = new Date(utcTimestamp);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  