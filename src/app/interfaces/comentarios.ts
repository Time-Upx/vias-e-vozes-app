import { Usuario_OnRequest } from "./usuarios"

export interface Comentario_OnSave {
    body: string,
    authorId: number,
    contributionId: number
}

export interface Comentario_OnRequest {
    id: number,
    body: string,
    author: Usuario_OnRequest
    contributionId: number,
    quantityOfLikes: number,
    timeOfComment: Date,

    editando?: boolean,
    novoTexto: string
}

export interface Pageable_Comentarios {
    content: Comentario_OnRequest[],
    totalElements: number,
    totalPages: number,
    size: number,
    number: number,
    first: boolean,
    last: boolean
}