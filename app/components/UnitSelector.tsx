import { useDeck } from '../hooks/useDeck';

export default function UnitSelector() {
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const { userId } = useAuth();
  const { deck, setDeck } = useDeck(userId);
  const [unitProgress, setUnitProgress] = useState<UnitProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Add function to manually mark Unit 1 as completed
  const markUnit1AsCompleted = () => {
    if (!deck) return;
    
    // Only add Unit 1 if it's not already in completedUnits
    if (!deck.completedUnits.includes(1)) {
      const updatedDeck = {
        ...deck,
        completedUnits: [...deck.completedUnits, 1]
      };
      
      // Update state
      setDeck(updatedDeck);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`deck-${deck.userId}`, JSON.stringify(updatedDeck));
      }
      
      // Save to API
      fetch('/api/deck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDeck),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save deck');
        }
        console.log('✅ Unit 1 manually marked as completed');
        
        // Refresh unit progress
        fetchUnitProgress();
      })
      .catch(error => {
        console.error('Error saving deck:', error);
      });
    }
  };

  // ... existing code ...
  
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
        // ... existing loading code ...
      ) : (
        // ... existing code ...
      )}
    </div>
  );
} 