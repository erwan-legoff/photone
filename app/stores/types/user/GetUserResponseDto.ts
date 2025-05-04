export type UserRole = "ROLE_ADMIN" | "ROLE_USER";
export type UserStatus =
  | "BLOCKED_BY_ADMIN"
  | "CREATED"
  | "EMAIL_VALIDATED"
  | "VALIDATED_BY_ADMIN";

export interface GetUserResponseDto {
  id: number;
  pseudo: string;
  name: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
  mediaCount: number;
}
