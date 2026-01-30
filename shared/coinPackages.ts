/**
 * Coin package definitions for the Buy Coins shop
 * Each package includes coins, price, and display info
 */

export interface CoinPackage {
  id: string;
  coins: number;
  price: number; // in cents (e.g., 999 = $9.99)
  priceUSD: string; // formatted price for display
  label: string;
  description: string;
  popular?: boolean; // highlight as popular
  bonus?: number; // bonus coins
}

export const COIN_PACKAGES: CoinPackage[] = [
  {
    id: "starter",
    coins: 100,
    price: 99, // $0.99
    priceUSD: "$0.99",
    label: "Starter",
    description: "100 coins",
  },
  {
    id: "boost",
    coins: 500,
    price: 399, // $3.99
    priceUSD: "$3.99",
    label: "Boost",
    description: "500 coins",
    popular: true,
  },
  {
    id: "pro",
    coins: 1000,
    price: 699, // $6.99
    priceUSD: "$6.99",
    label: "Pro",
    description: "1000 coins",
    bonus: 100, // 10% bonus
  },
  {
    id: "elite",
    coins: 5000,
    price: 2999, // $29.99
    priceUSD: "$29.99",
    label: "Elite",
    description: "5000 coins",
    bonus: 500, // 10% bonus
  },
];

/**
 * Get a coin package by ID
 */
export function getCoinPackage(id: string): CoinPackage | undefined {
  return COIN_PACKAGES.find((pkg) => pkg.id === id);
}

/**
 * Get total coins including bonus
 */
export function getTotalCoins(pkg: CoinPackage): number {
  return pkg.coins + (pkg.bonus || 0);
}

/**
 * Format price for display
 */
export function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(2)}`;
}
