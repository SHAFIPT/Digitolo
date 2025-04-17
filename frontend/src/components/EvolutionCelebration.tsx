import React, { useEffect } from 'react';
// import '../styles/EvolutionCelebration.css';

interface EvolutionCelebrationProps {
  evolutionStage: number;
}

const EvolutionCelebration: React.FC<EvolutionCelebrationProps> = ({ evolutionStage }) => {
  // Use the current evolution stage to determine the name
  const getPetEvolutionName = () => {
    switch(evolutionStage) {
      case 2: return "Teen Cat";
      case 3: return "Super Cat";
      default: return "Evolved Pet";
    }
  };

  // Play a sound effect when the component mounts
  useEffect(() => {
  if (typeof window !== 'undefined') {
    // Audio or other browser API code here
  }
}, []);

  return (
    <div className="evolution-overlay">
      <div className="evolution-popup">
        <div className="evolution-sparkles"></div>
        <h2>Evolution Complete!</h2>
        <div className="evolution-message">
          <p>Congratulations! Your pet has evolved into:</p>
          <h3>{getPetEvolutionName()}</h3>
        </div>
        <div className="evolution-bonus-stats">
          <p>All stats restored to 100%!</p>
        </div>
      </div>
    </div>
  );
};

export default EvolutionCelebration;