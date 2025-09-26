import { Form } from "@/types";
import { create } from "zustand";

interface FormStoreType {
    formList: Form[],
    setFormList: (data: Form[]) => void
}

export const formStore = create<FormStoreType>((set) => ({
    formList: [],
    setFormList: (data: Form[]) => {
        set({ formList: data })
    }
}))