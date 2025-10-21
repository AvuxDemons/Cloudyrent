import { create } from 'zustand'
import { fetchServer } from '@/lib/fetch'
import { toast } from "react-toastify";

const tags = ['transaction'];

interface ITransactionStore {
    loading: boolean
    default: ITransaction
    model: ITransaction
    list: ITransaction[]
    setModel: (model?: any) => void
    getAll: () => void
    getById: (id: string) => void
    getByUser: (userId: string) => void
    getByCatalog: (catalogId: string) => void
    create: () => void
    remove: (id: string) => void
    updateTransactionsByCatalogAndStatus: (catalogId: string, oldStatus: string, newStatus: string) => Promise<any>
}

export const transactionStatus = [
    {
        value: 'pending',
        label: 'Pending',
        color: '#FFB347',
        description: 'Waiting approval by Admin'
    },
    {
        value: 'waiting',
        label: 'Waiting',
        color: '#FFD3B6',
        description: 'Waiting Payment by Customer'
    },
    {
        value: 'dp',
        label: 'Down Payment',
        color: '#FFEEAD',
        description: 'Customer paid down payment'
    },
    {
        value: 'paid',
        label: 'Paid',
        color: '#B5EAD7',
        description: 'Customer paid full amount'
    },
    {
        value: 'sending',
        label: 'Sending',
        color: '#A2C8FF',
        description: 'Order is on the way'
    },
    {
        value: 'returning',
        label: 'Returning',
        color: '#A2C8FF',
        description: 'Customer returned the item'
    },
    {
        value: 'settlement',
        label: 'Settlement',
        color: '#D8B5FF',
        description: 'Item has been settled'
    },
    {
        value: 'done',
        label: 'Done',
        color: '#DCEDC1',
        description: 'Transaction Completed'
    }
]

export const extendedTransactionStatus = [
    {
        value: 'deposit',
        label: 'Deposit',
        color: '#E8B5FF',
        description: 'Depo'
    },
    {
        value: 'priority',
        label: 'Priority Book',
        color: '#E8B5FF',
        description: 'Priority Book'
    },
    ...transactionStatus,
    {
        value: "reject",
        label: "Rejected",
        color: "",
        description: "",
    },
    {
        value: "cancel",
        label: "Canceled",
        color: "",
        description: "",
    },
];

export const depositExtendedTransactionStatus = [
    {
        value: 'deposit',
        label: 'Deposit',
        color: '#E8B5FF',
        description: 'Depo'
    },
    {
        value: 'priority',
        label: 'Priority Book',
        color: '#E8B5FF',
        description: 'Priority Book'
    },
    ...transactionStatus,
];

export const getStatusIndex = (status: string, arr: { value: string }[] = transactionStatus) => {
    return arr.findIndex(s => s.value === status);
};


export const useTransaction = create<ITransactionStore>((set, get) => ({
    loading: false,
    default: {
        user: null,
        address: null,
        catalog: null,
        status: '',
        r_shipping: null,
        s_shipping: null,
        deposit: null,
        dp_payment: null,
        payment: null,
        sett_payment: null,
        discount: null,
        total_price: 0,
        final_price: 0,
        start_rent: null,
        end_rent: null,
        additional_day: 0,
        cancel_reason: null,
        reject_reason: null,
        settlement_reason: null,
    },
    model: {
        user: null,
        address: null,
        catalog: null,
        status: '',
        r_shipping: null,
        s_shipping: null,
        deposit: null,
        dp_payment: null,
        payment: null,
        sett_payment: null,
        discount: null,
        total_price: 0,
        final_price: 0,
        start_rent: null,
        end_rent: null,
        additional_day: 0,
        cancel_reason: null,
        reject_reason: null,
        settlement_reason: null,
    },
    list: [],
    setModel: (model) => set({ model: (m => (delete m.xata, m))(!model ? { ...get().default } : Object.keys(model).length === 1 ? { ...get().model, ...model } : { ...model }) }),
    getAll: async () => {
        set({ loading: true });
        try {
            const data = await fetchServer('/api/transaction', { tags: tags });
            set({ list: data });
        } catch (error) {
            console.error(error);
        } finally {
            set({ loading: false });
        }
    },
    getById: async (id) => {
        set({ loading: true });
        try {
            const data = await fetchServer(`/api/transaction?id=${id}`);
            set({ model: data });
        } catch (error) {
            console.error(error);
        } finally {
            set({ loading: false });
        }
    },
    getByUser: async (userId) => {
        set({ loading: true });
        try {
            const data = await fetchServer(`/api/transaction?user=${userId}`);
            set({ list: data });
        } catch (error) {
            console.error(error);
        } finally {
            set({ loading: false });
        }
    },
    getByCatalog: async (catalogId) => {
        set({ loading: true });
        try {
            const data = await fetchServer(`/api/transaction?catalog=${catalogId}`);
            set({ list: data });
        } catch (error) {
            console.error(error);
        } finally {
            set({ loading: false });
        }
    },
    create: async () => {
        set({ loading: true });
        try {
            const data = await fetchServer('/api/transaction', {
                method: 'POST',
                body: get().model,
                cache: 'no-store'
            });
            get().getAll();
            get().setModel();
            toast.success('Transaction berhasil dibuat');
        } catch (error) {
            console.error(error);
            toast.error('Gagal membuat transaction');
        } finally {
            set({ loading: false });
        }
    },
    remove: async (id) => {
        set({ loading: true });
        try {
            await fetchServer('/api/transaction', {
                method: 'DELETE',
                body: { id },
                cache: 'no-store'
            });
            get().getAll();
            get().setModel();
            toast.success('Transaction berhasil dihapus');
        } catch (error) {
            console.error(error);
            toast.error('Gagal menghapus transaction');
        } finally {
            set({ loading: false });
        }
    },
    updateStatusBulk: async (catalogId, oldStatus, newStatus) => {
        set({ loading: true });
        try {
            const result = await fetchServer('/api/transaction', {
                method: 'PUT',
                body: { catalogId, oldStatus, newStatus },
                cache: 'no-store'
            });
            get().getAll();
            toast.success(`Updated ${result.updatedCount} transactions`);
            return result;
        } catch (error) {
            console.error(error);
            toast.error('Gagal update status transaction');
            return { success: false, updatedCount: 0 };
        } finally {
            set({ loading: false });
        }
    }
}));
