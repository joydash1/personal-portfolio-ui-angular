export interface ContactCreateDto {
  firstName: string;
  lastName: string;
  email: string;
  text: string;
  file?: File;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: ValidationError[];
}

export interface ValidationError {
  propertyName: string;
  errorMessage: string;
}

export interface ContactError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}