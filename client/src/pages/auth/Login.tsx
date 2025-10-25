import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { LoginUserTypes } from "./types";
import { loginUser, resetStatus } from "../../store/auth.slice";
import { Status } from "../../global/types/types";
import Form from "./components/Form";

const Login = () => {
  const navigate = useNavigate();
  const { status } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogin = async (data: LoginUserTypes) => {
    //console.log(data)
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (status === Status.SUCCESS) {
      dispatch(resetStatus());
      navigate("/");
    }
  }, [status, dispatch, navigate]);

  return <Form type="login" onSubmit={handleLogin} />;
};

export default Login;
