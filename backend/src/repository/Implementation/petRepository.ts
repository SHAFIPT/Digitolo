import { MESSAGES } from "../../constants/messages";
import { STATUS_CODE } from "../../enums/statusCodes";
import { IPet, Pet } from "../../model/pets";
import { AppError } from "../../utils/appError";
import { IPetRepository } from "../Interface/IPet.repository";

export class petRepository implements IPetRepository{

    async existUser(id: string): Promise<IPet | null> {
        try {
            return await Pet.findOne({userId : id})
        } catch (error) {
             throw new AppError(MESSAGES.ERROR_EXISTING_USER, STATUS_CODE.SERVER_ERROR);
        }
    }

    async createPet(name: string, id: string, petId: string): Promise<IPet | null> {
        try {
             const pet = new Pet({
                name,
                userId: id,
                petId
             });
            
          return await pet.save();
        } catch (error) {
            throw new AppError(MESSAGES.PET_CREATION_FAILED, STATUS_CODE.SERVER_ERROR);
        }
    }

    async findByUserId(userId: string): Promise<IPet | null> {
    try {
        return await Pet.findOne({ userId });
    } catch (err) {
        throw new AppError(MESSAGES.PET_FETCH_FAILED, STATUS_CODE.SERVER_ERROR);
    }
    }

}