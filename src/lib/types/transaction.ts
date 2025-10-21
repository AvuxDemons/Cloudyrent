interface ITransaction {
    user: any
    address: any
    catalog: any
    status: string
    r_shipping: any
    s_shipping: any
    deposit: any
    dp_payment: any
    payment: any
    sett_payment: any
    discount: any
    total_price: number
    final_price: number
    start_rent: Date | null
    end_rent: Date | null
    additional_day: number
    cancel_reason: string | null
    reject_reason: string | null
    settlement_reason: string | null
    xata?: IXata
}
