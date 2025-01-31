import {createSlice} from "@reduxjs/toolkit";

type T_CharactersSlice = {
    character_name: string
}

const initialState:T_CharactersSlice = {
    character_name: "",
}


const charactersSlice = createSlice({
    name: 'characters',
    initialState: initialState,
    reducers: {
        updateCharacterName: (state, action) => {
            state.character_name = action.payload
        }
    }
})

export const { updateCharacterName} = charactersSlice.actions;

export default charactersSlice.reducer