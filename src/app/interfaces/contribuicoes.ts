import { Usuario_OnRequest } from "./usuarios"
import { Address, Image, Link } from "./utils"

export interface Contribution_OnSave {
    title: string,
    description: string,
    type: string
    links: Link[],
    imagePlaceholder: string,
    authorId: number,
    isAnonymous: boolean,
    address: Address
}

export interface Contribution_OnUpdate {
    title: string,
    description: string,
    type: string
    links: Link[],
    isAnonymous: boolean,
    status: string,
    address: Address
}

export interface Contribution_OnRequest {
    id: number,
    title: string,
    description?: string,
    type: string,
    author: Usuario_OnRequest,
    timeOfCreation: Date,
    isAnonymous: boolean,
    status: string,
    authorName: string | undefined,
    imageContent?: Image,
    imageUrl?: string,
    quantityOfLikes?: number
}

export interface Contribution_OnDetailedRequest {
    id: number,
    title: string,
    description: string,
    type: string,
    links: Link[],
    image: Image,
    author: Usuario_OnRequest,
    timeOfCreation: Date,
    isAnonymous: boolean,
    quantityOfLikes: number,
    status: string,
    isActive: boolean,
    address: Address
}

export interface PageableContribution {
    content: Contribution_OnRequest[],
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