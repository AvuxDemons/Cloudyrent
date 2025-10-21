import { createOrUpdate, getAll, getByCatalog, getById, remove } from '@/lib/actions/waiting_list'
import { create } from 'zustand'
import { toast } from "react-toastify";


interface IWaitingListStore {
    loading: boolean
    default: IWaitingList
    model: IWaitingList
    list: IWaitingList[]
    setModel: (model?: any) => void
    getAll: () => void
    getById: (id: string) => void
    getByCatalog: (catalog: string) => void
    create: () => void
    remove: (id: string) => void
}

export const useWaitingList = create<IWaitingListStore>((set, get) => ({
    loading: false,
    default: {
        user: '',
        catalog: '',
        queue: 0,
        payment: '',
        claimed: false

    },
    model: {
        user: '',
        catalog: '',
        queue: 0,
        payment: '',
        claimed: false
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

    getByCatalog: async (catalogId: string) => {
        set({ loading: true });
        try {
            const data = await getByCatalog(catalogId);
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
            const data = await createOrUpdate(get().model);
            get().getAll();
            get().setModel();
            toast.success(`Waiting List ${data.name} ${data.id ? 'created' : 'updated'} successfully`);
        } catch (error) {
            console.error(error);
            toast.error(`Failed add to Waiting List`);
        } finally {
            set({ loading: false });
        }
    },
    remove: async (id) => {
        set({ loading: true });
        try {
            const data = await remove(id);
            get().getAll();
            get().setModel();
            // toast.success(`Waiting List ${data.name} deleted successfully`);
        } catch (error) {
            console.error(error);
            toast.error(`Failed to delete data Waiting List`);
        } finally {
            set({ loading: false });
        }
    }
}))
