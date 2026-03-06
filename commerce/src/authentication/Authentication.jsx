import React, { useState, useEffect, useContext } from "react";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "../store/api/userApi";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Loader2,
  Sparkles,
  Fingerprint,
  Shield,
  Zap,
} from "lucide-react";
import AuthContext from "../common/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { login: setAuthTrue } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loginUser, { isLoading: isLoginLoading, isError: loginError }] =
    useLoginUserMutation();
  const [registerUser, { isLoading: isRegLoading, isError: regError }] =
    useRegisterUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        const response = await loginUser(formData).unwrap();
        console.log("response", response);
        if (response) {
          const authData = {
            user: response.user,
            token: response.token,
          };

          setAuthTrue(authData);

          toast.success("✨ Login successful!");

          navigate("/adminSelf", { replace: true });
        }
      } else {
        const response = await registerUser(formData).unwrap();

        if (response) {
          toast.success("🎉 Account created successfully! Please login.");

          setIsLogin(true);

          setFormData({
            name: "",
            email: formData.email,
            password: "",
          });
        }
      }
    } catch (err) {
      const msg =
        err?.data?.message ||
        err?.message ||
        (isLogin
          ? "Login failed. Please check credentials."
          : "Registration failed. Please try again.");

      setError(msg);
      toast.error(msg);
    }
  };

  const isLoading = isLoginLoading || isRegLoading;

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent dark:from-purple-900/30"></div>
      <div className="absolute inset-0 w-full h-full bg-[conic-gradient(from_180deg_at_50%_50%,_rgba(139,92,246,0.1)_0deg,_rgba(236,72,153,0.1)_180deg,_rgba(139,92,246,0.1)_360deg)] dark:bg-[conic-gradient(from_180deg_at_50%_50%,_rgba(139,92,246,0.15)_0deg,_rgba(236,72,153,0.15)_180deg,_rgba(139,92,246,0.15)_360deg)] animate-slow-spin"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-64 h-64 bg-purple-300/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-pink-300/30 dark:bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Bento Grid Card */}
      <div className="relative w-full max-w-md">
        {/* Decorative Elements */}
        <div className="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl rotate-12 shadow-2xl opacity-50 blur-sm"></div>
        <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-gradient-to-tr from-blue-400 to-indigo-400 rounded-2xl -rotate-12 shadow-2xl opacity-50 blur-sm"></div>

        {/* Main Card with Glassmorphism */}
        <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 p-8 transition-all duration-500 hover:shadow-purple-500/20">
          {/* Header with Bento Style */}
          <div className="text-center mb-8 relative">
            <div className="inline-flex p-3 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl rotate-3 mb-4 shadow-lg">
              {isLogin ? (
                <Fingerprint className="w-8 h-8 text-white" />
              ) : (
                <UserPlus className="w-8 h-8 text-white" />
              )}
            </div>

            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {isLogin ? "Welcome Back" : "Join Us"}
            </h2>

            {/* Animated Status Chip */}
            <div className="absolute top-0 right-0 flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-400/20 dark:to-pink-400/20 rounded-full border border-purple-200/50 dark:border-purple-700/50">
              <Zap size={14} className="text-purple-500 animate-pulse" />
              <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                {isLogin ? "Secure Login" : "Quick Register"}
              </span>
            </div>

            <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm">
              {isLogin
                ? "Sign in to access your dashboard"
                : "Create your account in seconds"}
            </p>
          </div>

          {/* Form with Enhanced Inputs */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field with Micro-interaction */}
            {!isLogin && (
              <div className="group relative transform transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors size-5" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-transparent focus:border-purple-500 dark:focus:border-purple-400 rounded-xl outline-none transition-all dark:text-white placeholder:text-gray-400"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="group relative transform transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors size-5" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-transparent focus:border-purple-500 dark:focus:border-purple-400 rounded-xl outline-none transition-all dark:text-white placeholder:text-gray-400"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group relative transform transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors size-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-4 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-transparent focus:border-purple-500 dark:focus:border-purple-400 rounded-xl outline-none transition-all dark:text-white placeholder:text-gray-400"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg">
              <Shield
                size={16}
                className="text-green-600 dark:text-green-400"
              />
              <span className="text-xs text-green-700 dark:text-green-300">
                Encrypted & Secure
              </span>
            </div>

            {/* Submit Button with Animation */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-100 group-hover:opacity-90 transition-opacity"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>

              <div className="relative flex items-center justify-center gap-2 py-4 text-white font-semibold">
                {isLoading ? (
                  <Loader2 className="animate-spin size-5" />
                ) : isLogin ? (
                  <>
                    <LogIn size={20} />
                    Sign In with Magic
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Create Account
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Toggle UI with Bento Style */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setFormData({ name: "", email: "", password: "" });
                }}
                className="px-6 py-2 bg-white dark:bg-gray-800 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md"
              >
                {isLogin
                  ? "Need an account? Register"
                  : "Already have an account? Login"}
              </button>
            </div>
          </div>

          {/* Error Feedback */}
          {(error || loginError || regError) && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                {error || "Something went wrong. Please try again."}
              </p>
            </div>
          )}

          {/* Quick Access Footer */}
          <div className="mt-6 flex justify-center gap-4 text-xs text-gray-400">
            <span>🔒 256-bit encryption</span>
            <span>⚡ Instant access</span>
            <span>🌐 24/7 support</span>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes slow-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-slow-spin {
          animation: slow-spin 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Authentication;
