import { Form } from "./form.types";

export interface Creator {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  photo: string | null;
  googleId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  creator: Creator;
  forms: Form[];
}

export interface CreateFolderRequest {
  name: string;
  description?: string;
  creatorId: string;
}

export interface UpdateFolderRequest {
  name?: string;
  description?: string;
}

export type FolderResponse = Folder;

export type FoldersResponse = Folder[];

export interface DeleteFolderResponse {
  success: boolean;
  message: string;
}
