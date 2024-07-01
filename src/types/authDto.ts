export type SignInDTO = {
  email: string;
  password: string;
};

export type SignUpDTO = {
  firstName: string;
  lastName?: string;
  username: string;
} & SignInDTO;
