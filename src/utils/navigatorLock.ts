

/**
 * Fallback-aware navigatorLock wrapper.
 * - If the Lock API is unsupported, simply runs `fn()` without locking.
 * - Aborts acquisition after `acquireTimeout` milliseconds.
 * - Clears the timeout once the lock is acquired or an error occurs.
 */
export async function navigatorLock<R>(
  name: string,
  acquireTimeout: number,
  fn: () => Promise<R>
): Promise<R> {
  // If LockManager API is unavailable, just execute the function
  if (!globalThis.navigator?.locks) {
    return fn();
  }

  const abortController = new AbortController();
  let timer: number | undefined;

  // Schedule abort if a positive timeout is provided
  if (acquireTimeout > 0) {
    timer = window.setTimeout(() => {
      abortController.abort();
    }, acquireTimeout);
  }

  try {
    // Request an exclusive lock, optionally with ifAvailable for zero timeout
    return await globalThis.navigator.locks.request(
      name,
      acquireTimeout === 0
        ? { mode: 'exclusive', ifAvailable: true }
        : { mode: 'exclusive', signal: abortController.signal },
      async () => {
        return fn();
      }
    );
  } finally {
    // Always clear the timeout to avoid stray timers
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}