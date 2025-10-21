import { createOrUpdate, getAll, getByCode, getById, remove } from '@/lib/actions/discount'
import { create } from 'zustand'
import { toast } from "react-toastify";
import { getByDiscount, getByUserAndDiscount } from '@/lib/actions/discount_usage';
import { flattenIdProperties } from '@/lib/utils';

interface IDiscountStore {
    loading: boolean
    default: IDiscount
    model: IDiscount
    list: IDiscount[]
    setModel: (model?: any) => void
    getAll: () => void
    getById: (id: string) => void
    create: () => void
    remove: (id: string) => void
    applyVoucher: (code: string, userId: string, catalog: string) => Promise<IDiscount | null>
}

export const useDiscount = create<IDiscountStore>((set, get) => ({
    loading: false,
    default: {
        code: '',
        amount: 0,
        catalog: null,
        limit: 0,
        is_per_user: false,
    },
    model: {
        code: '',
        amount: 0,
        catalog: null,
        limit: 0,
        is_per_user: false,
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
            const data = await createOrUpdate(flattenIdProperties(get().model));
            get().getAll();
            get().setModel();


            toast.success(`Diskon berhasil ${data.id ? 'di update' : 'Dibuat'}`);
        } catch (error) {
            console.error(error);
            toast.error(`Gagal ${get().model.id ? 'mengupdate' : 'membuat'} Diskon`);
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
            toast.success('Diskon berhasil di hapus');
        } catch (error) {
            console.error(error);
            toast.error('Gagal menghapus Diskon');
        } finally {
            set({ loading: false });
        }
    },
    applyVoucher: async (code: string, userId: string, catalog: string) => {
        set({ loading: true });
        try {
            const discount = await getByCode(code);
            if (!discount) {
                toast.error("Voucher tidak ditemukan atau tidak valid");
                return null;
            }

            if (discount.catalog && discount.catalog.id !== catalog) {
                toast.error("Voucher tidak dapat digunakan untuk katalog ini");
                return null;
            }

            if (discount.is_per_user) {
                const usage = await getByUserAndDiscount(userId, discount.id);
                if (usage.length >= discount.limit) {
                    toast.error("Kamu sudah mencapai batas penggunaan voucher ini");
                    return null;
                }
            } else {
                const usage = await getByDiscount(discount.id);
                if (usage.length >= discount.limit) {
                    toast.error("Voucher sudah tidak tersedia");
                    return null;
                }
            }

            toast.success(`Voucher \"${discount.code}\" berhasil diterapkan`);
            return discount;
        } catch (error) {
            toast.error("Gagal menggunakan voucher");
            console.error(error);
            return null;
        } finally {
            set({ loading: false });
        }
    },
}))
