import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Utensils, ArrowRight } from "lucide-react";
import { loginUser } from "../services/api";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await loginUser(formData);
      if (!data || !data.data) {
        throw new Error(data?.message || "Login failed");
      }
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 gradient-bg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gourmet-amber/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gourmet-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="glass-card w-full max-w-md rounded-[3rem] overflow-hidden shadow-3xl p-10 md:p-16 animate-in zoom-in duration-700 relative z-10 border border-white/10">
        <div className="text-center mb-12">
          <div className="bg-gourmet-charcoal w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl amber-glow border border-gourmet-amber/20">
            <Utensils className="text-gourmet-amber w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-gourmet-charcoal mb-3 serif">
            Welcome <span className="text-gourmet-amber italic">Back</span>
          </h1>
          <p className="text-gourmet-charcoal/50 serif italic">Continue your gourmet journey</p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-xs font-black uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gourmet-charcoal/40 uppercase tracking-[0.2em] ml-2">
              Email Credentials
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

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gourmet-charcoal/40 uppercase tracking-[0.2em] ml-2">
              Passphrase
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
            <div className="flex justify-end mt-2">
              <a
                href="#"
                className="text-[10px] font-black text-gourmet-amber hover:text-gourmet-gold uppercase tracking-widest"
              >
                Forgotten?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gourmet-charcoal text-gourmet-amber py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-gourmet-clay transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-50 amber-glow"
          >
            {isLoading ? "Authenticating..." : "Enter the Atelier"}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[10px] text-gourmet-charcoal/40 font-black uppercase tracking-widest">
            New to the Circle?{" "}
            <Link
              to="/register"
              className="text-gourmet-amber hover:text-gourmet-gold transition-colors"
            >
              Join Us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
