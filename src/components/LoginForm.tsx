import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  UserPlus,
  School,
  MapPin,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import GlassCard from "./GlassCard";
import { useAuth } from "../contexts/AuthContext";

interface LoginFormProps {
  type: "student" | "teacher";
  onLogin: () => void;
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ type, onLogin, onClose }) => {
  const { signUp, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [signUpData, setSignUpData] = useState({
    name: "",
    confirmPassword: "",
    school: "",
    grade: "",
    state: "",
    subject: "", // for teachers
  });

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const grades = ["6th", "7th", "8th", "9th", "10th", "11th", "12th"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    if (isSignUp) {
      handleSignUp();
    } else {
      handleSignIn();
    }
  };

  const handleSignUp = async () => {
    try {
      // Validate sign up form
      if (password !== signUpData.confirmPassword) {
        setMessage({ type: 'error', text: "Passwords don't match!" });
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setMessage({ type: 'error', text: "Password must be at least 6 characters long!" });
        setIsLoading(false);
        return;
      }

      const userData = {
        name: signUpData.name,
        email,
        password,
        type,
        school: signUpData.school,
        state: signUpData.state,
        ...(type === 'student' ? { grade: signUpData.grade } : { subject: signUpData.subject })
      };

      const result = await signUp(userData);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => {
          onLogin();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      const result = await signIn(email, password, type);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => {
          onLogin();
        }, 1000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpDataChange = (field: string, value: string) => {
    setSignUpData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#F8D991] to-[#F6B080] rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-[#091D23]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isSignUp
                ? `${type === "student" ? "Student" : "Teacher"} Sign Up`
                : `${type === "student" ? "Student" : "Teacher"} Login`}
            </h2>
            <p className="text-white/70">
              {isSignUp
                ? "Join the PrismWorlds community"
                : "Welcome back to PrismWorlds"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Message Display */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl flex items-center space-x-2 ${
                  message.type === 'success' 
                    ? 'bg-green-500/20 border border-green-500/30 text-green-200' 
                    : 'bg-red-500/20 border border-red-500/30 text-red-200'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <span>{message.text}</span>
              </motion.div>
            )}

            {isSignUp && (
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                  <input
                    type="text"
                    value={signUpData.name}
                    onChange={(e) =>
                      handleSignUpDataChange("name", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-[#E1664C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E1664C] rounded"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                  <input
                    type="password"
                    value={signUpData.confirmPassword}
                    onChange={(e) =>
                      handleSignUpDataChange("confirmPassword", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            {isSignUp && (
              <>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    School/Institution
                  </label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                    <input
                      type="text"
                      value={signUpData.school}
                      onChange={(e) =>
                        handleSignUpDataChange("school", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                      placeholder="Enter your school name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {type === "student" ? (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Grade
                      </label>
                      <select
                        value={signUpData.grade}
                        onChange={(e) =>
                          handleSignUpDataChange("grade", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                        required
                      >
                        <option value="" className="bg-[#091D23] text-white">
                          Select Grade
                        </option>
                        {grades.map((grade) => (
                          <option
                            key={grade}
                            value={grade}
                            className="bg-[#091D23] text-white"
                          >
                            {grade}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Subject/Department
                      </label>
                      <input
                        type="text"
                        value={signUpData.subject}
                        onChange={(e) =>
                          handleSignUpDataChange("subject", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                        placeholder="e.g., Environmental Science"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      State
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                      <select
                        value={signUpData.state}
                        onChange={(e) =>
                          handleSignUpDataChange("state", e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                        required
                      >
                        <option value="" className="bg-[#091D23] text-white">
                          Select State
                        </option>
                        {indianStates.map((state) => (
                          <option
                            key={state}
                            value={state}
                            className="bg-[#091D23] text-white"
                          >
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#F8D991] to-[#F6B080] text-[#091D23] py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#F8D991]/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:ring-offset-2 focus:ring-offset-transparent"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{isSignUp ? "Creating Account..." : "Signing In..."}</span>
                </div>
              ) : (
                isSignUp ? "Create Account" : "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#E1664C] hover:text-[#F58B60] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E1664C] rounded px-2 py-1 mb-3 flex items-center space-x-1 mx-auto"
            >
              <UserPlus className="h-4 w-4" />
              <span>
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "New to PrismWorlds? Sign Up"}
              </span>
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-white/70 hover:text-[#E1664C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E1664C] rounded px-2 py-1"
            >
              Cancel
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;
