export type UserStatus = "ENABLED" | "DISABLED";

export interface User {
  id: string;
  googleId?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  photo?: string;
  status: UserStatus;
  roles?: Role[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserRoleData {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Array<{ role: string; roleId: string; status: string }>;
  updatedAt?: string;
}

export interface UserDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  updatedAt?: string;
}

export interface GroupRole {
  groupId: string;
  roleId: string;
  status: UserStatus;
}

export interface GroupWithRoles {
  id: string;
  name: string;
  status: UserStatus;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  creator: User;
  roles: GroupRole[];
}

export interface CreateGroupData {
  name: string;
  status: UserStatus;
  creatorId: string;
  roles: string[];
}

export interface UpdateGroupData {
  name: string;
  status: UserStatus;
  createdBy: string;
  roles: string[];
}

export interface CreateUserData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface UpdateUserData {
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  roles: string[];
}
