import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'tsx_followed_traders';
const SYNC_EVENT  = 'copytrade-update';

function readStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

// Shared hook — call in any component.
// Uses a custom DOM event to keep all instances in sync within the same tab.
export function useCopyTrading() {
  const [followed, setFollowed] = useState(readStorage);

  useEffect(() => {
    const sync = () => setFollowed(readStorage());
    window.addEventListener(SYNC_EVENT, sync);
    return () => window.removeEventListener(SYNC_EVENT, sync);
  }, []);

  const persist = useCallback((next) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setFollowed(next);
    window.dispatchEvent(new CustomEvent(SYNC_EVENT));
  }, []);

  const follow = useCallback((id) => {
    persist([...new Set([...readStorage(), id])]);
  }, [persist]);

  const unfollow = useCallback((id) => {
    persist(readStorage().filter((x) => x !== id));
  }, [persist]);

  const toggle = useCallback((id) => {
    readStorage().includes(id) ? unfollow(id) : follow(id);
  }, [follow, unfollow]);

  const isFollowing = useCallback((id) => followed.includes(id), [followed]);

  return { followed, follow, unfollow, toggle, isFollowing, count: followed.length };
}
