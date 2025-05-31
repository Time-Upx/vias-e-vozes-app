import { Image } from "./utils"

export interface Usuario_OnSave {
    name: string,
    role: string,
    password: string,
    picturePlaceholder: string,
    email: string,
    preferAnonymous: boolean
}

export interface Usuario_OnUpdate {
    name?: string,
    role?: string,
    password?: string,
    email?: string,
    preferAnonymous?: boolean
}

export interface Usuario_OnRequest {
    id: number,
    name: string,
    timeOfArrival: Date,
    role: string,
    preferAnonymous: boolean
}

export interface PageableUsuarios {
    content: Usuario_OnRequest[],
    empty: boolean,
    first: boolean,
    last: boolean,
    number: number,
    numberOfElements: number,
    pageable: {
        offset: number,
        pageNumber: number,
        pageSize: number,
        paged: boolean,
        sort: {
            sorted: boolean,
            unsorted: boolean,
            empty: boolean
        },
        unpaged: boolean
    },
    size: number,
    sort: {
        sorted: boolean,
        unsorted: boolean,
        empty: boolean
    },
    totalElements: number,
    totalPages: number
}

export interface Usuario_OnDetailedRequest {
    id: number,
    name: string,
    role: string,
    password: string,
    profilePicture: Image,
    email: string,
    preferAnonymous: boolean,
    isActive: boolean
}

export interface Usuario_OnLoginValidation {
    id: number | undefined,
    email: string | undefined,
    password: string
}

export interface Usuario_OnLoginResponse {
    user: Usuario_OnDetailedRequest | undefined,
    result: boolean
}