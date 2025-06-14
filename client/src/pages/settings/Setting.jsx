import { useState } from "react";
import { GiFeather } from "react-icons/gi";
import { HiLockClosed } from "react-icons/hi";
import { useService } from "../../context";
import toast from "react-hot-toast";

const Setting = () => {
  const { loading, updatePassword } = useService();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }
    await updatePassword({ oldPassword, newPassword });
    setNewPassword("")
    setOldPassword("")
    setConfirmPassword("")
  };

  return (
    <div className="flex min-h-[86vh] items-center justify-center bg-gray-100">
      <div className="w-[95%] sm:max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="flex items-center justify-center mb-9">
          <GiFeather className="text-[#2A2A40] text-4xl" />
          <h2 className="ml-2 text-xl font-semibold text-gray-700">
            Update Password
          </h2>
        </div>
        <form className="text-sm" onSubmit={handleSubmit}>
          {/* Old Password Field */}
          <div className="mb-4">
            <label className="block font-medium text-gray-600 mb-2">
              Old Password
            </label>
            <div className="relative flex items-center">
              <HiLockClosed className="absolute left-3 text-gray-400 text-lg" />
              <input
                type="password"
                className="pl-10 pr-4 py-2 w-full rounded-lg border focus:border-blue-500 focus:outline-none"
                placeholder="Enter your old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* New Password Field */}
          <div className="mb-4">
            <label className="block font-medium text-gray-600 mb-2">
              New Password
            </label>
            <div className="relative flex items-center">
              <HiLockClosed className="absolute left-3 text-gray-400 text-lg" />
              <input
                type="password"
                className="pl-10 pr-4 py-2 w-full rounded-lg border focus:border-blue-500 focus:outline-none"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label className="block font-medium text-gray-600 mb-2">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <HiLockClosed className="absolute left-3 text-gray-400 text-lg" />
              <input
                type="password"
                className="pl-10 pr-4 py-2 w-full rounded-lg border focus:border-blue-500 focus:outline-none"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-[#2A2A40] px-4 py-2 text-white transition hover:bg-blue-700"
          >
            {loading ? (
              <i className="fa fa-spinner fa-spin"></i>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setting;
