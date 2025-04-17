import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMyPet, updatePetStats, getEvolutionHistory } from '../../service/petService';

// Define types for TypeScript
interface PetStats {
  hunger: number;
  happiness: number;
  energy: number;
  experience: number;
}

interface PetContextType {
  stats: PetStats;
  updateStats: (newStats: Partial<PetStats>) => Promise<void>;
  resetPet: () => void;
  evolutionStage: number;
  loading: boolean;
  error: string | null;
  petName: string;
  fetchEvolutionHistory: () => Promise<any>;
  hasEvolvedRecently: boolean;
}

// Initial pet stats - used as fallback
const initialStats: PetStats = {
  hunger: 70,
  happiness: 70,
  energy: 70,
  experience: 0,
};

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for pet data
  const [stats, setStats] = useState<PetStats>(initialStats);
  const [evolutionStage, setEvolutionStage] = useState<number>(0);
  const [petName, setPetName] = useState<string>('');
  const [hasEvolvedRecently, setHasEvolvedRecently] = useState<boolean>(false);
  
  // UI states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);

  // Reset evolution celebration after a timeout
  useEffect(() => {
    if (hasEvolvedRecently) {
      const timer = setTimeout(() => {
        setHasEvolvedRecently(false);
      }, 5000); // Hide evolution celebration after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [hasEvolvedRecently]);

  // Fetch pet data on initial load
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        setLoading(true);
        const response = await getMyPet();

        console.log(['this is the response of the get pet ::',response])
        
        if (response?.data?.data) {
          const pet = response.data.data;
          setStats({
            hunger: pet.hunger,
            happiness: pet.happiness,
            energy: pet.energy,
            experience: pet.experience || 0
          });
          setEvolutionStage(pet.evolutionStage);
          setPetName(pet.name);
        }
      } catch (err) {
        console.error('Failed to fetch pet data:', err);
        setError('Failed to fetch pet data. Please try again later.');
        // Fallback to initial stats if we can't get data from server
        setStats(initialStats);
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

    // Only fetch if we haven't loaded data yet
    if (!initialLoadComplete) {
      fetchPetData();
    }
  }, [initialLoadComplete]);

  // Auto-decrease stats over time (hunger and energy decrease, happiness decreases)
  useEffect(() => {
    // Only start auto-decrease after initial load and if not loading
    if (!initialLoadComplete || loading) return;

    const interval = setInterval(async () => {
      const newStats = {
        hunger: Math.max(stats.hunger - 2, 0),
        energy: Math.max(stats.energy - 1, 0),
        happiness: Math.max(stats.happiness - 1.5, 0),
      };
      
      // Update local state first for immediate UI feedback
      setStats(prevStats => ({
        ...prevStats,
        ...newStats
      }));
      
      // Then update server
      try {
        await updatePetStats(newStats);
      } catch (err) {
        console.error('Failed to update stats in auto-decrease:', err);
      }
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [stats, initialLoadComplete, loading]);

  // Function to update pet stats both locally and on the server
  const updateStats = async (newStats: Partial<PetStats>) => {
    try {
      setLoading(true);
      
      // Update local state first for immediate UI feedback
      const updatedStats = { ...stats, ...newStats };
      setStats(updatedStats);
      
      // Send updated stats to the server
      const response = await updatePetStats(updatedStats);
      
      // Update evolution stage if it changed on the server
      if (response?.data?.data?.evolutionStage !== undefined && 
          response.data.data.evolutionStage !== evolutionStage) {
        // Store the previous evolution stage
        const previousStage = evolutionStage;
        // Update to new evolution stage
        setEvolutionStage(response.data.data.evolutionStage);
        
        // If the pet evolved to a higher stage, set the evolution celebration flag
        if (response.data.data.evolutionStage > previousStage) {
          setHasEvolvedRecently(true);
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Failed to update pet stats:', err);
      setError('Failed to update pet stats. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch evolution history
  const fetchEvolutionHistory = async () => {
    try {
      setLoading(true);
      const response = await getEvolutionHistory();
      return response?.data?.data || [];
    } catch (err) {
      console.error('Failed to fetch evolution history:', err);
      setError('Failed to fetch evolution history.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Reset pet to initial state (mostly for development/testing)
  const resetPet = () => {
    // This would need to be implemented on the backend as well
    setStats(initialStats);
    setEvolutionStage(0);
  };

  return (
    <PetContext.Provider value={{ 
      stats, 
      updateStats, 
      resetPet,
      evolutionStage,
      loading,
      error,
      petName,
      fetchEvolutionHistory,
      hasEvolvedRecently
    }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePet must be used within a PetProvider');
  }
  return context;
};