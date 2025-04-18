import { userAxiosInstance } from "../service/api";
interface PetStats {
  hunger: number;
  energy: number;
  happiness: number;
}

const api = userAxiosInstance


export const createPet = async (petData: { name: string; petId: string , userId : string }) => {
  try {
    // Making API call to create pet
    const response = await api.post('/api/pet/createPet', petData);
    return response
  } catch (error) {
    console.error("Error cretePet:", error);
         throw error;
  }
};
export const getMyPet = async () => {
  try {
    // Making API call to create pet
    const response = await api.get('/api/pet/mypet');
    return response
  } catch (error) {
     console.error("Error getMyPet:", error);
         throw error;
  }
};
export const updatePetStats = async (stats: PetStats) => {
  try {
    // Making API call to create pet
    const response = await api.put('/api/pet/update-stats',stats);
    return response
  } catch (error) {
    console.error("Error updatePetStats:", error);
         throw error;
  }
};
export const getEvolutionHistory = async () => {
  try {
    // Making API call to create pet
    const response = await api.get('/api/pet/evolution-history');
    return response
  } catch (error) {
    console.error("Error updatePetStats:", error);
         throw error;
  }
};