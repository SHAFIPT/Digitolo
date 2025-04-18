import { userAxiosInstance } from "../service/api";


const api = userAxiosInstance



export const loginUser = async (email: string, password: string ) => {
    try {
        const response = await api.post('/api/auth/login', {
           email, password 
        })
        return response
    } catch (error) {
         console.error("Error loginUser:", error);
         throw error;
    }
}

export const sendRegistrationOTP = async (email: string) => {
    try {

        const response = await api.post('/api/auth/sendOtp', {email }   
        )
        return response
        
    } catch (error) {
        console.error("Error registerUser:", error);
        throw error;
    }
}
export const verifyRegistrationOTP = async (email: string, otp: string) => {
    try {

        const response = await api.post('/api/auth/verifyOTP', {
            email,
            otp
        })

        return response
        
    } catch (error) {
        console.error("Error verifyOtp:", error);
        throw error;
    }
}
export const resetPassword = async (email: string, password: string) => {
    try {

        const response = await api.post('/api/auth/resetPassword', {
            email,
            password
        })

        return response
        
    } catch (error) {
        console.error("Error verifyOtp:", error);
        throw error;
    }
}
export const sendPasswordResetOTP = async (email: string) => {
    try {

        const response = await api.post('/api/auth/sendPasswordResetOTP', {
            email,
        })

        return response
        
    } catch (error) {
        console.error("Error send Password Reset OTP:", error);
        throw error;
    }
}

export const registerUser = async (email: string, password: string, name?: string) => {
    try {
        const response = await api.post('/api/auth/register', {
            user: { email, name, password }
        });

        return response;
    } catch (error) {
        console.error("Error in register user:", error);
        throw error;
    }
};

export const userLogout = async () => {
    try {

        const response = await api.post('/api/auth/logout')
        return response
        
    } catch (error) {
      console.error("Error in logout user:", error);
        throw error; 
    }
}
