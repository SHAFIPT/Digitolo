import React, { useState } from 'react';
import { usePet } from "../features/pet/PetContext";
// import '../styles/Controls.css';

const Controls: React.FC = () => {
  const { stats, updateStats, loading } = usePet();
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Helper function to handle API calls with loading state
  const handleAction = async (action: string, statsUpdate: any) => {
    if (loading || actionInProgress) return;
    
    try {
      setActionInProgress(action);
      await updateStats(statsUpdate);
    } catch (error) {
      console.error(`Failed to ${action} pet:`, error);
    } finally {
      setTimeout(() => {
        setActionInProgress(null);
      }, 1000); // Keep action indicator for a moment after completion
    }
  };

  const feedPet = () => {
    handleAction('feed', {
      hunger: Math.min(stats.hunger + 25, 100),
      happiness: Math.min(stats.happiness + 5, 100),
      energy: Math.max(stats.energy - 5, 0),
    });
  };

  const playWithPet = () => {
    handleAction('play', {
      happiness: Math.min(stats.happiness + 25, 100),
      energy: Math.max(stats.energy - 15, 0),
      hunger: Math.max(stats.hunger - 10, 0),
    });
  };

  const restPet = () => {
    handleAction('rest', {
      energy: Math.min(stats.energy + 25, 100),
      happiness: Math.max(stats.happiness - 5, 0),
    });
  };

  const boostExperience = () => {
    handleAction('train', {
      experience: Math.min((stats.experience || 0) + 25, 100),
    });
  };

  // Button should be disabled if the action would be ineffective or harmful
  const isFeedingNeeded = stats.hunger < 95;
  const isPlayingPossible = stats.energy > 15;
  const isRestNeeded = stats.energy < 95;

  const globalDisabled = loading;

  return (
    <div className="controls-grid">
      <button 
        onClick={feedPet} 
        disabled={!isFeedingNeeded || globalDisabled}
        className={`action-button feed-button ${actionInProgress === 'feed' ? 'action-in-progress' : ''} ${(!isFeedingNeeded || globalDisabled) ? 'action-disabled' : ''}`}
      >
        <div className="action-icon">🍗</div>
        <div className="action-info">
          <span className="action-name">Feed</span>
          <span className="action-effect">+25% Hunger, +5% Happiness</span>
        </div>
        {actionInProgress === 'feed' && <div className="action-loader"></div>}
      </button>
      
      <button 
        onClick={playWithPet} 
        disabled={!isPlayingPossible || globalDisabled}
        className={`action-button play-button ${actionInProgress === 'play' ? 'action-in-progress' : ''} ${(!isPlayingPossible || globalDisabled) ? 'action-disabled' : ''}`}
      >
        <div className="action-icon">🎾</div>
        <div className="action-info">
          <span className="action-name">Play</span>
          <span className="action-effect">+25% Happiness, -15% Energy</span>
        </div>
        {actionInProgress === 'play' && <div className="action-loader"></div>}
      </button>
      
      <button 
        onClick={restPet} 
        disabled={!isRestNeeded || globalDisabled}
        className={`action-button rest-button ${actionInProgress === 'rest' ? 'action-in-progress' : ''} ${(!isRestNeeded || globalDisabled) ? 'action-disabled' : ''}`}
      >
        <div className="action-icon">💤</div>
        <div className="action-info">
          <span className="action-name">Rest</span>
          <span className="action-effect">+25% Energy, -5% Happiness</span>
        </div>
        {actionInProgress === 'rest' && <div className="action-loader"></div>}
      </button>
      
      <button 
        onClick={boostExperience}
        disabled={globalDisabled}
        className={`action-button train-button ${actionInProgress === 'train' ? 'action-in-progress' : ''} ${globalDisabled ? 'action-disabled' : ''}`}
      >
        <div className="action-icon">⭐</div>
        <div className="action-info">
          <span className="action-name">Train</span>
          <span className="action-effect">+25% Experience</span>
        </div>
        {actionInProgress === 'train' && <div className="action-loader"></div>}
      </button>
    </div>
  );
};

export default Controls;