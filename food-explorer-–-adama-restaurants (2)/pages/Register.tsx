import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Utensils, CheckCircle2, Hash } from "lucide-react";
import { signupUser } from "../services/api";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const data = await signupUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (!data || !data.data) {
        throw new Error(data?.message || "Registration failed");
      }

      navigate("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 gradient-bg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gourmet-amber/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gourmet-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="glass-card w-full max-w-lg rounded-[3rem] overflow-hidden shadow-3xl p-10 md:p-16 animate-in zoom-in duration-700 relative z-10 border border-white/10">
        <div className="text-center mb-12">
          <div className="bg-gourmet-charcoal w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl amber-glow border border-gourmet-amber/20">
            <Utensils className="text-gourmet-amber w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-gourmet-charcoal mb-3 serif">
            Join the <span className="text-gourmet-amber italic">Circle</span>
          </h1>
          <p className="text-gourmet-charcoal/50 serif italic">Discover the culinary secrets of Adama</p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-xs font-black uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gourmet-charcoal/40 uppercase tracking-[0.2em] ml-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gourmet-amber/50" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full bg-gourmet-cream border border-gourmet-amber/10 rounded-2xl py-5 pl-14 pr-5 text-sm focus:outline-none focus:ring-2 focus:ring-gourmet-amber transition-all serif italic"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gourmet-charcoal/40 uppercase tracking-[0.2em] ml-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gourmet-amber/50" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="epicurean@adama.com"
                  required
                  className="w-full bg-gourmet-cream border border-gourmet-amber/10 rounded-2xl py-5 pl-14 pr-5 text-sm focus:outline-none focus:ring-2 focus:ring-gourmet-amber transition-all serif italic"
                />
              </div>
            </div>
          </div>


          <div className="space-y-3">
            <label className="text-[10px] font-black text-gourmet-charcoal/40 uppercase tracking-[0.2em] ml-2">
              Secret Passphrase
            </label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gourmet-amber/50" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-gourmet-cream border border-gourmet-amber/10 rounded-2xl py-5 pl-14 pr-5 text-sm focus:outline-none focus:ring-2 focus:ring-gourmet-amber transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gourmet-charcoal/40 uppercase tracking-[0.2em] ml-2">
              Confirm Passphrase
            </label>
            <div className="relative">
              <CheckCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gourmet-amber/50" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-gourmet-cream border border-gourmet-amber/10 rounded-2xl py-5 pl-14 pr-5 text-sm focus:outline-none focus:ring-2 focus:ring-gourmet-amber transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gourmet-charcoal text-gourmet-amber py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-gourmet-clay transition-all transform active:scale-[0.98] disabled:opacity-50 amber-glow"
          >
            {isLoading ? "Enrolling..." : "Begin Your Journey"}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[10px] text-gourmet-charcoal/40 font-black uppercase tracking-widest">
            Member already?{" "}
            <Link
              to="/login"
              className="text-gourmet-amber hover:text-gourmet-gold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
