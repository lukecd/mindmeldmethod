import { useDeck } from '../hooks/useDeck';
import { useState, useEffect } from 'react';
import { useAddress } from '@chopinframework/react';

interface UnitProgress {
  id: number;
  title: string;
  isStarted: boolean;
  completedWords: number;
  totalWords: number;
}

export default function UnitSelector() {
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const { address } = useAddress();
  const { deck, markUnitAsCompleted } = useDeck(address);
  const [unitProgress, setUnitProgress] = useState<UnitProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to manually mark Unit 1 as completed
  const markUnit1AsCompleted = () => {
    if (!deck) return;
    
    // Use the markUnitAsCompleted function from the useDeck hook
    markUnitAsCompleted(1);
    
    // Force refresh the unit progress
    calculateUnitProgress();
  };
  
  // Calculate unit progress directly from the deck
  const calculateUnitProgress = () => {
    if (!deck) {
      setUnitProgress([]);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create an array of units with their progress
      const progress: UnitProgress[] = Array(10).fill(null).map((_, i) => {
        const id = i + 1;
        const title = `Unit ${id}`;
        
        // Get cards for this unit
        const unitCards = deck.cards.filter(card => card.unit === id);
        const isStarted = unitCards.length > 0;
        const completedWords = unitCards.filter(card => card.repetitions > 0).length;
        const totalWords = unitCards.length;
        
        return {
          id,
          title,
          isStarted,
          completedWords,
          totalWords
        };
      });
      
      setUnitProgress(progress);
    } catch (error) {
      console.error('Error calculating unit progress:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate unit progress when the deck changes
  useEffect(() => {
    calculateUnitProgress();
  }, [deck]);
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-title text-center mb-8">Select a Unit</h1>
      
      {/* Add temporary fix button */}
      {deck && !deck.completedUnits.includes(1) && unitProgress.some(u => u.id === 1 && u.isStarted) && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 mb-2">
            Having trouble accessing Unit 2? Click the button below to manually mark Unit 1 as completed:
          </p>
          <button 
            onClick={markUnit1AsCompleted}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm font-medium transition-colors"
          >
            Mark Unit 1 as Completed
          </button>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[color:var(--color-accent-primary)]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unitProgress.map((unit) => (
            <div 
              key={unit.id}
              className={`p-4 rounded-lg shadow-md transition-all hover:shadow-lg ${
                unit.isStarted 
                  ? 'bg-[color:var(--color-bg-card)] cursor-pointer' 
                  : 'bg-[color:var(--color-bg-card)]/50 opacity-60'
              }`}
              onClick={() => unit.isStarted && setSelectedUnit(unit.id)}
            >
              <h2 className="text-xl font-semibold mb-2">{unit.title}</h2>
              {unit.isStarted ? (
                <>
                  <div className="h-2 bg-gray-200 rounded-full mb-2">
                    <div 
                      className="h-full bg-[color:var(--color-accent-primary)] rounded-full"
                      style={{ width: `${unit.totalWords > 0 ? (unit.completedWords / unit.totalWords) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {unit.completedWords} of {unit.totalWords} words completed
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">Not started yet</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 