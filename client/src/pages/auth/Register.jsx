import { useState } from "react";
import { GiFeather } from "react-icons/gi";
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useService } from "../../context";

const Register = () => {
  const { loading, register } = useService();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    await register({ email, password, name });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full w-[95%] sm:max-w-md max-w-md rounded-lg bg-white p-8 shadow-lg">
        
        {/* ====== App Logo & Title ====== */}
        <div className="flex items-center justify-center mb-9">
          <GiFeather className="text-blue-600 text-4xl" />
          <h2 className="ml-2 text-xl font-semibold text-gray-700">
            Poultry Management
          </h2>
        </div>

        {/* ====== Registration Form ====== */}
        <form className="text-sm" onSubmit={handleSubmit}>

          {/* --- Username Field --- */}
          <div className="mb-4">
            <label className="block font-medium text-gray-600 mb-2">
              Username
            </label>
            <div className="relative flex items-center">
              <i className="fa fa-user text-sm absolute left-3 text-gray-400"></i>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full rounded-lg border focus:border-blue-500 focus:outline-none"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* --- Email Field --- */}
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

          {/* --- Password Field with Show/Hide --- */}
          <div className="mb-4">
            <label className="block font-medium text-gray-600 mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              {/* Lock Icon */}
              <HiLockClosed className="absolute left-3 text-gray-400 text-lg" />

              {/* Input Field */}
              <input
                type={showPassword ? "text" : "password"} // Toggle between text & password
                className="pl-10 pr-10 py-2 w-full rounded-lg border focus:border-blue-500 focus:outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Eye Icon for Toggle */}
              <span
                className="absolute right-3 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </span>
            </div>
          </div>

          {/* --- Submit Button --- */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            {loading ? (
              <div className="flex gap-2 justify-center items-center">
                <i className="fa fa-spinner fa-spin"></i>
                <p>Register</p>
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* ====== Link to Sign In ====== */}
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
