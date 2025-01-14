"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Provider, useDispatch } from "react-redux";
import { addUser } from "@/store/slice/user";
import "./signup.css";
import { merastore } from "@/store/store";

export default function Page() {
  return (
    <Provider store={merastore}>
      <Signup />
    </Provider>
  );
}

function Signup() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const saveUser = async (user) => {
    try {
      console.log("User data being sent to the server:", user);

      const response = await axios.post("/api/auth/signup", user);

      console.log("Response from the server:", response.data);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);

        dispatch(addUser(response.data.user));
        reset();
        router.push("/");
      } else {
        alert(response.data.message || "Error while registering. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Error while registering. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit(saveUser)} className="signup-form">
        <h2 className="form-title">Registration</h2>

        <input
          {...register("firstName", { required: "First name is required." })}
          placeholder="First Name"
          className="input-field"
        />
        {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}

        <input
          {...register("lastName", { required: "Last name is required." })}
          placeholder="Last Name"
          className="input-field"
        />
        {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}

        <input
          {...register("phone", {
            required: "Phone number is required.",
            pattern: { value: /^[0-9]{10,15}$/, message: "Invalid phone number." },
          })}
          placeholder="Phone Number"
          className="input-field"
        />
        {errors.phone && <p className="error-message">{errors.phone.message}</p>}

        <input
          {...register("city", { required: "City is required." })}
          placeholder="City"
          className="input-field"
        />
        {errors.city && <p className="error-message">{errors.city.message}</p>}

        {errors.maritalStatus && <p className="error-message">{errors.maritalStatus.message}</p>}

        <input
          {...register("email", {
            required: "Email is required.",
            pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email address." },
          })}
          placeholder="Email"
          className="input-field"
        />
        {errors.email && <p className="error-message">{errors.email.message}</p>}

        <input
          {...register("password", {
            required: "Password is required.",
            minLength: { value: 6, message: "Password must be at least 6 characters long." },
          })}
          placeholder="Password"
          type="password"
          className="input-field"
        />
        {errors.password && <p className="error-message">{errors.password.message}</p>}

        <button className="submit-button" >Register</button>
        <p>
          Already have an account?{" "}
          <a
            href="#"
            onClick={() => router.push("/login")}
            className="login-link"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
