export interface Props {
  type: string;
  onSubmit: (data: UserDataTypes) => void;
}

export interface UserDataTypes {
  email: string;
  name: string;
  password: string;
}

export interface LoginUserTypes {
  email: string;
  password: string;
}
