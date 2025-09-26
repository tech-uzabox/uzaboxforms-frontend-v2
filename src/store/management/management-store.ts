import { create } from "zustand";

interface store {
    allImages: any,
    setAllImages: (data: any) => void
}

export const managementImagesStore = create<store>((set) => ({
    allImages: null,
    setAllImages: (data: any) => {
        set({ allImages: data })
    }
}))