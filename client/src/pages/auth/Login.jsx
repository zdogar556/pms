import { useState } from "react";
import { GiFeather } from "react-icons/gi";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { Link, Navigate } from "react-router-dom";
import { useService } from "../../context";

const Login = () => {
  const { loading, signIn } = useService();
  const token = localStorage.getItem("token");

  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn({ email, password });
  };
  
  if (token) return <Navigate to={"/pms"} />;
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-[95%] sm:max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="flex items-center justify-center">
          <img src="/pms.png" className="w-16" alt="pms_logo" />
          <h2 className="text-xl font-semibold text-gray-700">
            Poultry Management
          </h2>
        </div>
        <form className="text-sm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium text-gray-600 mb-2">
              Email
            </label>
            <div className="relative flex items-center">
              <HiMail className="absolute left-3 text-gray-400 text-lg" />
              <input
                type="email"
                className="pl-10 pr-4 py-2 w-full rounded-lg border focus:border-blue-500 focus:outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-600 mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              <HiLockClosed className="absolute left-3 text-gray-400 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                className="pl-10 pr-10 py-2 w-full rounded-lg border focus:border-blue-500 focus:outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`absolute right-3 text-gray-400 cursor-pointer fa ${
                  showPassword ? "fa-eye" : "fa-eye-slash"
                }`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            {loading ? (
              <div className="flex gap-2 justify-center items-center">
                <i className="fa fa-spinner fa-spin"></i>
                <p>Login</p>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
