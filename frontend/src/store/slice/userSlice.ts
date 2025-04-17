import { IUser } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
    user: IUser;
    role: "user" | null; 
    loading: boolean;
    error: object | null;
    isUserAuthenticated: boolean;
    formData: Partial<IUser>;
}

const initialState: IInitialState = {
    user: {} as IUser,
    loading: false,
    error: null, 
    isUserAuthenticated: false,
    formData: {},
    role: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<IUser>) {
            state.user = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<object | null>) {
            state.error = action.payload;
        },
        setIsUserAuthenticated(state, action: PayloadAction<boolean>) {
            state.isUserAuthenticated = action.payload;
        },
        setFormData(state, action: PayloadAction<Partial<IUser>>) {
            state.formData = action.payload;
        },
        resetUser(state) {
            state.user = {} as IUser;
            state.error = null; 
            state.formData = { name: "", email: "" };
            state.loading = false;
            state.isUserAuthenticated = false;
            state.role = null;
        },
    },
});

export const { setUser, setLoading, setError, setIsUserAuthenticated, setFormData, resetUser } = userSlice.actions;
export default userSlice.reducer;
