import { useState } from "react";
import { GiFeather } from "react-icons/gi";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useService } from "../../context";

const Register = () => {
  const { loading, register } = useService();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await register({ email, password, name });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full w-[95%] sm:max-w-md  max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="flex items-center justify-center mb-9">
          <GiFeather className="text-blue-600 text-4xl" />
          <h2 className="ml-2 text-xl font-semibold text-gray-700">
            Polutary Management
          </h2>
        </div>
        <form className="text-sm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium text-gray-600 mb-2">
              Unsername
            </label>
            <div className="relative flex items-center">
              <i className="fa fa-user text-sm absolute left-3 text-gray-400"></i>
              <input
                type="name"
                className="pl-10 pr-4 py-2 w-full rounded-lg border focus:border-blue-500 focus:outline-none"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
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
            <label className="block  font-medium text-gray-600 mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              <HiLockClosed className="absolute left-3 text-gray-400 text-lg" />
              <input
                type="password"
                className="pl-10 pr-4 py-2 w-full rounded-lg border focus:border-blue-500 focus:outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
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
