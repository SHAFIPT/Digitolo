import { Router } from "express";
import { petController } from "../controller/petController";
import { container } from "tsyringe";
import { AuthenticatedRequest, verifyAccessToken, verifyUserRefreshToken } from "../middleware/authentication";

const petRouter = Router()
const petControllers = container.resolve(petController)
petRouter.post('/createPet' , (req, res , next) => petControllers.createPet(req as AuthenticatedRequest, res, next));
petRouter.get('/mypet',verifyAccessToken, (req, res, next) => petControllers.mypet(req as AuthenticatedRequest, res, next));
petRouter.put('/update-stats',verifyAccessToken, (req, res, next) => petControllers.updateStats(req as AuthenticatedRequest, res, next));
petRouter.get('/evolution-history', verifyAccessToken,(req, res, next) => petControllers.getEvolutionHistory(req as AuthenticatedRequest, res, next));

    
export default petRouter