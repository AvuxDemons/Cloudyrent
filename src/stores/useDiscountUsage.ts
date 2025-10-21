import { create } from 'zustand'
import { fetchServer } from '@/lib/fetch'
import { toast } from "react-toastify";

const tags = ['discount_usage'];

interface IDiscountUsageStore {
    loading: boolean
    default: IDiscountUsage
    model: IDiscountUsage
    list: IDiscountUsage[]
    setModel: (model?: any) => void
    getAll: () => void
    getById: (id: string) => void
    getByDiscount: (discountId: string) => void
    getByUserAndDiscount: (userId: string, discountId: string) => void
    create: () => void
    remove: (id: string) => void
}

export const useDiscountUsage = create<IDiscountUsageStore>((set, get) => ({
    loading: false,
    default: {
        user: '',
        discount: ''
    },
    model: {
        user: '',
        discount: ''
    },
    list: [],
    setModel: (model) => set({ model: (m => (delete m.xata, m))(!model ? { ...get().default } : Object.keys(model).length === 1 ? { ...get().model, ...model } : { ...model }) }),
    getAll: async () => {
        set({ loading: true });
        try {
            const data = await fetchServer('/api/discount_usage', { tags: tags });
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
            const data = await fetchServer(`/api/discount_usage?id=${id}`);
            set({ model: data });
        } catch (error) {
            console.error(error);
        } finally {
            set({ loading: false });
        }
    },
    getByDiscount: async (discountId) => {
        set({ loading: true });
        try {
            const data = await fetchServer(`/api/discount_usage?discount=${discountId}`);
            set({ list: data });
        } catch (error) {
            console.error(error);
        } finally {
            set({ loading: false });
        }
    },
    getByUserAndDiscount: async (userId, discountId) => {
        set({ loading: true });
        try {
            const data = await fetchServer(`/api/discount_usage?user=${userId}&discount=${discountId}`);
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
            const data = await fetchServer('/api/discount_usage', {
                method: 'POST',
                body: get().model,
                cache: 'no-store'
            });
            get().getAll();
            get().setModel();
            toast.success('Discount usage berhasil dibuat');
        } catch (error) {
            console.error(error);
            toast.error('Gagal membuat discount usage');
        } finally {
            set({ loading: false });
        }
    },
    remove: async (id) => {
        set({ loading: true });
        try {
            await fetchServer('/api/discount_usage', {
                method: 'DELETE',
                body: { id },
                cache: 'no-store'
            });
            get().getAll();
            get().setModel();
            toast.success('Discount usage berhasil dihapus');
        } catch (error) {
            console.error(error);
            toast.error('Gagal menghapus discount usage');
        } finally {
            set({ loading: false });
        }
    }
}));
