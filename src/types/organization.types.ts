import type { Role, User } from "./user.types";

export interface Position {
  id: string;
  userId: string;
  title: string;
  superiorId: string | null;
  user: User;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
  subordinates: Position[];
}

export interface PositionFormData {
  userId: string;
  title: string;
  superiorId: string | null;
}

export interface PositionMutationParams {
  id?: string;
  formData: PositionFormData;
}
