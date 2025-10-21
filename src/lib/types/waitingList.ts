interface IWaitingList {
    user: string
    catalog: string
    queue: number
    payment: string
    claimed: boolean
    xata?: IXata
}
