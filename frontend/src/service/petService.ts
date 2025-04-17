import { userAxiosInstance } from "../service/api";


const api = userAxiosInstance


export const createPet = async (petData: { name: string; petId: string , userId : string }) => {
  try {
    // Making API call to create pet
    const response = await api.post('/api/pet/createPet', petData);
    return response
  } catch (err: any) {
    throw new Error(err?.message || 'Something went wrong');
  }
};
export const getMyPet = async () => {
  try {
    // Making API call to create pet
    const response = await api.get('/api/pet/mypet');
    return response
  } catch (err: any) {
    throw new Error(err?.message || 'Something went wrong');
  }
};
export const updatePetStats = async (stats : any) => {
  try {
    // Making API call to create pet
    const response = await api.put('/api/pet/update-stats',stats);
    return response
  } catch (err: any) {
    throw new Error(err?.message || 'Something went wrong');
  }
};
export const getEvolutionHistory = async () => {
  try {
    // Making API call to create pet
    const response = await api.get('/api/pet/evolution-history');
    return response
  } catch (err: any) {
    throw new Error(err?.message || 'Something went wrong');
  }
};