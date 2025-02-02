import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {T_Artwork, T_ArtworksFilters, T_Character} from "modules/types.ts";
import {NEXT_MONTH, PREV_MONTH} from "modules/consts.ts";
import {api} from "modules/api.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AxiosResponse} from "axios";

type T_ArtworksSlice = {
    draft_artwork_id: number | null,
    characters_count: number | null,
    artwork: T_Artwork | null,
    artworks: T_Artwork[],
    filters: T_ArtworksFilters,
    save_mm: boolean
}

const initialState:T_ArtworksSlice = {
    draft_artwork_id: null,
    characters_count: null,
    artwork: null,
    artworks: [],
    filters: {
        status: 0,
        date_formation_start: PREV_MONTH.toISOString().split('T')[0],
        date_formation_end: NEXT_MONTH.toISOString().split('T')[0]
    },
    save_mm: false
}

export const fetchArtwork = createAsyncThunk<T_Artwork, string, AsyncThunkConfig>(
    "artworks/artwork",
    async function(artwork_id) {
        const response = await api.artworks.artworksRead(artwork_id) as AxiosResponse<T_Artwork>
        return response.data
    }
)

export const fetchArtworks = createAsyncThunk<T_Artwork[], object, AsyncThunkConfig>(
    "artworks/artworks",
    async function(_, thunkAPI) {
        const state = thunkAPI.getState()

        const response = await api.artworks.artworksList({
            status: state.artworks.filters.status,
            date_formation_start: state.artworks.filters.date_formation_start,
            date_formation_end: state.artworks.filters.date_formation_end
        }) as AxiosResponse<T_Artwork[]>
        return response.data
    }
)

export const removeCharacterFromDraftArtwork = createAsyncThunk<T_Character[], string, AsyncThunkConfig>(
    "artworks/remove_character",
    async function(character_id, thunkAPI) {
        const state = thunkAPI.getState()
        const response = await api.artworks.artworksDeleteCharacterDelete(state.artworks.artwork.id, character_id) as AxiosResponse<T_Character[]>
        return response.data
    }
)

export const deleteDraftArtwork = createAsyncThunk<void, object, AsyncThunkConfig>(
    "artworks/delete_draft_artwork",
    async function(_, {getState}) {
        const state = getState()
        await api.artworks.artworksDeleteDelete(state.artworks.artwork.id)
    }
)

export const sendDraftArtwork = createAsyncThunk<void, object, AsyncThunkConfig>(
    "artworks/send_draft_artwork",
    async function(_, {getState}) {
        const state = getState()
        await api.artworks.artworksUpdateStatusUserUpdate(state.artworks.artwork.id)
    }
)

export const updateArtwork = createAsyncThunk<void, object, AsyncThunkConfig>(
    "artworks/update_artwork",
    async function(data, {getState}) {
        const state = getState()
        await api.artworks.artworksUpdateUpdate(state.artworks.artwork.id, {
            ...data
        })
    }
)

export const updateCharacterValue = createAsyncThunk<void, object, AsyncThunkConfig>(
    "artworks/update_mm_value",
    async function({character_id, comment},thunkAPI) {
        const state = thunkAPI.getState()
        await api.artworks.artworksUpdateCharacterUpdate(state.artworks.artwork.id, character_id, {comment})
    }
)

const artworksSlice = createSlice({
    name: 'artworks',
    initialState: initialState,
    reducers: {
        saveArtwork: (state, action) => {
            state.draft_artwork_id = action.payload.draft_artwork_id
            state.characters_count = action.payload.characters_count
        },
        removeArtwork: (state) => {
            state.artwork = null
        },
        triggerUpdateMM: (state) => {
            state.save_mm = !state.save_mm
        },
        updateFilters: (state, action) => {
            state.filters = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchArtwork.fulfilled, (state:T_ArtworksSlice, action: PayloadAction<T_Artwork>) => {
            state.artwork = action.payload
        });
        builder.addCase(fetchArtworks.fulfilled, (state:T_ArtworksSlice, action: PayloadAction<T_Artwork[]>) => {
            state.artworks = action.payload
        });
        builder.addCase(removeCharacterFromDraftArtwork.rejected, (state:T_ArtworksSlice) => {
            state.artwork = null
        });
        builder.addCase(removeCharacterFromDraftArtwork.fulfilled, (state:T_ArtworksSlice, action: PayloadAction<T_Character[]>) => {
            if (state.artwork) {
                state.artwork.characters = action.payload as T_Character[]
            }
        });
        builder.addCase(sendDraftArtwork.fulfilled, (state:T_ArtworksSlice) => {
            state.artwork = null
        });
    }
})

export const { saveArtwork, removeArtwork, triggerUpdateMM, updateFilters } = artworksSlice.actions;

export default artworksSlice.reducer