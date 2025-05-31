export interface Link {
    display: string,
    url: string
}

export interface Address {
    cep: number | null,
    state: string,
    city: string,
    neighborhood: string,
    street: string,
    number: number | null,
    complement: string
}

export interface Image {
    fileName: string,
    extension: string,
    content: string,
    placeholder: string
}