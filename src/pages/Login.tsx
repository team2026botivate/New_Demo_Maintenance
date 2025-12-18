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
    <div className="h-screen bg-gradient-to-br from-sky-100 via-white to-sky-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Main card */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 ring-1 ring-black/5 transform transition-all duration-300">
          {/* Header section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-sky-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative h-28 w-28 bg-white rounded-full flex items-center justify-center shadow-lg border-[6px] border-white mx-auto transform transition-transform duration-300 group-hover:scale-105">
                  <img 
                    src="/botivate-logo.jpg" 
                    alt="Botivate Logo" 
                    className="w-full h-full object-cover rounded-full" 
                  />
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2 font-medium uppercase tracking-wide">
              Maintenance Management System
            </p>
          </div>

          {/* Form section */}
          <div className="space-y-5">
            {/* Username field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User
                    className={`h-5 w-5 transition-colors duration-200 ${
                      focusedField === "username" ? "text-sky-600" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:bg-white transition-all duration-200 hover:border-gray-300"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock
                    className={`h-5 w-5 transition-colors duration-200 ${
                      focusedField === "password" ? "text-sky-600" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:bg-white transition-all duration-200 hover:border-gray-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-sky-600 transition-colors duration-200" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-sky-600 transition-colors duration-200" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-sky-200 transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              Sign in
            </button>

            {/* Demo credentials */}
            <div className="pt-4">
              <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">
                  Demo Credentials
                </p>
                <div className="space-y-2">
                  <div
                    className="flex items-center justify-between p-3 bg-white border border-gray-200/60 rounded-xl shadow-sm cursor-pointer hover:border-sky-200 hover:shadow-md transition-all duration-200 group"
                    onClick={() => {
                      setUsername("admin");
                      setPassword("admin123");
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xs group-hover:bg-sky-600 group-hover:text-white transition-colors">
                        A
                      </div>
                      <span className="text-sm font-medium text-gray-700">Admin</span>
                    </div>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 font-mono group-hover:bg-sky-50 group-hover:text-sky-700 transition-colors">
                      admin / admin123
                    </code>
                  </div>
                  
                  <div
                    className="flex items-center justify-between p-3 bg-white border border-gray-200/60 rounded-xl shadow-sm cursor-pointer hover:border-sky-200 hover:shadow-md transition-all duration-200 group"
                    onClick={() => {
                      setUsername("user");
                      setPassword("user123");
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        U
                      </div>
                      <span className="text-sm font-medium text-gray-700">User</span>
                    </div>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 font-mono group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                      user / user123
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-xs text-gray-400 font-medium">
                Powered by <span className="text-gray-600 font-bold hover:text-sky-600 transition-colors cursor-pointer">Botivate</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;