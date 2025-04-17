import { IPet } from "../../model/pets";

export interface IPetService {
  createPet(name: string, id: string, petId: string): Promise<IPet>
  getMyPet(userId: string): Promise<IPet | null>;
  updatePetStats(userId: string, stats: Partial<Pick<IPet, 'hunger' | 'happiness' | 'energy' | 'experience'>>): Promise<IPet>;
  getEvolutionHistory(userId: string): Promise<IPet['evolutionHistory']>;
}