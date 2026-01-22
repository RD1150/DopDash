import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Character {
  id: 'focused' | 'energized' | 'creative' | 'chill';
  name: string;
  description: string;
  benefit: string;
  image: string;
}

interface PickAndWinSectionProps {
  onEmailCapture?: (email: string, character: string, discountCode: string) => void;
}

const characters: Character[] = [
  {
    id: 'focused',
    name: 'Focused',
    description: 'Sharp, concentrated energy',
    benefit: '25% off premium',
    image: '/images/mascot/dashie-focused.png',
  },
  {
    id: 'energized',
    name: 'Energized',
    description: 'Celebratory win vibes',
    benefit: '20% off premium',
    image: '/images/mascot/dashie-energized.png',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Colorful inspiration',
    benefit: '15% off premium',
    image: '/images/mascot/dashie-creative.png',
  },
  {
    id: 'chill',
    name: 'Chill',
    description: 'Peaceful relaxation',
    benefit: 'Free 1-week trial',
    image: '/images/mascot/dashie-chill.png',
  },
];

const generateDiscountCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'DD-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function PickAndWinSection({ onEmailCapture }: PickAndWinSectionProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleCharacterPick = (characterId: string) => {
    setSelectedCharacter(characterId);
    const code = generateDiscountCode();
    setDiscountCode(code);
    setShowEmailForm(true);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && selectedCharacter && discountCode) {
      onEmailCapture?.(email, selectedCharacter, discountCode);
      // Reset
      setEmail('');
      setSelectedCharacter(null);
      setDiscountCode(null);
      setShowEmailForm(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-transparent to-accent/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pick Your Vibe & Unlock a Reward 🎁
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose which Dashie resonates with you right now and get an exclusive discount
          </p>
        </div>

        {!showEmailForm ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {characters.map((char) => (
              <button
                key={char.id}
                onClick={() => handleCharacterPick(char.id)}
                className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  selectedCharacter === char.id
                    ? 'border-accent bg-accent/10'
                    : 'border-border hover:border-accent hover:bg-accent/5'
                } cursor-pointer`}
              >
                <img
                  src={char.image}
                  alt={char.name}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                />
                <div className="text-center">
                  <h3 className="font-semibold text-sm md:text-base">{char.name}</h3>
                  <p className="text-xs text-muted-foreground">{char.description}</p>
                  <p className="text-xs font-bold text-accent mt-1">{char.benefit}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-card rounded-lg border-2 border-accent/20 p-6 shadow-lg">
            <div className="text-center mb-6">
              <p className="text-2xl mb-2">🎉</p>
              <h3 className="text-xl font-bold mb-2">You won!</h3>
              <p className="text-muted-foreground mb-4">Your exclusive discount code:</p>
              <div className="bg-accent/10 border-2 border-accent/30 rounded p-3 mb-4">
                <p className="font-mono font-bold text-lg text-accent">{discountCode}</p>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Sign up to claim your reward and start building better habits
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              />
              <Button
                type="submit"
                disabled={!email}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Claim My Reward & Sign Up
              </Button>
              <button
                type="button"
                onClick={() => {
                  setShowEmailForm(false);
                  setSelectedCharacter(null);
                  setDiscountCode(null);
                }}
                className="w-full text-muted-foreground hover:text-foreground text-sm"
              >
                Maybe later
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
