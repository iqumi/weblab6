export interface User {
  id: number
  email: string
  password: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegistrationData extends LoginCredentials {
  confirmPassword: string
}

export type AuthErrors = Partial<
  Record<keyof RegistrationData | 'form', string>
>
