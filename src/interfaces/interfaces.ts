export interface IMovie {
    name: string
    description: string | null
    duration: number
    price: number
}

export interface IPagination {
    previousPage: string | null
    nextPage: string | null
    count: number
    data: Array<IMovie>
}