import { create } from 'zustand'
import { fetchServer } from '@/lib/fetch'
import { toast } from "react-toastify";

const tags = ['payment_accounts'];

interface IPaymentAccountsStore {
    loading: boolean
    default: IPaymentAccounts
    model: IPaymentAccounts
    list: IPaymentAccounts[]
    setModel: (model?: any) => void
    getAll: () => void
    getById: (id: string) => void
    create: () => void
    remove: (id: string) => void
}

export const usePaymentAccounts = create<IPaymentAccountsStore>((set, get) => ({
    loading: false,
    default: {
        bank_name: '',
        account_number: '',
        account_name: '',
    },
    model: {
        bank_name: '',
        account_number: '',
        account_name: '',
    },
    list: [],
    setModel: (model) => set({ model: (m => (delete m.xata, m))(!model ? { ...get().default } : Object.keys(model).length === 1 ? { ...get().model, ...model } : { ...model }) }),
    getAll: async () => {
        set({ loading: true });
        try {
            const data = await fetchServer('/api/payment_accounts', { tags: tags });
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
            const data = await fetchServer(`/api/payment_accounts?id=${id}`);
            set({ model: data });
        } catch (error) {
            console.error(error);
        } finally {
            set({ loading: false });
        }
    },
    create: async () => {
        set({ loading: true });
        try {
            const data = await fetchServer('/api/payment_accounts', {
                method: 'POST',
                body: get().model,
                cache: 'no-store'
            });
            get().getAll();
            get().setModel();
            toast.success(`Payment account berhasil ${data.bank_name ? 'di update' : 'Ditambahkan'}`);
        } catch (error) {
            console.error(error);
            toast.error(`Gagal ${get().model.bank_name ? 'mengupdate' : 'menambahkan'} payment account`);
        } finally {
            set({ loading: false });
        }
    },
    remove: async (id) => {
        set({ loading: true });
        try {
            await fetchServer('/api/payment_accounts', {
                method: 'DELETE',
                body: { id },
                cache: 'no-store'
            });
            get().getAll();
            get().setModel();
            toast.success('Payment account berhasil di hapus');
        } catch (error) {
            console.error(error);
            toast.error('Gagal menghapus payment account');
        } finally {
            set({ loading: false });
        }
    },
}));
