import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../global/types/types";
import { API, APIAuth } from "../global/http";

interface RegisterData {
  username: string;
  email: string;
  password: string;
}
interface LoginData {
  email: string;
  password: string;
}

interface User {
  username: string;
  email: string;
  password: string;
  token: string;
}

interface AuthState {
  user: User;
  status: Status;
}

const initialState: AuthState = {
  user: {} as User,
  status: Status.LOADING,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state: AuthState, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setStatus(state: AuthState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    resetStatus(state: AuthState) {
      state.status = Status.IDEL;
    },
  },
});

export const { setUser, setStatus, resetStatus } = authSlice.actions;
export default authSlice.reducer;

export function registerUser(data: RegisterData) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async function registerThunk(dispatch: any) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.post("/register", data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      console.log(error);
    }
  };
}

export function loginUser(data: LoginData) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async function loginUserThunk(dispatch: any) {
    try {
      const response = await APIAuth.post("/login", data);

      if (response.status === 200) {
        const { token } = response.data.token;
        localStorage.setItem("token", token);
        dispatch(setUser(response.data));
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      console.log(error);
    }
  };
}
