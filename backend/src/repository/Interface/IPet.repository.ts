import { IPet } from "../../model/pets";


export interface IPetRepository{
    existUser(id : string) : Promise<IPet | null>
    createPet(name: string, id: string, petId: string): Promise<IPet | null>
    findByUserId(userId: string): Promise<IPet | null>;
}