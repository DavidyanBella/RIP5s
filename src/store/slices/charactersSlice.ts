import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {T_Character, T_CharactersListResponse} from "modules/types.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {api} from "modules/api.ts";
import {AxiosResponse} from "axios";
import {saveArtwork} from "store/slices/artworksSlice.ts";

type T_CharactersSlice = {
    character_name: string
    character: null | T_Character
    characters: T_Character[]
}

const initialState:T_CharactersSlice = {
    character_name: "",
    character: null,
    characters: []
}

export const fetchCharacter = createAsyncThunk<T_Character, string, AsyncThunkConfig>(
    "fetch_character",
    async function(id) {
        const response = await api.characters.charactersRead(id) as AxiosResponse<T_Character>
        return response.data
    }
)

export const fetchCharacters = createAsyncThunk<T_Character[], object, AsyncThunkConfig>(
    "fetch_characters",
    async function(_, thunkAPI) {
        const state = thunkAPI.getState();
        const response = await api.characters.charactersList({
            character_name: state.characters.character_name
        }) as AxiosResponse<T_CharactersListResponse>

        thunkAPI.dispatch(saveArtwork({
            draft_artwork_id: response.data.draft_artwork_id,
            characters_count: response.data.characters_count
        }))

        return response.data.characters
    }
)

export const addCharacterToArtwork = createAsyncThunk<void, string, AsyncThunkConfig>(
    "characters/add_character_to_artwork",
    async function(character_id) {
        await api.characters.charactersAddToArtworkCreate(character_id)
    }
)

const charactersSlice = createSlice({
    name: 'characters',
    initialState: initialState,
    reducers: {
        updateCharacterName: (state, action) => {
            state.character_name = action.payload
        },
        removeSelectedCharacter: (state) => {
            state.character = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCharacters.fulfilled, (state:T_CharactersSlice, action: PayloadAction<T_Character[]>) => {
            state.characters = action.payload
        });
        builder.addCase(fetchCharacter.fulfilled, (state:T_CharactersSlice, action: PayloadAction<T_Character>) => {
            state.character = action.payload
        });
    }
})

export const { updateCharacterName, removeSelectedCharacter} = charactersSlice.actions;

export default charactersSlice.reducer