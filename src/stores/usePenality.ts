import { createOrUpdate, getAll, getById, remove } from '@/lib/actions/penality'
import { create } from 'zustand'
import { toast } from "react-toastify";

interface IPenaltyStore {
    loading: boolean
    default: IPenalty
    model: IPenalty
    list: IPenalty[]
    setModel: (model?: any) => void
    getAll: () => void
    getById: (id: string) => void
    create: () => void
    remove: (id: string) => void
}

export const usePenalty = create<IPenaltyStore>((set, get) => ({
    loading: false,
    default: {
        details: {},
        total_price: 0,
        image: '',
        transaction: ''
    },
    model: {
        details: {},
        total_price: 0,
        image: '',
        transaction: ''
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
            toast.success(`Penalty berhasil ${data.id ? 'di update' : 'Ditambahkan'}`);
        } catch (error) {
            console.error(error);
            toast.error(`Gagal ${get().model.id ? 'mengupdate' : 'menambahkan'} Penalty`);
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
            toast.success('Penalty berhasil di hapus');
        } catch (error) {
            console.error(error);
            toast.error('Gagal menghapus Penalty');
        } finally {
            set({ loading: false });
        }
    }
}))
