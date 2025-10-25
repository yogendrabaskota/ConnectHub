import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { UserDataTypes } from "./types";
import { registerUser, resetStatus } from "../../store/auth.slice";
import { Status } from "../../global/types/types";
import Form from "./components/Form";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth);

  const handleRegister = async (data: UserDataTypes) => {
    dispatch(registerUser(data));
  };

  useEffect(() => {
    if (status === Status.SUCCESS) {
      dispatch(resetStatus());
      navigate("/login");
    }
  }, [status, dispatch, navigate]);

  return <Form type="register" onSubmit={handleRegister} />;
};

export default Register;
