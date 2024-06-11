export type SignInDTO = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignUpDTO = {
  firstName: string;
  lastName?: string;
  username: string;
} & SignInDTO;
