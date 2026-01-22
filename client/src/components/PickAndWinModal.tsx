import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { trpc } from '@/lib/trpc';

interface PickAndWinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Character = 'focused' | 'energized' | 'creative' | 'chill';

interface CharacterOption {
  id: Character;
  name: string;
  description: string;
  discount: string;
  image: string;
}

const characters: CharacterOption[] = [
  {
    id: 'focused',
    name: 'Focused',
    description: 'Sharp, concentrated energy',
    discount: '25% off',
    image: '/images/mascot/dashie-focused.png',
  },
  {
    id: 'energized',
    name: 'Energized',
    description: 'Celebratory win vibes',
    discount: '20% off',
    image: '/images/mascot/dashie-energized.png',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Colorful inspiration',
    discount: '15% off',
    image: '/images/mascot/dashie-creative.png',
  },
  {
    id: 'chill',
    name: 'Chill',
    description: 'Peaceful relaxation',
    discount: 'Free 1-week trial',
    image: '/images/mascot/dashie-chill.png',
  },
];

export default function PickAndWinModal({ isOpen, onClose, onSuccess }: PickAndWinModalProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  
  const pickCharacterMutation = trpc.pickAndWin.pickCharacter.useMutation({
    onSuccess: (data: any) => {
      setIsLoading(false);
      setDiscountCode(data.discountCode);
      setSelectedCharacter(null);
      onSuccess?.();
      setTimeout(() => {
        onClose();
        setDiscountCode(null);
      }, 3000);
    },
    onError: (error: any) => {
      setIsLoading(false);
      alert('Error: ' + (error.message || 'Something went wrong'));
    },
  });

  const handlePickCharacter = async (character: Character) => {
    setSelectedCharacter(character);
    setIsLoading(true);
    await pickCharacterMutation.mutateAsync({ character });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Pick & Win 🎁</DialogTitle>
          <p className="text-center text-sm text-gray-600 mt-2">
            Choose your vibe and unlock an exclusive reward!
          </p>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-6">
          {characters.map((char) => (
            <button
              key={char.id}
              onClick={() => handlePickCharacter(char.id)}
              disabled={isLoading}
              className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                selectedCharacter === char.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <img
                src={char.image}
                alt={char.name}
                className="w-20 h-20 object-contain"
              />
              <div className="text-center">
                <h3 className="font-semibold text-sm">{char.name}</h3>
                <p className="text-xs text-gray-600">{char.description}</p>
                <p className="text-xs font-bold text-green-600 mt-1">{char.discount}</p>
              </div>
            </button>
          ))}
        </div>

        {discountCode && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm font-semibold text-green-900 mb-2">🎉 Your discount code:</p>
            <p className="text-lg font-bold text-green-600 font-mono">{discountCode}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {discountCode ? 'Close' : 'Maybe Later'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
