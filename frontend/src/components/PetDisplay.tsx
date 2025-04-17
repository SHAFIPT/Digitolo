import React from 'react';
import { usePet } from "../features/pet/PetContext";
import Lottie from "lottie-react";
import catHappy from "../assets/animations/catHappy.json";
import catHungry from "../assets/animations/catHungry.json";
import catSleepy from "../assets/animations/catSleepy.json";
import catEvolvedHappy from "../assets/animations/catEvolvedHappy.json";
import catEvolvedHungry from "../assets/animations/catEvolvedHungry.json";
import catEvolvedSleepy from "../assets/animations/catEvolvedSleepy.json";
import catFinalHappy from "../assets/animations/catFinalHappy.json";
import catFinalHungry from "../assets/animations/catFinalHungry.json";
import catFinalSleepy from "../assets/animations/catFinalSleepy.json";
import EvolutionCelebration from './EvolutionCelebration';
// import '../styles/PetDisplay.css';

const PetDisplay: React.FC = () => {
  const { stats, evolutionStage, loading, error, petName, hasEvolvedRecently } = usePet();
  if (typeof window === 'undefined') {
    return <div className="pet-display-card">Loading...</div>;
  }
  // Get the appropriate animation based on pet's stats and evolution stage
  const getPetAnimation = () => {
    if (evolutionStage === 3) {  // Changed from 2 to 3 to match our evolution stages
      if (stats.hunger < 30) return catFinalHungry;
      if (stats.energy < 30) return catFinalSleepy;
      return catFinalHappy;
    }
    else if (evolutionStage === 2) {
      if (stats.hunger < 30) return catEvolvedHungry;
      if (stats.energy < 30) return catEvolvedSleepy;
      return catEvolvedHappy;
    }
    else {
      if (stats.hunger < 30) return catHungry;
      if (stats.energy < 30) return catSleepy;
      return catHappy;
    }
  };

  const getPetMood = () => {
    if (stats.hunger < 30) return "I'm hungry! 😿";
    if (stats.energy < 30) return "I'm tired... 😴";
    if (stats.happiness < 30) return "I'm bored... 😿";
    if (stats.happiness > 70 && stats.hunger > 70 && stats.energy > 70) return "I'm purr-fectly happy! 😸";
    return "I'm doing okay! 😺";
  };

  // Get pet's evolution name based on stage
  const getPetName = () => {
    switch(evolutionStage) {
      case 1: return "Kitten";
      case 2: return "Teen Cat";
      case 3: return "Super Cat";
      default: return "Kitten";
    }
  };

  const getStatusColor = (value: number) => {
    if (value < 30) return "status-red";
    if (value < 60) return "status-yellow";
    return "status-green";
  };

  // Calculate experience needed for next evolution
  const getExperienceToNextLevel = () => {
    if (evolutionStage === 1) {
      return "50% XP to evolve";
    } else if (evolutionStage === 2) {
      return "100% XP to evolve";
    } else {
      return "Max level reached!";
    }
  };

  if (loading) {
    return (
      <div className="pet-display-card">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your pet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pet-display-card">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {hasEvolvedRecently && <EvolutionCelebration evolutionStage={evolutionStage} />}
      
      <div className="pet-display-card">
        <div className="pet-header">
          <div className="pet-name-badge">
            {petName || 'Your Pet'} - {getPetName()}
          </div>
          <div className="level-badge">Level {evolutionStage}</div>
        </div>
        
        <div className="pet-content">
          <div className="pet-animation-container">
            <div className="pet-mood-bubble">
              {getPetMood()}
            </div>
            <Lottie 
              animationData={getPetAnimation()} 
              loop={true}
              className="pet-animation"
            />
          </div>
          
          <div className="stats-panel">
            <div className="stat-item">
              <div className="stat-header">
                <span className="stat-icon">🍗</span>
                <span className="stat-name">Hunger</span>
                <span className="stat-value">{stats.hunger}%</span>
              </div>
              <div className="stat-bar">
                <div 
                  className={`stat-progress ${getStatusColor(stats.hunger)}`} 
                  style={{ width: `${stats.hunger}%` }}
                ></div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-header">
                <span className="stat-icon">🎾</span>
                <span className="stat-name">Happiness</span>
                <span className="stat-value">{stats.happiness}%</span>
              </div>
              <div className="stat-bar">
                <div 
                  className={`stat-progress ${getStatusColor(stats.happiness)}`} 
                  style={{ width: `${stats.happiness}%` }}
                ></div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-header">
                <span className="stat-icon">💤</span>
                <span className="stat-name">Energy</span>
                <span className="stat-value">{stats.energy}%</span>
              </div>
              <div className="stat-bar">
                <div 
                  className={`stat-progress ${getStatusColor(stats.energy)}`} 
                  style={{ width: `${stats.energy}%` }}
                ></div>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-header">
                <span className="stat-icon">⭐</span>
                <span className="stat-name">Experience</span>
                <span className="stat-value">{stats.experience || 0}%</span>
              </div>
              <div className="stat-bar">
                <div 
                  className="stat-progress status-blue" 
                  style={{ width: `${stats.experience || 0}%` }}
                ></div>
              </div>
              <div className="evolution-info">
                <small>{getExperienceToNextLevel()}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PetDisplay;