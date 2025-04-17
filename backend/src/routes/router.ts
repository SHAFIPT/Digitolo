import { Router } from "express";
import userRouter from "./userRoutes";
import petRouter from "./petRoutes";

const route = Router()

route.use('/api/auth',userRouter)
route.use('/api/pet',petRouter)


export default route