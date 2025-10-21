interface IDiscount {
    code: string
    amount: number
    catalog: any
    limit: number
    is_per_user: boolean
    xata?: IXata
}