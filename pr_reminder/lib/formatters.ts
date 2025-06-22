// lib/formatters.ts (FIXED with null safety)
export function formatTimeAgo(dateString: string): string {
  // Handle null/undefined dates
  if (!dateString) {
    return 'Unknown time';
  }

  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    
    // Handle future dates
    if (diffInMs < 0) {
      return 'Future date';
    }
    
    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return 'Invalid date';
  }
}

export function getAuthorFromEmail(email: string | null | undefined): string {
  // Handle null, undefined, or empty email
  if (!email || typeof email !== 'string' || email.trim() === '') {
    return 'Unknown Author';
  }

  try {
    // Check if email contains @ symbol
    if (!email.includes('@')) {
      return email.replace(/[.-]/g, '-') || 'Unknown Author';
    }

    const username = email.split('@')[0];
    
    // Handle empty username
    if (!username || username.trim() === '') {
      return 'Unknown Author';
    }

    return username.replace(/[.-]/g, '-');
  } catch (error) {
    console.error('Error parsing email:', email, error);
    return 'Unknown Author';
  }
}

// Additional helper function for safe string operations
export function safeString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}

// Helper function to safely format repository names
export function formatRepoName(repoName: string | null | undefined): string {
  if (!repoName || typeof repoName !== 'string' || repoName.trim() === '') {
    return 'Unknown Repository';
  }
  return repoName.trim();
}

// Helper function to safely format PR titles
export function formatPRTitle(title: string | null | undefined): string {
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return 'Untitled PR';
  }
  
  // Truncate very long titles
  const maxLength = 100;
  const cleanTitle = title.trim();
  
  if (cleanTitle.length > maxLength) {
    return cleanTitle.substring(0, maxLength) + '...';
  }
  
  return cleanTitle;
}

// Helper function to safely format PR numbers
export function formatPRNumber(prNumber: string | null | undefined): string {
  if (!prNumber || typeof prNumber !== 'string' || prNumber.trim() === '') {
    return '';
  }
  
  const cleanNumber = prNumber.trim();
  
  // Add # prefix if not present
  if (cleanNumber && !cleanNumber.startsWith('#')) {
    return `#${cleanNumber}`;
  }
  
  return cleanNumber;
}

// Helper function to safely format PR status
export function formatPRStatus(status: string | null | undefined): string {
  if (!status || typeof status !== 'string') {
    return 'unknown';
  }
  
  const cleanStatus = status.toLowerCase().trim();
  
  // Normalize status names
  switch (cleanStatus) {
    case 'opened':
    case 'open':
      return 'open';
    case 'merged':
      return 'merged';
    case 'closed':
      return 'closed';
    case 'updated':
      return 'updated';
    default:
      return cleanStatus || 'unknown';
  }
}