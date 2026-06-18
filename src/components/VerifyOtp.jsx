import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const phone = location.state?.phone;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) return alert("Enter OTP");

    try {
      setLoading(true);

      const { data } = await API.post("/auth/verify-reset-otp", {
        phone,
        otp,
      });

      if (!data?.resetToken) {
        throw new Error("Reset token missing");
      }

      navigate("/reset-password", {
        state: { resetToken: data.resetToken },
      });

    } catch (error) {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-5">
            <div className="card p-4 shadow border-0">

              <h4 className="fw-bold text-center mb-3">Verify OTP</h4>

              <p className="text-muted text-center">
                OTP sent to {phone}
              </p>

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  required
                />

                <button
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;