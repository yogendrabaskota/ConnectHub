import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const APIAuth = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    Authorization: `${localStorage.getItem("token")}`,
    "content-type": "application/json",
    Accept: "application/json",
  },
});

export { API, APIAuth };
