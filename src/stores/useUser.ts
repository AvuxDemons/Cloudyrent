import { create } from 'zustand'
import { fetchServer } from '@/lib/fetch'
import { toast } from "react-toastify";

const tags = ['user'];

interface IUserStore {
    loading: boolean
    default: IUser
    model: IUser
    list: IUser[]
    setModel: (model?: any) => void
    getAll: () => void
    getById: (id: string) => void
    create: () => void
    remove: (id: string) => void
    toggleAdmin: (id: string, isAdmin: boolean) => void
    toggleBlacklist: (id: string, isBlacklist: boolean) => void
}

export const useUser = create<IUserStore>((set, get) => ({
    loading: false,
    default: {
        email: '',
        image: '',
        name: '',
        full_name: '',
        phone_whatsapp: '',
        emergency_contact: '',
        address: [],
        identity_pict: '',
        selfie_pict: '',
        rent_proof: [],
        instagram: '',
        tiktok: '',
        twitter: '',
        facebook: '',
        total_rent: 0,
        is_blacklist: false,
        is_admin: false,
    },
    model: {
        email: '',
        image: '',
        name: '',
        full_name: '',
        phone_whatsapp: '',
        emergency_contact: '',
        address: [],
        identity_pict: '',
        selfie_pict: '',
        rent_proof: [],
        instagram: '',
        tiktok: '',
        twitter: '',
        facebook: '',
        total_rent: 0,
        is_blacklist: false,
        is_admin: false,
    },
    list: [],
    setModel: (model) => set({ model: (m => (delete m.xata, m))(!model ? { ...get().default } : Object.keys(model).length === 1 ? { ...get().model, ...model } : { ...model }) }),
    getAll: async () => {
        set({ loading: true });
        try {
            const data = await fetchServer('/api/user', { tags: tags });
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
            const data = await fetchServer(`/api/user?id=${id}`);
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
            const data = await fetchServer('/api/user', {
                method: 'POST',
                body: get().model,
                cache: 'no-store'
            });
            get().getAll();
            get().setModel();
            toast.success('User berhasil dibuat');
        } catch (error) {
            console.error(error);
            toast.error('Gagal membuat user');
        } finally {
            set({ loading: false });
        }
    },
    remove: async (id) => {
        set({ loading: true });
        try {
            await fetchServer('/api/user', {
                method: 'DELETE',
                body: { id },
                cache: 'no-store'
            });
            get().getAll();
            get().setModel();
            toast.success('User berhasil dihapus');
        } catch (error) {
            console.error(error);
            toast.error('Gagal menghapus user');
        } finally {
            set({ loading: false });
        }
    },
    toggleAdmin: async (id, isAdmin) => {
        set({ loading: true });
        try {
            await fetchServer('/api/user', {
                method: 'POST',
                body: { id, is_admin: isAdmin },
                cache: 'no-store'
            });
            get().getAll();
            toast.success(`User ${isAdmin ? 'diberi' : 'dicabut'} hak admin`);
        } catch (error) {
            console.error(error);
            toast.error('Gagal mengubah status admin');
        } finally {
            set({ loading: false });
        }
    },
    toggleBlacklist: async (id, isBlacklist) => {
        set({ loading: true });
        try {
            await fetchServer('/api/user', {
                method: 'POST',
                body: { id, is_blacklist: isBlacklist },
                cache: 'no-store'
            });
            get().getAll();
            toast.success(`User ${isBlacklist ? 'dimasukkan' : 'dikeluarkan'} dari blacklist`);
        } catch (error) {
            console.error(error);
            toast.error('Gagal mengubah status blacklist');
        } finally {
            set({ loading: false });
        }
    }
}));
