import Layout from '@/components/Layout';
import Mascot from '@/components/Mascot';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

type ShopItem = {
  id: string;
  name: string;
  type: 'hat' | 'glasses' | 'accessory';
  icon: string;
  cost: number;
};

const SHOP_ITEMS: ShopItem[] = [
  { id: 'hat_party', name: 'Party Hat', type: 'hat', icon: '🎉', cost: 5 },
  { id: 'hat_crown', name: 'Gold Crown', type: 'hat', icon: '👑', cost: 15 },
  { id: 'hat_cowboy', name: 'Cowboy Hat', type: 'hat', icon: '🤠', cost: 10 },
  { id: 'glasses_cool', name: 'Cool Shades', type: 'glasses', icon: '😎', cost: 8 },
  { id: 'glasses_nerd', name: 'Smart Specs', type: 'glasses', icon: '🤓', cost: 8 },
  { id: 'acc_star', name: 'Star Wand', type: 'accessory', icon: '🪄', cost: 12 },
  { id: 'acc_balloon', name: 'Red Balloon', type: 'accessory', icon: '🎈', cost: 5 },
];

export default function Shop() {
  const [, setLocation] = useLocation();
  const coins = useStore((state) => state.coins);
  const inventory = useStore((state) => state.inventory);
  const equippedItems = useStore((state) => state.equippedItems);
  const purchaseItem = useStore((state) => state.purchaseItem);
  const equipItem = useStore((state) => state.equipItem);
  const { customAccessories, equippedCustomAccessory, equipCustomAccessory } = useStore();

  const handleItemClick = (item: ShopItem) => {
    const isOwned = inventory.includes(item.id);
    const isEquipped = equippedItems[item.type] === item.id;

    if (isOwned) {
      // Toggle equip
      equipItem(item.type, isEquipped ? undefined : item.id);
    } else {
      // Try purchase
      if (coins >= item.cost) {
        purchaseItem(item.id, item.cost);
      }
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <header className="pt-6 pb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLocation('/streak')}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-foreground">Mascot Shop</h1>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
            <span>⭐</span> {coins}
          </div>
        </header>

        {/* Preview Area */}
        <div className="flex justify-center mb-8 relative">
          <div className="w-40 h-40 relative">
            <Mascot pose="happy" className="w-full h-full" />
            
            {/* Render Equipped Items (Simplified visual representation) */}
            {equippedItems.hat && (
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl"
              >
                {SHOP_ITEMS.find(i => i.id === equippedItems.hat)?.icon}
              </motion.div>
            )}
            {equippedItems.glasses && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-10 left-1/2 -translate-x-1/2 text-3xl z-10"
              >
                {SHOP_ITEMS.find(i => i.id === equippedItems.glasses)?.icon}
              </motion.div>
            )}
            {equippedItems.accessory && (
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="absolute bottom-0 -right-2 text-3xl"
              >
                {SHOP_ITEMS.find(i => i.id === equippedItems.accessory)?.icon}
              </motion.div>
            )}
          </div>
        </div>

        {/* Custom Accessories Section */}
        {customAccessories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">My Designs</h2>
            <div className="grid grid-cols-2 gap-4">
              {customAccessories.map((acc) => {
                const isEquipped = equippedCustomAccessory === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => equipCustomAccessory(isEquipped ? null : acc.id)}
                    className={cn(
                      "relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                      isEquipped 
                        ? "border-primary bg-primary/5" 
                        : "border-muted bg-card hover:border-primary/30"
                    )}
                  >
                    <div 
                      className="w-12 h-12 flex items-center justify-center rounded-full mb-1"
                      style={{ 
                        backgroundColor: acc.color === 'sage' ? '#A8B5A0' : 
                                       acc.color === 'periwinkle' ? '#B4C5E4' : 
                                       acc.color === 'sand' ? '#D4C5B0' : '#FFD700'
                      }}
                    >
                      <span className="text-2xl">
                        {acc.symbol === 'star' ? '⭐' : acc.symbol === 'heart' ? '❤️' : '⚡'}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{acc.name}</div>
                      <div className="text-xs font-bold mt-1 text-primary">
                        {isEquipped ? 'Equipped' : 'Wear'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Shop Grid */}
        <h2 className="text-lg font-bold mb-4">Shop</h2>
        <div className="grid grid-cols-2 gap-4 pb-8">
          {SHOP_ITEMS.map((item) => {
            const isOwned = inventory.includes(item.id);
            const isEquipped = equippedItems[item.type] === item.id;
            const canAfford = coins >= item.cost;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={!isOwned && !canAfford}
                className={cn(
                  "relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                  isEquipped 
                    ? "border-primary bg-primary/5" 
                    : isOwned
                      ? "border-muted bg-card hover:border-primary/30"
                      : canAfford
                        ? "border-transparent bg-card hover:bg-muted/50"
                        : "border-transparent bg-muted/20 opacity-60 cursor-not-allowed"
                )}
              >
                <div className="text-4xl mb-1">{item.icon}</div>
                <div className="text-center">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className={cn(
                    "text-xs font-bold mt-1",
                    isOwned ? "text-primary" : "text-yellow-600 dark:text-yellow-500"
                  )}>
                    {isOwned ? (isEquipped ? 'Equipped' : 'Owned') : `⭐ ${item.cost}`}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
