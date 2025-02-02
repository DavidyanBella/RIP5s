import {configureStore, ThunkDispatch} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import userReducer from "./slices/userSlice.ts"
import artworksReducer from "./slices/artworksSlice.ts"
import charactersReducer from "./slices/charactersSlice.ts"

export const store = configureStore({
    reducer: {
        user: userReducer,
        artworks: artworksReducer,
        characters: charactersReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppThunkDispatch = ThunkDispatch<RootState, never, never>

export const useAppDispatch = () => useDispatch<AppThunkDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;