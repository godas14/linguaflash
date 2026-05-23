import { useState } from 'react';

interface FlashcardProps {
  spanish: string;
  russian: string;
  example?: string;
  onFlip?: (isFlipped: boolean) => void;
}

export default function Flashcard({ spanish, russian, example, onFlip }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  function handleFlip() {
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);
    onFlip?.(newFlipped);
  }

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto">
      <div
        onClick={handleFlip}
        className={`relative w-full h-80 cursor-pointer transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front Side (Spanish) */}
        <div
          className="absolute inset-0 bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-sm text-gray-500 mb-4">Испанский</div>
          <div className="text-4xl font-bold text-gray-900 text-center mb-8">
            {spanish}
          </div>
          <div className="text-sm text-gray-400">Нажмите, чтобы перевернуть</div>
        </div>

        {/* Back Side (Russian) */}
        <div
          className="absolute inset-0 bg-blue-600 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="text-sm text-blue-200 mb-4">Русский</div>
          <div className="text-4xl font-bold text-white text-center mb-4">
            {russian}
          </div>
          {example && (
            <div className="text-sm text-blue-100 text-center mt-4 italic">
              {example}
            </div>
          )}
          <div className="text-sm text-blue-200 mt-8">Нажмите, чтобы вернуть</div>
        </div>
      </div>
    </div>
  );
}
