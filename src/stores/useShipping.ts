import { createOrUpdate, getAll, getById, remove } from '@/lib/actions/shipping'
import { create } from 'zustand'
import { toast } from "react-toastify";

interface IShippingStore {
    loading: boolean
    default: IShipping
    model: IShipping
    list: IShipping[]
    setModel: (model?: any) => void
    getAll: () => void
    getById: (id: string) => void
    create: () => any
    remove: (id: string) => void
}

export const useShipping = create<IShippingStore>((set, get) => ({
    loading: false,
    default: {
        expedition: null,
        resi: '',
        price: 0

    },
    model: {
        expedition: null,
        resi: '',
        price: 0
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
    create: async () => {
        set({ loading: true });
        try {
            const data = await createOrUpdate(get().model);
            get().getAll();
            get().setModel();
            return data;
        } catch (error) {
            console.error(error);
            toast.error(`Gagal ${get().model.id ? 'mengupdate' : 'membuat'} Pengiriman`);
            return null;
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
            toast.success('Pengiriman berhasil di hapus');
        } catch (error) {
            console.error(error);
            toast.error('Gagal menghapus Pengiriman');
        } finally {
            set({ loading: false });
        }
    }
}))
