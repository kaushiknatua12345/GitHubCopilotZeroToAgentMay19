import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistItem {
  productId: number;
  name: string;
  price: number;
  imgName: string;
  discount?: number;
  addedAt: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const WISHLIST_STORAGE_KEY = 'octocat-wishlist';

function loadWishlist(): WishlistItem[] {
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(loadWishlist);

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToWishlist = (item: Omit<WishlistItem, 'addedAt'>) => {
    setItems(prev => {
      if (prev.some(i => i.productId === item.productId)) return prev;
      return [...prev, { ...item, addedAt: new Date().toISOString() }];
    });
  };

  const removeFromWishlist = (productId: number) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  const isInWishlist = (productId: number) => {
    return items.some(i => i.productId === productId);
  };

  const totalItems = items.length;

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist, totalItems }}>
      {children}
    </WishlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
