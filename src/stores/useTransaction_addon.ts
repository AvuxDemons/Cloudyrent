import { createOrUpdate, getAll, getById, getByTransactionId, remove } from '@/lib/actions/transaction_addon'
import { create } from 'zustand'
import { toast } from "react-toastify";

interface ITransaction_addonStore {
    loading: boolean
    default: ITransaction_addon
    model: ITransaction_addon
    list: ITransaction_addon[]
    setModel: (model?: any) => void
    getAll: () => void
    getById: (id: string) => void
    getByTransactionId: (transactionId: string) => void
    create: () => void
    remove: (id: string) => void
}

export const useTransactionAddon = create<ITransaction_addonStore>((set, get) => ({
    loading: false,
    default: {
        transaction: '',
        add_on: '',
        qty: 0,
        price: 0,


    },
    model: {
        transaction: '',
        add_on: '',
        qty: 0,
        price: 0,

    },
    list: [],
    setModel: (model) => set({ model: (m => (delete m.xata, m))(!model ? { ...get().default } : Object.keys(model).length === 1 ? { ...get().model, ...model } : { ...model }) }),
    getAll: async () => {
        set({ loading: true });
        try {
            const data = await getAll();
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
            const data = await getById(id);
            set({ model: data });
        } catch (error) {
            console.error(error);
        } finally {
            set({ loading: false });
        }
    },
    getByTransactionId: async (transactionId) => {
        set({ loading: true });
        try {
            const data = await getByTransactionId(transactionId);
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
            await createOrUpdate(get().model);
            const transactionId = get().model.transaction;
            if (transactionId) {
                get().getByTransactionId(transactionId);
            } else {
                get().getAll();
                get().setModel();
            }
        } catch (error) {
            console.error(error);
            toast.error(`Gagal menambahkan Add on`);
        } finally {
            set({ loading: false });
        }
    },
    remove: async (id) => {
        set({ loading: true });
        try {
            await remove(id);
            get().getAll();
            get().setModel();
        } catch (error) {
            console.error(error);
            toast.error('Gagal menghapus Add on');
        } finally {
            set({ loading: false });
        }
    }
}))
