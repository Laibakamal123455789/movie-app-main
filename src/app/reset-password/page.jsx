"use client";
import { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "./resetPassword.css";

export default function ResetPassword() {
  const emailRef = useRef();
  const otpRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const sendOtp = async () => {
    const email = emailRef.current.value;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");

    try {
      const resp = await axios.post("/api/auth/generate-otp", { action: "generate-otp", email });
      if (resp.data.success) {
        setSuccess("OTP sent to your email.");
        setStep(2);
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  const verifyOtp = async () => {
    const email = emailRef.current.value;
    const otp = otpRef.current ? otpRef.current.value : ""; // Ensure otpRef.current exists

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    setError("");

    try {
      const resp = await axios.post("/api/auth/verify-otp", { action: "verify-otp", email, otp });
      if (resp.data.success) {
        setSuccess("OTP verified. You can now reset your password.");
        setStep(3);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  const resetPassword = async () => {
    const email = emailRef.current.value;
    const newPassword = newPasswordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");

    try {
      const resp = await axios.post("/api/auth/reset-password", {
        action: "reset-password",
        email,
        newPassword,
      });

      if (resp.data.success) {
        setSuccess("Password reset successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="reset-password-container">
      <form className="reset-password-form" onSubmit={(e) => e.preventDefault()}>
        <h2 className="form-title">Reset Password</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div style={{ display: step === 1 ? "block" : "none" }}>
          <input type="email" placeholder="Email" ref={emailRef} className="input-field" />
          <button className="submit-button" onClick={sendOtp}>
            Send OTP
          </button>
        </div>

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              ref={otpRef} // Assigning the ref here
              className="input-field"
            />
            <button className="submit-button" onClick={verifyOtp}>
              Verify OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              ref={newPasswordRef}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              ref={confirmPasswordRef}
              className="input-field"
            />
            <button className="submit-button" onClick={resetPassword}>
              Reset Password
            </button>
          </>
        )}
      </form>
    </div>
  );
}
