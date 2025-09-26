import { create } from 'zustand'

interface BreadcrumbItem {
    name: string;
    href: string;
}

interface BreadcrumbState {
    breadcrumbItems: BreadcrumbItem[];
    customBreadcrumbItems: BreadcrumbItem[] | null;
    isCustomOverride: boolean;
    setBreadcrumbItems: (items: BreadcrumbItem[]) => void;
    setCustomBreadcrumbItems: (items: BreadcrumbItem[] | null) => void;
    addBreadcrumbItem: (item: BreadcrumbItem) => void;
    clearBreadcrumbItems: () => void;
    clearCustomBreadcrumbItems: () => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
    breadcrumbItems: [],
    customBreadcrumbItems: null,
    isCustomOverride: false,
    setBreadcrumbItems: (items) => set({ 
        breadcrumbItems: items,
        isCustomOverride: false 
    }),
    setCustomBreadcrumbItems: (items) => set({ 
        customBreadcrumbItems: items,
        isCustomOverride: items !== null 
    }),
    addBreadcrumbItem: (item) => set((state) => ({
        breadcrumbItems: [...state.breadcrumbItems, item],
    })),
    clearBreadcrumbItems: () => set({ 
        breadcrumbItems: [],
        isCustomOverride: false 
    }),
    clearCustomBreadcrumbItems: () => set({ 
        customBreadcrumbItems: null,
        isCustomOverride: false 
    }),
}));