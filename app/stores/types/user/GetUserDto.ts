export type UserRole = "ROLE_ADMIN" | "ROLE_USER";
export type UserStatus =
  | "BLOCKED_BY_ADMIN"
  | "CREATED"
  | "EMAIL_VALIDATED"
  | "VALIDATED_BY_ADMIN";

export interface GetUserResponseDto {
  pseudo: string;
  name: string;
  lastName: string;
  email: string;
  isEmailValidated: boolean;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
  mediaCount: number;
}
