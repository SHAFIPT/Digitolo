// Updated Pet Schema with evolution thresholds
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPet extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  petId: string;
  hunger: number;
  happiness: number;
  energy: number;
  evolutionStage: number;
  experience: number;
  lastUpdated: Date;
  evolutionHistory: {
    stage: number;
    timestamp: Date;
  }[];
  accessories?: string[];
}

// Define experience thresholds for evolution
export const EVOLUTION_THRESHOLDS = {
  LEVEL_1: 0,    // Starting level
  LEVEL_2: 50,   // Evolve to level 2 at 50% experience
  LEVEL_3: 100   // Evolve to level 3 at 100% experience (max)
};

const PetSchema: Schema<IPet> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, default: "Fluffy" },
    petId: { type: String, required: true },
    hunger: { type: Number, required: true, default: 100, min: 0, max: 100 },
    happiness: { type: Number, required: true, default: 100, min: 0, max: 100 },
    energy: { type: Number, required: true, default: 100, min: 0, max: 100 },
    experience: { type: Number, required: true, default: 0, min: 0, max: 100 },
    evolutionStage: { type: Number, required: true, default: 1, min: 1, max: 3 },
    lastUpdated: { type: Date, required: true, default: Date.now },
    evolutionHistory: [
      {
        stage: { type: Number, required: true },
        timestamp: { type: Date, required: true, default: Date.now },
      },
    ],
    accessories: [{ type: String }],
  },
  { timestamps: true }
);

// Pet middleware to check for evolution when experience changes
PetSchema.pre('save', async function(next) {
  // Check if experience field has been modified
  if (this.isModified('experience')) {
    const currentExp = this.experience;
    
    // Determine the appropriate evolution stage based on experience
    let newStage = 1; // Default to level 1
    
    if (currentExp >= EVOLUTION_THRESHOLDS.LEVEL_3) {
      newStage = 3; // Final evolution
    } else if (currentExp >= EVOLUTION_THRESHOLDS.LEVEL_2) {
      newStage = 2; // First evolution
    }
    
    // If the pet is evolving to a new stage
    if (newStage > this.evolutionStage) {
      // Record the evolution event
      this.evolutionHistory.push({
        stage: newStage,
        timestamp: new Date()
      });
      
      // Update the evolution stage
      this.evolutionStage = newStage;
      
      // You could add additional bonuses for evolving here
      // For example, restore stats when pet evolves
      this.hunger = 100;
      this.happiness = 100;
      this.energy = 100;
    }
  }
  
  next();
});

export const Pet: Model<IPet> = mongoose.model<IPet>('Pet', PetSchema);