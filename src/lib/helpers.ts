
  // Debounce function with TypeScript types
  export function debounce<T extends (...args: unknown[]) => void>(fn: T, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return function (...args: Parameters<T>) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), wait);
    };
  }

  export function getAnonymousIdFromCookie(cookie: string | null): string | null {
    if (!cookie) return null;
    const match = cookie.match(/anonymousId=([^;]+)/);
    return match ? match[1] : null;
  }

