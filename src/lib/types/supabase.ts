// Supabase Database Types for Cloudyrentrent
// These types mirror the existing Xata database structure

export interface Brand {
    id: string
    name?: string
    created_at: string
    updated_at: string
}

export interface Series {
    id: string
    name?: string
    category: string
    created_at: string
    updated_at: string
}

export interface Character {
    id: string
    name?: string
    series_id?: string
    created_at: string
    updated_at: string
}

export interface Catalog {
    id: string
    name?: string
    description?: string
    catalog_type?: string
    gender?: string
    size?: string
    max_size?: string
    price: number
    status?: string
    weight: number
    height: number
    width: number
    length: number
    important_info?: string
    is_weekday?: boolean
    images?: string[]
    brand_id?: string
    character_id?: string
    created_at: string
    updated_at: string
}

export interface AddOn {
    id: string
    name?: string
    price: number
    stock?: number
    image?: string
    created_at: string
    updated_at: string
}

export interface BundleItem {
    id: string
    bundle_id?: string
    costume_id?: string
    created_at: string
    updated_at: string
}

export interface Coupon {
    id: string
    code: string
    name?: string
    discount_type: string
    discount_value?: number
    type: string
    is_enable: boolean
    start_date?: string
    end_date?: string
    min_order_amount?: number
    usage_limit?: number
    per_user_limit?: number
    created_at: string
    updated_at: string
}

export interface CouponApplicability {
    id: string
    coupon_id?: string
    catalog_id?: string
    apply_to_all: boolean
    created_at: string
    updated_at: string
}

export interface Payment {
    id: string
    nominal?: number
    proof?: string
    created_at: string
    updated_at: string
}

export interface Shipping {
    id: string
    resi?: string
    price?: number
    created_at: string
    updated_at: string
}

export interface Address {
    id: string
    user_id?: string
    label?: string
    full_address?: string
    address_details?: string
    receiver?: string
    latitude?: number
    longitude?: number
    created_at: string
    updated_at: string
}

export interface Transaction {
    id: string
    user_id?: string
    catalog_id?: string
    address_id?: string
    coupons_id?: string
    deposit_id?: string
    dp_payment_id?: string
    payment_id?: string
    sett_payment_id?: string
    send_shipping_id?: string
    return_shipping_id?: string
    status?: string
    start_rent?: string
    end_rent?: string
    additional_day?: number
    total_price: number
    final_price: number
    coupon_discount?: number
    cancel_reason?: string
    reject_reason?: string
    settlement_reason?: string
    created_at: string
    updated_at: string
}

export interface TransactionAddon {
    id: string
    transaction_id?: string
    add_on_id?: string
    price?: number
    qty?: number
    created_at: string
    updated_at: string
}

export interface TransactionCoupon {
    id: string
    transaction_id?: string
    coupons_id?: string
    created_at: string
    updated_at: string
}

export interface UserCoupon {
    id: string
    user_id?: string
    coupons_id?: string
    usage_count?: number
    created_at: string
    updated_at: string
}

export interface Penalty {
    id: string
    transaction_id?: string
    details?: string
    image?: string
    price: number
    created_at: string
    updated_at: string
}

export interface RentSchedule {
    id: string
    transaction_id?: string
    catalog_id?: string
    start_date?: string
    end_date?: string
    created_at: string
    updated_at: string
}

export interface WaitingList {
    id: string
    user_id?: string
    catalog_id?: string
    payment_id?: string
    queue?: number
    created_at: string
    updated_at: string
}

export interface Wishlist {
    id: string
    user_id?: string
    catalog_id?: string
    created_at: string
    updated_at: string
}

export interface Setting {
    id: string
    value?: string
    visible: boolean
    created_at: string
    updated_at: string
}

// Database schema type
export interface User {
    id: string
    email: string
    name?: string
    full_name?: string
    phone_whatsapp?: string
    emergency_contact?: string
    identity_pict?: string
    selfie_pict?: string
    instagram?: string
    total_rent?: number
    is_blacklist?: boolean
    is_admin?: boolean
    created_at: string
    updated_at: string
}

export interface Database {
    public: {
        Tables: {
            users: {
                Row: User
                Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
            }
            brands: {
                Row: Brand
                Insert: Omit<Brand, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Brand, 'id' | 'created_at' | 'updated_at'>>
            }
            series: {
                Row: Series
                Insert: Omit<Series, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Series, 'id' | 'created_at' | 'updated_at'>>
            }
            characters: {
                Row: Character
                Insert: Omit<Character, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Character, 'id' | 'created_at' | 'updated_at'>>
            }
            catalog: {
                Row: Catalog
                Insert: Omit<Catalog, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Catalog, 'id' | 'created_at' | 'updated_at'>>
            }
            add_ons: {
                Row: AddOn
                Insert: Omit<AddOn, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<AddOn, 'id' | 'created_at' | 'updated_at'>>
            }
            bundle_items: {
                Row: BundleItem
                Insert: Omit<BundleItem, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<BundleItem, 'id' | 'created_at' | 'updated_at'>>
            }
            coupons: {
                Row: Coupon
                Insert: Omit<Coupon, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Coupon, 'id' | 'created_at' | 'updated_at'>>
            }
            coupon_applicability: {
                Row: CouponApplicability
                Insert: Omit<CouponApplicability, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<CouponApplicability, 'id' | 'created_at' | 'updated_at'>>
            }
            payments: {
                Row: Payment
                Insert: Omit<Payment, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Payment, 'id' | 'created_at' | 'updated_at'>>
            }
            shipping: {
                Row: Shipping
                Insert: Omit<Shipping, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Shipping, 'id' | 'created_at' | 'updated_at'>>
            }
            addresses: {
                Row: Address
                Insert: Omit<Address, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Address, 'id' | 'created_at' | 'updated_at'>>
            }
            transactions: {
                Row: Transaction
                Insert: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>
            }
            transaction_addons: {
                Row: TransactionAddon
                Insert: Omit<TransactionAddon, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<TransactionAddon, 'id' | 'created_at' | 'updated_at'>>
            }
            transaction_coupons: {
                Row: TransactionCoupon
                Insert: Omit<TransactionCoupon, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<TransactionCoupon, 'id' | 'created_at' | 'updated_at'>>
            }
            user_coupons: {
                Row: UserCoupon
                Insert: Omit<UserCoupon, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<UserCoupon, 'id' | 'created_at' | 'updated_at'>>
            }
            penalties: {
                Row: Penalty
                Insert: Omit<Penalty, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Penalty, 'id' | 'created_at' | 'updated_at'>>
            }
            rent_schedules: {
                Row: RentSchedule
                Insert: Omit<RentSchedule, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<RentSchedule, 'id' | 'created_at' | 'updated_at'>>
            }
            waiting_list: {
                Row: WaitingList
                Insert: Omit<WaitingList, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<WaitingList, 'id' | 'created_at' | 'updated_at'>>
            }
            wishlist: {
                Row: Wishlist
                Insert: Omit<Wishlist, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Wishlist, 'id' | 'created_at' | 'updated_at'>>
            }
            settings: {
                Row: Setting
                Insert: Omit<Setting, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Setting, 'id' | 'created_at' | 'updated_at'>>
            }
        }
    }
}
