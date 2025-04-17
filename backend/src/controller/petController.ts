import { IPetService } from './../service/Interface/IPet.service';
import { Request, Response ,NextFunction} from "express";
import { inject, injectable } from "tsyringe";
import { AuthenticatedRequest } from '../middleware/authentication';
import { STATUS_CODE } from '../enums/statusCodes';
import { MESSAGES } from '../constants/messages';
import { use } from 'react';
@injectable()
export class petController {
    constructor(
        @inject('IPetService') private readonly petService : IPetService
    ) { }
    
    public async createPet(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
    ): Promise<void>  {
        try {
            const { name, petId, userId } = req.body;
            const pet = await this.petService.createPet(name, userId , petId);

            res.status(STATUS_CODE.CREATED).json({
            message: MESSAGES.PET_CREATED_SUCCESS,
            data: pet,
            });
            
        } catch (error) {
            next(error)
        }
    }
    public async mypet(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
    ): Promise<void> {
    try {
        
        const pet = await this.petService.getMyPet(req.user.id);

        res.status(STATUS_CODE.OK).json({ message: MESSAGES.PET_FETCHED_SUCCESS, data: pet });
    } catch (error) {
        next(error);
    }
    }
    public async updateStats(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
    ): Promise<void> {
        try {
        const { hunger, happiness, energy, experience } = req.body;
        const pet = await this.petService.updatePetStats(req.user.id, { hunger, happiness, energy, experience });

        res.status(STATUS_CODE.OK).json({ message: MESSAGES.PET_STATS_UPDATED, data: pet });
    } catch (error) {
        next(error);
    }
    }   
    public async getEvolutionHistory(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
    ): Promise<void> {
    try {
        const history = await this.petService.getEvolutionHistory(req.user.id);

        res.status(STATUS_CODE.OK).json({ message: MESSAGES.PET_HISTORY_FETCHED, data: history });
    } catch (error) {
        next(error);
    }
    }
}