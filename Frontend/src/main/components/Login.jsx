// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import logo from "../../Assests/logo.png";

// const Login = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [timer, setTimer] = useState(0);
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");

//   const [gender, setGender] = useState("");
//   const [image, setImage] = useState(null);

//   const [emailLocked, setEmailLocked] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   /* ================= TIMER ================= */
//   useEffect(() => {
//     let interval;
//     if (timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [timer]);

//   /* ================= SEND OTP ================= */
//   const handleSendOtp = async () => {
//     if (!email) {
//       setError("Please enter email");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const res = await axios.post("/api/auth/send-otp", { email });

//       if (res.data.success) {
//         setOtpSent(true);
//         setEmailLocked(true);
//         setTimer(60);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to send OTP");
//     }

//     setLoading(false);
//   };

//   /* ================= VERIFY OTP ================= */
//   const handleVerifyOtp = async () => {
//     if (!otp) {
//       setError("Please enter OTP");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const res = await axios.post("/api/auth/verify-otp/user", {
//         email,
//         otp,
//       });

//       if (res.data.role === "guest") {
//         setIsLogin(false);
//         setOtpSent(false);
//         setOtp("");
//         setEmailLocked(true);
//         setError("No account found. Please complete registration.");
//         setLoading(false);
//         return;
//       }

//       localStorage.setItem("user", JSON.stringify(res.data.data));
//       localStorage.setItem("token", res.data.token);

//       navigate("/");
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid OTP");
//     }

//     setLoading(false);
//   };

//   /* ================= SIGNUP ================= */
//   const handleSignup = async (e) => {
//     e.preventDefault();

//     if (!gender) {
//       setError("Please select gender");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const formData = new FormData();
//       formData.append("fullName", name);
//       formData.append("email", email);
//       formData.append("phone", phone);
//       formData.append("gender", gender);

//       if (image) {
//         formData.append("profileImage", image);
//       }

//       const res = await axios.post("/api/users/signup", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       localStorage.setItem("token", res.data.token);

//       navigate("/");
//     } catch (err) {
//       setError(err.response?.data?.message || "Signup failed");
//     }

//     setLoading(false);
//   };

//   const resetState = () => {
//     setOtp("");
//     setOtpSent(false);
//     setError("");
//     setEmailLocked(false);
//     setTimer(0);
//   };

//   return (

//     <div
//       className="relative flex min-h-screen items-center justify-center px-4 py-8"
//       style={{
//         background:
//           "radial-gradient(circle at top left, rgba(191, 219, 254, 0.9), transparent 55%), radial-gradient(circle at bottom right, rgba(224, 242, 254, 0.9), transparent 55%), #f3f4f6",
//       }}
//     >
//       {/* Background blobs */}
//       <div className="pointer-events-none absolute inset-0 opacity-70">
//         <div
//           className="absolute -top-24 -left-24 h-72 w-72 rounded-md blur-3xl"
//           style={{ background: "rgba(59,130,246,0.45)" }}
//         />
//         <div
//           className="absolute bottom-0 right-0 h-80 w-80 rounded-md blur-3xl"
//           style={{ background: "rgba(56,189,248,0.45)" }}
//         />
//       </div>

//       {/* Card */}
//       <div
//         className={`relative z-10 w-full ${!isLogin ? "max-w-xl" : "max-w-md"} rounded-3xl p-6 shadow-2xl md:p-8`}
//         style={{
//           background:
//             "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,23,42,0.95))",
//           border: "1px solid rgba(148,163,184,0.6)",
//           backdropFilter: "blur(22px)",
//         }}
//       >
//         {/* Logo */}
//         <div
//           className="mb-3 flex cursor-pointer justify-center"
//           onClick={() => navigate("/")}
//         >
//           <div
//             onClick={() => navigate("/")}
//             className="group relative flex cursor-pointer items-center gap-2"
//           >
//             {/* Outer glow ring */}
//             <div
//               className="relative flex h-35 w-59 items-center justify-center rounded-xl transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] group-hover:-translate-y-[1px]"
//               style={{
//                 background:
//                   "radial-gradient(circle at 30% 30%, rgba(59,130,246,0.4), rgba(15,23,42,1))",
//                 border: "1px solid rgba(148,163,184,0.7)",
//               }}
//             >
//               {/* Inner white-ish tile */}
//               <div className="flex h-29 w-52 items-center justify-center rounded-lg bg-white shadow-sm transition-transform duration-300 group-hover:scale-105">
//                 <img
//                   src={logo}
//                   alt="Logo"
//                   className="h-30 w-47 object-contain transition-transform duration-300 group-hover:rotate-3"
//                 />
//               </div>

//               {/* Small corner shine */}
//               <span
//                 className="pointer-events-none absolute -top-1 -right-1 h-4 w-4 rounded-md opacity-70 blur-[2px] transition-opacity duration-300 group-hover:opacity-100"
//                 style={{
//                   background:
//                     "radial-gradient(circle, rgba(248,250,252,0.9), rgba(59,130,246,0))",
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="mb-6 flex rounded-md bg-slate-900/60 p-1 text-sm">
//           <button
//             type="button"
//             onClick={() => {
//               setIsLogin(true);
//               resetState();
//             }}
//             className={`flex-1 rounded-md px-3 py-2 font-medium transition-all ${
//               isLogin ? "bg-sky-500 text-white" : "text-slate-300"
//             }`}
//           >
//             Login with OTP
//           </button>
//           <button
//             type="button"
//             onClick={() => {
//               setIsLogin(false);
//               resetState();
//             }}
//             className={`flex-1 rounded-md px-3 py-2 font-medium transition-all ${
//               !isLogin ? "bg-sky-500 text-white" : "text-slate-300"
//             }`}
//           >
//             Create account
//           </button>
//         </div>

//         {/* Title */}
//         <h2
//           className="mb-2 text-center text-xl font-semibold md:text-2xl"
//           style={{ color: "var(--surface)" }}
//         >
//           {isLogin ? "Welcome back" : "Join GuptaJi Men’s Wear"}
//         </h2>
//         <p
//           className="mb-6 text-center text-sm md:text-sm"
//           style={{ color: "rgba(203,213,225,0.85)" }}
//         >
//           {isLogin
//             ? "Login securely using OTP sent to your email."
//             : "Create your account to track orders and save your details."}
//         </p>

//         {/* Error */}
//         {error && (
//           <div className="mb-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
//             {error}
//           </div>
//         )}

//         {/* LOGIN WITH OTP */}
//         {isLogin ? (
//           <div className="space-y-4">
//             <div>
//               <label className="mb-1 block text-sm text-slate-200">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 disabled={emailLocked}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="you@example.com"
//                 className="w-full rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none"
//                 style={{
//                   background: "rgba(15,23,42,0.85)",
//                   border: "1px solid rgba(148,163,184,0.7)",
//                 }}
//               />
//             </div>

//             {otpSent && (
//               <div>
//                 <label className="mb-1 block text-sm text-slate-200">
//                   Enter OTP
//                 </label>
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     maxLength={6}
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//                     placeholder="6 digit code"
//                     className="w-full rounded-xl px-4 py-2.5 text-sm text-slate-100 tracking-[0.3em] text-center outline-none"
//                     style={{
//                       background: "rgba(15,23,42,0.85)",
//                       border: "1px solid rgba(148,163,184,0.7)",
//                     }}
//                   />
//                 </div>
//                 <p className="mt-1 text-[11px] text-slate-400">
//                   Check your email inbox and spam folder.
//                 </p>
//               </div>
//             )}

//             {!otpSent ? (
//               <button
//                 type="button"
//                 onClick={handleSendOtp}
//                 disabled={loading}
//                 className="mt-1 w-full rounded-xl py-2.5 text-sm font-semibold transition-all"
//                 style={{
//                   background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
//                   color: "white",
//                   boxShadow: "0 10px 25px rgba(37,99,235,0.55)",
//                 }}
//               >
//                 {loading ? "Sending OTP..." : "Send OTP"}
//               </button>
//             ) : (
//               <>
//                 <button
//                   type="button"
//                   onClick={handleVerifyOtp}
//                   disabled={loading}
//                   className="mt-1 w-full rounded-xl py-2.5 text-sm font-semibold transition-all"
//                   style={{
//                     background: "linear-gradient(135deg, #22c55e, #16a34a)",
//                     color: "white",
//                     boxShadow: "0 10px 25px rgba(34,197,94,0.55)",
//                   }}
//                 >
//                   {loading ? "Verifying..." : "Verify & Continue"}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={handleSendOtp}
//                   disabled={timer > 0}
//                   className="mt-2 w-full rounded-xl border py-2.5 text-sm font-semibold transition-all"
//                   style={{
//                     background: "transparent",
//                     borderColor:
//                       timer > 0 ? "rgba(148,163,184,0.5)" : "#0ea5e9",
//                     color: timer > 0 ? "rgba(148,163,184,0.7)" : "#0ea5e9",
//                   }}
//                 >
//                   {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
//                 </button>
//               </>
//             )}
//           </div>
//         ) : (
//           /* SIGNUP FORM */
//           <form onSubmit={handleSignup} className="space-y-3">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
//               <div>
//                 <label className="mb-1 block text-sm text-slate-200">
//                   Full name
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Your name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                   className="w-full rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none"
//                   style={{
//                     background: "rgba(15,23,42,0.85)",
//                     border: "1px solid rgba(148,163,184,0.7)",
//                   }}
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm text-slate-200">
//                   Phone
//                 </label>
//                 <input
//                   type="tel"
//                   maxLength={10}
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
//                   placeholder="10 digit number"
//                   required
//                   className="w-full rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none"
//                   style={{
//                     background: "rgba(15,23,42,0.85)",
//                     border: "1px solid rgba(148,163,184,0.7)",
//                   }}
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="mb-1 block text-sm text-slate-200">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 disabled={emailLocked}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 placeholder="you@example.com"
//                 className="w-full rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none"
//                 style={{
//                   background: "rgba(15,23,42,0.85)",
//                   border: "1px solid rgba(148,163,184,0.7)",
//                 }}
//               />
//             </div>

//             <div>
//               <label className="mb-1 block text-sm text-slate-200">
//                 Gender
//               </label>
//               <select
//                 value={gender}
//                 onChange={(e) => setGender(e.target.value)}
//                 required
//                 className="w-full rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none"
//                 style={{
//                   background: "rgba(15,23,42,0.85)",
//                   border: "1px solid rgba(148,163,184,0.7)",
//                 }}
//               >
//                 <option value="">Select gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             <div>
//               <label className="mb-1 block text-sm text-slate-200">
//                 Profile photo (optional)
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setImage(e.target.files[0])}
//                 className="w-full rounded-xl border px-3 py-2 text-sm text-slate-200 outline-none"
//                 style={{
//                   background: "rgba(15,23,42,0.85)",
//                   borderColor: "rgba(148,163,184,0.7)",
//                 }}
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="mt-1 w-full rounded-xl py-2.5 text-sm font-semibold transition-all"
//               style={{
//                 background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
//                 color: "white",
//                 boxShadow: "0 10px 25px rgba(37,99,235,0.55)",
//               }}
//             >
//               {loading ? "Creating account..." : "Sign Up & Continue"}
//             </button>
//           </form>
//         )}

//         {/* Toggle link */}
//         <p className="mt-5 text-center text-sm text-slate-400">
//           {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
//           <button
//             type="button"
//             onClick={() => {
//               setIsLogin(!isLogin);
//               resetState();
//             }}
//             className="font-medium text-sky-400 underline-offset-2 hover:underline"
//           >
//             {isLogin ? "Sign up" : "Login"}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";import api from '@/utils/api';
import logo from "../../Assests/logo.png";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [timer, setTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [gender, setGender] = useState("");
  const [image, setImage] = useState(null);

  const [emailLocked, setEmailLocked] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* ================= TIMER ================= */
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  /* ================= SEND OTP ================= */
  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/auth/send-otp", { email });

      if (res.data.success) {
        setOtpSent(true);
        setEmailLocked(true);
        setTimer(60);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }

    setLoading(false);
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/auth/verify-otp/user", {
        email,
        otp,
      });

      if (res.data.role === "guest") {
        setIsLogin(false);
        setOtpSent(false);
        setOtp("");
        setEmailLocked(true);
        setError("No account found. Please complete registration.");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(res.data.data));
      localStorage.setItem("token", res.data.token);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }

    setLoading(false);
  };

  /* ================= SIGNUP ================= */
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!gender) {
      setError("Please select gender");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("fullName", name);
      formData.append("email", email);
      formData.append("phone", phone);
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
    setOtp("");
    setOtpSent(false);
    setError("");
    setEmailLocked(false);
    setTimer(0);
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(191,219,254,0.9), transparent 55%), radial-gradient(circle at bottom right, rgba(224,242,254,0.9), transparent 55%), #f3f4f6",
      }}
    >
      {/* Background blobs (light) */}
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

      {/* Card */}
      <div
        className={`relative z-10 w-full ${
          !isLogin ? "max-w-xl" : "max-w-md"
        } rounded-3xl bg-white/95 p-6 shadow-2xl md:p-8`}
        style={{
          border: "1px solid #e5e7eb",
          backdropFilter: "blur(14px)",
        }}
      >
        {/* Logo */}
        <div
          className="mb-4 flex cursor-pointer justify-center"
          onClick={() => navigate("/")}
        >
          <div className="group relative flex items-center gap-2">
            <div className="relative flex h-16 w-56 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition group-hover:shadow-md">
              <img
                src={logo}
                alt="Logo"
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 group-hover:translate-y-[-1px]"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
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
            Login with OTP
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

        {/* Title */}
        <h2 className="mb-1 text-center text-xl font-semibold text-slate-900 md:text-2xl">
          {isLogin ? "Welcome back" : "Join GuptaJi Men’s Wear"}
        </h2>
        <p className="mb-6 text-center text-xs text-slate-500 md:text-sm">
          {isLogin
            ? "Login securely using OTP sent to your email."
            : "Create your account to track orders and save your details."}
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-600 md:text-sm">
            {error}
          </div>
        )}

        {/* LOGIN WITH OTP */}
        {isLogin ? (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled={emailLocked}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-[#d8ddf0] bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
              />
            </div>

            {otpSent && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Enter OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="6 digit code"
                  className="w-full rounded-2xl border border-[#d8ddf0] bg-white px-4 py-2.5 text-center text-sm tracking-[0.3em] text-slate-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Check your email inbox and spam folder.
                </p>
              </div>
            )}

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="mt-1 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="mt-1 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Verifying..." : "Verify & Continue"}
                </button>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={timer > 0}
                  className="mt-2 w-full rounded-2xl border border-sky-400 bg-white py-2.5 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 disabled:border-slate-300 disabled:text-slate-400 disabled:hover:bg-white"
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                </button>
              </>
            )}
          </div>
        ) : (
          /* SIGNUP FORM */
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
                disabled={emailLocked}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-[#d8ddf0] bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
              />
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
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
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
              className="mt-1 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Sign Up & Continue"}
            </button>
          </form>
        )}

        {/* Toggle link */}
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
