import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import logo from "../../Assests/logo.png";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/users/login", { email, password });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !password || !confirmPassword || !gender) {
      setError("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("fullName", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("gender", gender);

      if (image) {
        formData.append("profileImage", image);
      }

      const res = await api.post("/api/users/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }

    setLoading(false);
  };

  const resetState = () => {
    setError("");
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setGender("");
    setImage(null);
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(191,219,254,0.9), transparent 55%), radial-gradient(circle at bottom right, rgba(224,242,254,0.9), transparent 55%), #f3f4f6",
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "rgba(191,219,254,0.8)" }}
        />
        <div
          className="absolute bottom-0 right-0 h-80 w-80 rounded-full blur-3xl"
          style={{ background: "rgba(224,242,254,0.9)" }}
        />
      </div>

      <div
        className={`relative z-10 w-full ${
          !isLogin ? "max-w-xl" : "max-w-md"
        } rounded-3xl bg-white/95 p-6 shadow-2xl md:p-8`}
        style={{
          border: "1px solid #e5e7eb",
          backdropFilter: "blur(14px)",
        }}
      >
        <div
          className="mb-4 flex cursor-pointer justify-center"
          onClick={() => navigate("/")}
        >
          <div className="group relative flex items-center gap-2">
            <div className="relative flex h-16 w-56 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition group-hover:shadow-md">
              <img
                src={logo}
                alt="Logo"
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-px"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 flex rounded-2xl bg-slate-100 p-1 text-xs md:text-sm">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              resetState();
            }}
            className={`flex-1 rounded-2xl px-3 py-2 font-medium transition-all ${
              isLogin ? "bg-sky-500 text-white shadow-sm" : "text-slate-600"
            }`}
          >
            Login with Password
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              resetState();
            }}
            className={`flex-1 rounded-2xl px-3 py-2 font-medium transition-all ${
              !isLogin ? "bg-sky-500 text-white shadow-sm" : "text-slate-600"
            }`}
          >
            Create account
          </button>
        </div>

        <h2 className="mb-1 text-center text-xl font-semibold text-slate-900 md:text-2xl">
          {isLogin ? "Welcome back" : "Join GuptaJi Men’s Wear"}
        </h2>
        <p className="mb-6 text-center text-xs text-slate-500 md:text-sm">
          {isLogin
            ? "Sign in with your email and password."
            : "Create your account to track orders and save your details."}
        </p>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-600 md:text-sm">
            {error}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-[#d8ddf0] bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-[#d8ddf0] bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-2xl bg-linear-to-r from-sky-500 to-blue-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-[#d8ddf0] bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Phone
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="10 digit number"
                  required
                  className="w-full rounded-2xl border border-[#d8ddf0] bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-[#d8ddf0] bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a password"
                  className="w-full rounded-2xl border border-[#d8ddf0] bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm password"
                  className="w-full rounded-2xl border border-[#d8ddf0] bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#d8ddf0] bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Profile photo (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full rounded-2xl border border-[#d8ddf0] bg-white px-3 py-2 text-xs text-slate-700 outline-none transition file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium hover:file:bg-slate-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-2xl bg-linear-to-r from-sky-500 to-blue-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Sign Up & Continue"}
            </button>
          </form>
        )}

        <p className="mt-5 text-center text-xs text-slate-500 md:text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              resetState();
            }}
            className="font-medium text-sky-600 underline-offset-2 hover:underline"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
