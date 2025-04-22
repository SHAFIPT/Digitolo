import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMyPet, updatePetStats, getEvolutionHistory } from '../../service/petService';

interface PetStats {
  hunger: number;
  happiness: number;
  energy: number;
  experience: number;
}

interface EvolutionRecord {
  stage: number;
  date: string;
}

interface PetContextType {
  stats: PetStats;
  updateStats: (newStats: Partial<PetStats>, optimistic?: boolean) => Promise<void>;
  resetPet: () => void;
  evolutionStage: number;
  loading: boolean;
  error: string | null;
  petName: string;
  fetchEvolutionHistory: () => Promise<EvolutionRecord[]>;
  hasEvolvedRecently: boolean;
}

const initialStats: PetStats = {
  hunger: 70,
  happiness: 70,
  energy: 70,
  experience: 0,
};

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<PetStats>(initialStats);
  const [evolutionStage, setEvolutionStage] = useState<number>(0);
  const [petName, setPetName] = useState<string>('');
  const [hasEvolvedRecently, setHasEvolvedRecently] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);

  useEffect(() => {
    if (hasEvolvedRecently) {
      const timer = setTimeout(() => {
        setHasEvolvedRecently(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [hasEvolvedRecently]);

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        setLoading(true);
        const response = await getMyPet();
        if (response?.data?.data) {
          const pet = response.data.data;
          setStats({
            hunger: pet.hunger,
            happiness: pet.happiness,
            energy: pet.energy,
            experience: pet.experience || 0,
          });
          setEvolutionStage(pet.evolutionStage);
          setPetName(pet.name);
        }
      } catch (err) {
        console.error('Error fetching pet data:', err); 
        setError('Failed to fetch pet data. Please try again later.');
        setStats(initialStats);
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

    if (!initialLoadComplete) {
      fetchPetData();
    }
  }, [initialLoadComplete]);

  useEffect(() => {
    if (!initialLoadComplete || loading) return;

    const interval = setInterval(async () => {
      const newStats = {
        hunger: Math.max(stats.hunger - 2, 0),
        energy: Math.max(stats.energy - 1, 0),
        happiness: Math.max(stats.happiness - 1.5, 0),
      };

      setStats(prev => ({ ...prev, ...newStats }));

      try {
        await updatePetStats(newStats);
      } catch (err) {
        console.error('Failed to sync stats (auto-decrease):', err);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [stats, initialLoadComplete, loading]);

  const updateStats = async (newStats: Partial<PetStats>, optimistic = true) => {
    try {
      if (optimistic) {
        setStats(prev => ({ ...prev, ...newStats }));
      }
      const response = await updatePetStats({ ...stats, ...newStats });

      const newStage = response?.data?.data?.evolutionStage;
      if (newStage !== undefined && newStage > evolutionStage) {
        setEvolutionStage(newStage);
        setHasEvolvedRecently(true);
      }

      setError(null);
    } catch (err) {
      setError('Failed to update pet stats.');
      console.error('Update error:', err);
    }
  };

  const fetchEvolutionHistory = async () => {
    try {
      setLoading(true);
      const response = await getEvolutionHistory();
      return response?.data?.data || [];
    } catch (err) {
      console.error('Error fetch evolution history:', err); 
      setError('Failed to fetch evolution history.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const resetPet = () => {
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
      hasEvolvedRecently,
    }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePet must be used within a PetProvider');
  }
  return context;
};
