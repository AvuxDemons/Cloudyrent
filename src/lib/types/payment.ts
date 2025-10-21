interface IPayment {
    nominal: number
    payment_method: any
    proof: string
    xata?: IXata
}
