import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const loggedInUser = login(username, password);
    if (loggedInUser) {
      // Navigate to root, which will redirect based on role
      navigate("/", { replace: true });
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements - Premium Sky Blue pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-[0.03] rotate-12 bg-[radial-gradient(circle,theme(colors.sky.500)_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="max-w-md w-full relative z-10 animate-fade-in-up">
        {/* Main card - High contrast Sky Blue */}
        <div className="bg-white p-8 sm:px-10 sm:py-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(186,230,253,0.5)] border border-sky-100">
          
          {/* Header section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-sky-400/20 rounded-3xl blur-2xl group-hover:opacity-40 transition-opacity" />
                <div className="relative h-20 w-20 bg-white rounded-2xl flex items-center justify-center shadow-lg border-[1px] border-sky-100 mx-auto overflow-hidden">
                  <img 
                    src="/botivate-logo.jpg" 
                    alt="Botivate Logo" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-sky-900 mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-[11px] text-sky-500 font-bold uppercase tracking-[0.3em]">
              Maintenance Intelligence
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-sky-800/80 uppercase tracking-widest ml-1">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                  <div className="h-10 w-10 flex items-center justify-center text-sky-400 group-focus-within:text-sky-600 transition-colors">
                    <User size={19} strokeWidth={2.5} />
                  </div>
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  className={`block w-full pl-11 pr-4 py-3 bg-sky-50/50 border rounded-2xl text-sky-900 placeholder-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:bg-white transition-all duration-300 ${
                    focusedField === "username" ? "border-sky-500/50 shadow-sm" : "border-sky-100/80"
                  }`}
                  placeholder="admin"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-sky-800/80 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                  <div className="h-10 w-10 flex items-center justify-center text-sky-400 group-focus-within:text-sky-600 transition-colors">
                    <Lock size={19} strokeWidth={2.5} />
                  </div>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className={`block w-full pl-11 pr-12 py-3 bg-sky-50/50 border rounded-2xl text-sky-900 placeholder-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:bg-white transition-all duration-300 ${
                    focusedField === "password" ? "border-sky-500/50 shadow-sm" : "border-sky-100/80"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-sky-300 hover:text-sky-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-sky-600 hover:bg-sky-500 text-white text-sm font-black rounded-2xl shadow-xl shadow-sky-200 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] active:translate-y-0 focus:outline-none tracking-[0.2em] uppercase"
              >
                Sign In
              </button>
            </div>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 pt-8 border-t border-sky-100">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { setUsername("admin"); setPassword("admin123"); }}
                className="flex items-center gap-3 p-3 bg-sky-50 hover:bg-white border border-sky-50 hover:border-sky-200 rounded-2xl transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white font-bold text-xs group-hover:scale-110 transition-transform">A</div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-sky-900">Admin</span>
                  <span className="text-[10px] text-sky-400 font-medium">admin123</span>
                </div>
              </button>
              
              <button
                onClick={() => { setUsername("user"); setPassword("user123"); }}
                className="flex items-center gap-3 p-3 bg-sky-50 hover:bg-white border border-sky-50 hover:border-sky-200 rounded-2xl transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-xs group-hover:scale-110 transition-transform">U</div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-sky-900">User</span>
                  <span className="text-[10px] text-sky-400 font-medium">user123</span>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest">
              Powered by <span className="text-sky-600 font-black">Botivate</span>
            </p>
          </div>
        </div>
      </div>
    </div>




  );
};

export default Login;