export interface Contribuições {
    name: string,
    description: string,
    type: string,
    links: Link[],
    authorId: number,
    isAnonymous: boolean,
    address: {
        street: string,
        number: string,
        neighborhood: string,
        city: string,
        state: string,
        CEP: string
    }
}

export interface Link {
    titulo: string;
    url: string;
}
