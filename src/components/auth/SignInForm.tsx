import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import "react-toastify/dist/ReactToastify.css";

export default function SignInForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://nicoindustrial.com/api/user/login`, formData);

      if (response.data.statusCode === 200) {
        const { token, Role, userId, message } = response.data.data;

        localStorage.setItem("token", token);
        localStorage.setItem("userRole", Role);
        localStorage.setItem("userId", userId);

        await updateFirebaseToken();

        toast.success(message || "Login successful", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          className: "toast-success",
        });

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error("Login failed. Please check your credentials.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          className: "toast-error",
        });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        className: "toast-error",
      });
    }
  };

  const updateFirebaseToken = async () => {
    const userId = localStorage.getItem("userId");
    const fireBaseToken = localStorage.getItem("firebaseToken");
    const token = localStorage.getItem("token");

    if (userId && fireBaseToken) {
      try {
        await axios.put(
          `https://nicoindustrial.com/api/notification/requesttoken`,
          { userId, fireBaseToken },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Error updating Firebase token", error);
      }
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <ToastContainer />
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">Sign In</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enter your email and password to sign in!</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="info@gmail.com" />
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="Enter your password" />
                  <span onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                    {showPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Link to="/reset-password" className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">
                  Forgot password?
                </Link>
              </div>
              <div>
                <Button {...({ type: "submit" } as any)} className="w-full" size="sm">
                  Sign in
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
