export type T_Character =  {
    id: string,
    name: string,
    description: string,
    category: string,
    image: string,
    status: number
    comment?: string
}

export type T_Artwork = {
    id: string | null
    status: E_ArtworkStatus
    date_complete: string
    date_created: string
    date_formation: string
    owner: string
    moderator: string
    characters: T_Character[]
    name: string
    count: string
}

export enum E_ArtworkStatus {
    Draft=1,
    InWork,
    Completed,
    Rejected,
    Deleted
}

export type T_User = {
    id: number
    username: string
    is_authenticated: boolean
}

export type T_ArtworksFilters = {
    date_formation_start: string
    date_formation_end: string
    status: E_ArtworkStatus
}

export type T_CharactersListResponse = {
    characters: T_Character[],
    draft_artwork_id: number,
    characters_count: number
}

export type T_LoginCredentials = {
    username: string
    password: string
}

export type T_RegisterCredentials = {
    name: string
    email: string
    password: string
}