import { create } from 'zustand'
import { fetchServer } from '@/lib/fetch'
import { toast } from "react-toastify";

const tags = ['wishlist'];

interface IWishlistStore {
    loading: boolean
    default: IWishlist
    model: IWishlist
    list: IWishlist[]
    setModel: (model?: any) => void
    getAll: () => void
    getById: (id: string) => void
    getByUser: (userId: string) => void
    create: () => void
    remove: (id: string) => void
}

export const useWishlist = create<IWishlistStore>((set, get) => ({
    loading: false,
    default: {
        user: '',
        catalog: '',
    },
    model: {
        user: '',
        catalog: '',
    },
    list: [],
    setModel: (model) => set({ model: (m => (delete m.xata, m))(!model ? { ...get().default } : Object.keys(model).length === 1 ? { ...get().model, ...model } : { ...model }) }),
    getAll: async () => {
        set({ loading: true });
        try {
            const data = await fetchServer('/api/wishlist', { tags: tags });
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
            const data = await fetchServer(`/api/wishlist?id=${id}`);
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
            const data = await fetchServer(`/api/wishlist?user=${userId}`);
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
            const data = await fetchServer('/api/wishlist', {
                method: 'POST',
                body: get().model,
                cache: 'no-store'
            });
            get().getByUser(get().model.user);
            get().setModel();
            toast.success('Wishlist item berhasil ditambahkan');
        } catch (error) {
            console.error(error);
            toast.error('Gagal menambahkan wishlist item');
        } finally {
            set({ loading: false });
        }
    },
    remove: async (id) => {
        set({ loading: true });
        try {
            await fetchServer('/api/wishlist', {
                method: 'DELETE',
                body: { id },
                cache: 'no-store'
            });
            get().getByUser(get().model.user);
            get().setModel();
            toast.success('Wishlist item berhasil di hapus');
        } catch (error) {
            console.error(error);
            toast.error('Gagal menghapus wishlist item');
        } finally {
            set({ loading: false });
        }
    },
}));
