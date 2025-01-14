"use client";
import { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addUser } from "@/store/slice/user";
import { merastore } from "@/store/store";
import { Provider } from "react-redux";
import "./login.css";
import axiosInstance from "@/utils/axiosInstance";

export default function Page() {
  return (
    <Provider store={merastore}>
      <Login />
    </Provider>
  );
}

function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");

  const validateInputs = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    setError("");
    return true;
  };

  const login = async () => {
    if (!validateInputs()) return;
  
    try {
      const response = await axiosInstance.post("/auth/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
  
      if (response.data.success) {

        localStorage.setItem("token", response.data.token);
        dispatch(addUser(response.data.user));
        router.push("/");

      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };
  
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={(e) => e.preventDefault()}>
        <h2 className="form-title">Login</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          ref={emailRef}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          ref={passwordRef}
          className="input-field"
        />
        <button className="submit-button" onClick={login}>
          Login
        </button>
        <p>
          <a
            href="#"
            onClick={() => router.push("/reset-password")}
            className="forgot-password"
          >
            Forgot Password?
          </a>
        </p>
        <p>  
          Don't have an account?{" "}
          <a
            href="#"
            onClick={() => router.push("/signup")}
            className="register-link"
          >
            Create account
          </a>
        </p>
      </form>
    </div>
  );
}
