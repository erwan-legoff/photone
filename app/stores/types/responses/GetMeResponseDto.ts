export interface GetMeResponseDto {
  id: number
  pseudo: string
  name: string
  lastName: string
  email: string
  salt: string // Base64-encoded
}
