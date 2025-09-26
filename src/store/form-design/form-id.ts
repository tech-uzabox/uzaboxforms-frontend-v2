import { create } from "zustand";

interface store {
    formIdString: any,
    setFormIdString: (data: any) => void
}

export const formIdStore = create<store>((set) => ({
    formIdString: null,
    setFormIdString: (data: any) => {
        set({ formIdString: data })
    }
}))