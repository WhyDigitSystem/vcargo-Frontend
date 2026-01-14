import Lottie from "lottie-react";
import {
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Shield,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../api/authAPI";
import truckAnimation from "../../assets/lottieflow-ecommerce.json";
import {
  loginStart,
  loginSuccess,
  stopLoading,
} from "../../store/slices/authSlice";
import { encryptPassword } from "../../utils/PasswordEnc";
import ForgotPassword from "./ForgotPassword";

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationStep, setVerificationStep] = useState("form"); // 'form', 'verify', 'success'
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    type: "Transporter",
    industry: "",
    branch: "",
    branchCode: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errorMessage) setErrorMessage("");
  };

  // Handle Signup - Only show OTP verification
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    dispatch(loginStart());

    try {
      const payload = {
        active: true,
        branch: formData.branch || "",
        branchCode: formData.branchCode || "",
        createdby: formData.name,
        email: formData.email,
        id: 0,
        mobileNo: formData.phone,
        orgId: 0,
        organizationName: formData.industry,
        password: encryptPassword(formData.password),
        status: "APPROVED",
        type: formData.type,
        userName: formData.email,
      };

      console.log("Sending signup payload:", payload);

      // Call signup API - this should trigger email OTP
      const response = await authAPI.signup(payload);
      console.log("Signup API success:", response);

      // IMPORTANT: Use stopLoading instead of loginSuccess to avoid auto-login
      dispatch(stopLoading());

      // Move to verification step
      setVerificationStep("verify");
    } catch (error) {
      console.error("Signup API error:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Signup failed. Please try again.";
      setErrorMessage(errorMsg);
      dispatch(stopLoading());
    }
  };

  // Handle OTP Verification - Only verify, DO NOT login
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP");
      return;
    }

    setErrorMessage("");
    dispatch(loginStart());

    try {
      const verifyPayload = {
        email: formData.email,
        otp: verificationCode,
      };

      console.log("Verifying OTP with payload:", verifyPayload);

      const verifyResponse = await authAPI.verifyOtp(verifyPayload);
      console.log("OTP verification success:", verifyResponse);

      // ----------------- CORRECT SUCCESS CHECK -----------------
      const isVerified =
        verifyResponse?.statusFlag === "Ok" &&
        verifyResponse?.paramObjectsMap?.verified === true;

      if (isVerified) {
        dispatch(stopLoading());
        setVerificationStep("success");

        // Switch to login after delay
        setTimeout(() => {
          setVerificationStep("form");
          setVerificationCode("");
          setIsSignup(false);

          setFormData((prev) => ({
            name: "",
            email: prev.email,
            phone: "",
            password: "",
            type: "Transporter",
            industry: "",
            branch: "",
            branchCode: "",
          }));

          setErrorMessage("");
        }, 2000);
      } else {
        throw new Error(
          verifyResponse?.paramObjectsMap?.message || "OTP verification failed"
        );
      }
    } catch (error) {
      console.error("OTP verification error:", error);

      const errorMsg =
        error?.response?.paramObjectsMap?.message ||
        error?.message ||
        "Invalid OTP. Please try again.";

      setErrorMessage(errorMsg);
      dispatch(stopLoading());
    }
  };

  // Handle Login - ONLY here we authenticate and navigate
  // make sure at top of component:
  // import { useNavigate } from 'react-router-dom';
  // const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    dispatch(loginStart());

    try {
      const loginPayload = {
        userName: formData.email,
        password: encryptPassword(formData.password),
      };

      const response = await authAPI.login(loginPayload);
      console.log("Raw login response:", response);

      // Normalize response: handle axios-style (response.data) or direct API object
      const responseData = response?.data ?? response;
      console.log("Normalized responseData:", responseData);

      const statusFlag = responseData?.status;
      // If your API uses boolean status (true/false) this will work.
      // If it uses numeric HTTP status code, adapt below.

      // ----------- CHECK IF LOGIN SUCCESS OR FAILURE -----------
      // Consider treating numeric HTTP status codes (200) as success too:
      const isHttpSuccess =
        typeof response?.status === "number" &&
        response?.status >= 200 &&
        response?.status < 300;
      const isApiSuccess =
        statusFlag === true || statusFlag === "true" || isHttpSuccess;

      if (!isApiSuccess) {
        const errorMsg =
          responseData?.paramObjectsMap?.errorMessage ||
          responseData?.paramObjectsMap?.message ||
          responseData?.message ||
          "Login failed. Please try again.";

        setErrorMessage(errorMsg);
        dispatch(stopLoading());
        return; // STOP execution → do not navigate
      }

      // ----------- ONLY ON SUCCESS -----------
      const userVO =
        responseData?.paramObjectsMap?.userVO ?? responseData?.userVO ?? {};
      console.log("userVO:", userVO);

      // dispatch user to redux store — keep payload compact and safe
      dispatch(
        loginSuccess({
          name: userVO?.userName || formData.name || "",
          email: formData.email,
          organizationName: userVO.organizationName || "",
          usersId: userVO.usersId || "",
          token: userVO?.token,
          type: userVO?.type,
          orgId: userVO?.orgId,
          // avoid ...response.data unless you know shape — add only needed fields
        })
      );

      // ensure loading stops before navigation (optional, but cleaner)
      dispatch(stopLoading());

      // Defensive navigation: trim and compare case-insensitive
      const userType = (userVO?.type || "").toString().trim().toLowerCase();
      console.log("Resolved userType:", userType);

      if (userType === "Industry") {
        navigate("/");
      } else if (userType === "Transporter") {
        navigate("/transporter");
      } else {
        // fallback route if type unknown
        console.warn("Unknown user type, navigating to default dashboard");
        navigate("/"); // or navigate('/default')
      }
    } catch (error) {
      console.error("Login API error:", error);

      const errData = error?.response?.data ?? error?.response ?? error;
      const errorMsg =
        errData?.paramObjectsMap?.errorMessage ||
        errData?.paramObjectsMap?.message ||
        errData?.message ||
        error?.message ||
        "Login failed. Please check your credentials.";

      setErrorMessage(errorMsg);
      dispatch(stopLoading());
    }
  };

  const resendVerificationCode = async () => {
    try {
      setErrorMessage("");
      dispatch(loginStart());

      const resendPayload = {
        email: formData.email,
      };

      console.log("Resending OTP to:", formData.email);

      await authAPI.resendOtp(resendPayload);
      alert("New OTP sent to your email!");
      dispatch(stopLoading());
    } catch (error) {
      console.error("Resend OTP error:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to resend OTP. Please try again.";
      setErrorMessage(errorMsg);
      dispatch(stopLoading());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      if (verificationStep === "form") {
        handleSignupSubmit(e);
      } else if (verificationStep === "verify") {
        handleVerificationSubmit(e);
      }
    } else {
      handleLoginSubmit(e);
    }
  };

  const goBackToForm = () => {
    setVerificationStep("form");
    setVerificationCode("");
    setErrorMessage("");
  };

  // Reset form when switching between login/signup
  const handleAuthToggle = (isSignupMode) => {
    setIsSignup(isSignupMode);
    setVerificationStep("form");
    setVerificationCode("");
    setErrorMessage("");

    if (!isSignupMode) {
      // When switching to login, keep email but clear other fields
      setFormData((prev) => ({
        name: "",
        email: prev.email, // Keep email for convenience
        phone: "",
        password: "",
        type: "Transporter",
        industry: "",
        branch: "",
        branchCode: "",
      }));
    } else {
      // When switching to signup, clear everything
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        type: "Transporter",
        industry: "",
        branch: "",
        branchCode: "",
      });
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackFromForgotPassword = () => {
    setShowForgotPassword(false);
  };

  // Add this at the beginning of your AuthForm component
  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={handleBackFromForgotPassword} />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Form Section */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 lg:px-20 bg-white dark:bg-gray-900">
        <div className="mx-auto w-full max-w-md">
          {/* Back button for verification steps */}
          {(verificationStep === "verify" ||
            verificationStep === "success") && (
            <button
              onClick={goBackToForm}
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-6 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to form
            </button>
          )}

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Vcargo
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Smart Fleet Management Platform.
                </p>
              </div>
            </div>

            {/* Dynamic Headings */}
            {verificationStep === "verify" ? (
              <>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Verify Your Email
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter the 6-digit OTP sent to {formData.email}
                </p>
              </>
            ) : verificationStep === "success" ? (
              <>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Account Created Successfully!
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Redirecting to login...
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {isSignup ? "Create an Account" : "Welcome Back"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isSignup
                    ? "Get started with your logistics journey"
                    : "Sign in to your account"}
                </p>
              </>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          {/* Auth Toggle - Only show when not in verification steps */}
          {verificationStep === "form" && (
            <div className="flex justify-center mb-6">
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => handleAuthToggle(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    !isSignup
                      ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => handleAuthToggle(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    isSignup
                      ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}

          {/* Form Content based on verification step */}
          {verificationStep === "verify" ? (
            // Verification Code Form
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We sent a verification OTP to your email address
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      );
                      if (errorMessage) setErrorMessage("");
                    }}
                    required
                    maxLength={6}
                    className="w-full text-center text-2xl font-mono tracking-widest px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={resendVerificationCode}
                  disabled={loading}
                  className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Didn't receive OTP? Resend"}
                </button>
              </div>

              <button
                type="submit"
                disabled={verificationCode.length !== 6 || loading}
                className="w-full flex justify-center items-center py-4 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          ) : verificationStep === "success" ? (
            // Success State
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Verification Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your account has been created. Please login.
                </p>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full animate-pulse"></div>
              </div>
            </div>
          ) : (
            // Main Auth Form
            <form className="space-y-5" onSubmit={handleSubmit}>
              {isSignup && (
                <>
                  {/* Name */}
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>
                </>
              )}

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {isSignup && (
                <>
                  {/* Type */}
                  {/* <div className="relative">
                    <Building2 className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Type</option>
                      <option value="Transporter">Transporter</option>
                      <option value="Industry">Industry</option>
                    </select>
                  </div> */}

                  {/* Industry / Transport Name */}
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="industry"
                      placeholder="Transport Name"
                      value={formData.industry}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>
                </>
              )}

              {!isSignup && verificationStep === "form" && (
                <div className="text-right mb-3">
                  <button
                    onClick={handleForgotPassword}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Please wait..."
                  : isSignup
                  ? "Create Account"
                  : "Sign In"}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-center gap-2 text-xs mt-4">
              <Shield className="h-4 w-4" />
              <span>Your data is securely encrypted</span>
            </div>
            <p className="mt-3 text-xs">
              © 2025 Why Digit System Private Limited · Made with ❤️ in India
            </p>
          </div>
        </div>
      </div>

      {/* Right: Animation Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-b from-slate-900 via-blue-900/80 to-slate-900">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-xs">
            {/* Vertical logo section */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 mb-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl backdrop-blur-sm border border-white/10 p-3">
                <Lottie
                  animationData={truckAnimation}
                  loop={true}
                  autoplay={true}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-1">Vcargo</h3>
                <p className="text-xs text-blue-200/70 tracking-wide">
                  Smart Fleet Management Platform.
                </p>
                <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mt-2 rounded-full" />
                <p className="text-[11px] text-blue-300/70 mt-2 tracking-wide">
                  Control • Visibility • Efficiency
                </p>
              </div>
            </div>

            {/* Vertical feature list */}
            <div className="space-y-3">
              {/* Feature 1 */}
              <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors group">
                <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">
                    Real-Time Fleet Tracking
                  </h4>
                  <p className="text-blue-100/60 text-xs">
                    Live GPS tracking with vehicle status, speed & location
                    updates
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors group">
                <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">
                    Smart Route Optimization
                  </h4>
                  <p className="text-blue-100/60 text-xs">
                    Reduce fuel costs and delays with intelligent route planning
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors group">
                <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a5 5 0 00-10 0v2a3 3 0 00-3 3v5a3 3 0 003 3h10a3 3 0 003-3v-5a3 3 0 00-3-3z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">
                    Driver & Trip Management
                  </h4>
                  <p className="text-blue-100/60 text-xs">
                    Monitor trips, driver performance & operational efficiency
                  </p>
                </div>
              </div>
            </div>

            {/* Compact footer */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-xs text-blue-200/50">
                  Powering{" "}
                  <span className="text-cyan-400 font-semibold">1,000+</span>{" "}
                  vehicles across India & global operations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
