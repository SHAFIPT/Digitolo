import { IPetRepository } from './../../repository/Interface/IPet.repository';
import { injectable, inject } from "tsyringe";
import { IPetService } from "../Interface/IPet.service";
import { IPet } from "../../model/pets";
import { AppError } from '../../utils/appError';
import { MESSAGES } from '../../constants/messages';
import { STATUS_CODE } from '../../enums/statusCodes';
import { Notification } from '../../model/notification';

@injectable()
export class petService implements IPetService{
    constructor(
        @inject('IPetRepository') private readonly petRepo : IPetRepository
    ) { }

  async createPet(name: string, id: string, petId: string): Promise<IPet> {
       
    const existUser = await this.petRepo.existUser(id);

    if (existUser) {
      throw new AppError(MESSAGES.PET_ALREADY_EXISTS, STATUS_CODE.BAD_REQUEST);
    }

   const createPet = await this.petRepo.createPet(name, id, petId);

    if (!createPet) {
      throw new AppError(MESSAGES.PET_CREATION_FAILED, STATUS_CODE.SERVER_ERROR);
    }
    return createPet;
  }
  async getMyPet(id: string): Promise<IPet | null> {
    return await this.petRepo.existUser(id)
  }

  async updatePetStats(userId: string, stats: any): Promise<IPet> {
    const pet = await this.petRepo.findByUserId(userId);
    if (!pet) throw new AppError(MESSAGES.PET_NOT_FOUND, STATUS_CODE.NOT_FOUND);

    const previousStats = { ...pet };

    // Update stats if provided
    if (stats.hunger !== undefined) pet.hunger = stats.hunger;
    if (stats.happiness !== undefined) pet.happiness = stats.happiness;
    if (stats.energy !== undefined) pet.energy = stats.energy;
    if (stats.experience !== undefined) pet.experience = stats.experience;

    pet.lastUpdated = new Date();

    // Handle evolution
    if (pet.experience >= 100 && pet.evolutionStage < 2) {
      pet.evolutionHistory.push({
        stage: pet.evolutionStage,
        timestamp: new Date()
      });

      pet.evolutionStage += 1;
      pet.experience = 0;
      pet.hunger = Math.min(pet.hunger + 20, 100);
      pet.happiness = Math.min(pet.happiness + 20, 100);
      pet.energy = Math.min(pet.energy + 20, 100);

      await Notification.create({
        user: userId,
        pet: pet._id,
        type: 'evolution',
        message: `Your pet ${pet.name} has evolved to stage ${pet.evolutionStage}!`
      });
    }

    return await pet.save();
  }

  async getEvolutionHistory(userId: string): Promise<IPet['evolutionHistory']> {
    const pet = await this.petRepo.findByUserId(userId);
    if (!pet) throw new AppError(MESSAGES.PET_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    return pet.evolutionHistory;
  }
}