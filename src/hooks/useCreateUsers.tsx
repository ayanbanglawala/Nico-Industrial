import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface UserData {
  userId?: number;
  name: string;
  email: string;
  password?: string;
  designation: string;
  mobileNo: string;
  roleId: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const useCreateUsers = () => {
  const [users, setUsers] = React.useState<UserData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const token = localStorage.getItem("token") || "";

  const createUser = async (userData: UserData, isEditing: boolean) => {
    setLoading(true);
    try {
      const submissionData = {
        id: userData.userId,
        name: userData.name,
        email: userData.email,
        password: userData.password || undefined,
        designation: userData.designation,
        role: { id: userData.roleId },
        mobileNo: userData.mobileNo,
      };

      let response;
      if (isEditing) {
        response = await axios.put(`https://nicoindustrial.com/api/user/editProfile`, submissionData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        response = await axios.post(`https://nicoindustrial.com/api/user/signup`, submissionData, { headers: { Authorization: `Bearer ${token}` } });
      }

      toast.success(response.data.message || (isEditing ? "User updated successfully" : "User created successfully"), { position: "top-right", autoClose: 3000 });

      return { success: true, data: response.data };
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || "Error processing the request. Please try again.";
      toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { loading, users, createUser };
};

export default useCreateUsers;
