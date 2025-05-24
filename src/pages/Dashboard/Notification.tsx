import React, { useState, useEffect } from "react";
import axios from "axios";

// Define the type for notifications
type NotificationType = {
  notificationId: string;
  message: string;
  readable: boolean;
  userInfo: {
    name: string;
    createdOn: string;
    role: {
      roleName: string;
    };
  };
};

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<NotificationType | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const id = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("URL", `https://nicoindustrial.com/api/notification/getNotification/${id}`);
        
        const response = await axios.get(
          `https://nicoindustrial.com/api/notification/getNotification/1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        console.log("Notifications:", response.data);
        setNotifications(response.data);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        setLoading(false);
      }
    };

    if (id && token) {
      fetchNotifications();
    }
  }, [id, token]);

  const openModal = (notification: NotificationType) => {
    const updatedNotifications = notifications.map((n) =>
      n.notificationId === notification.notificationId
        ? { ...n, readable: true }
        : n
    );
    setNotifications(updatedNotifications);
    setSelectedNotification(notification);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedNotification(null);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (loading) return <div className="p-4 text-gray-600">Loading notifications...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Notifications</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications found</p>
      ) : (
        <ul className="space-y-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {notifications.map((notification) => (
            <li
              key={notification.notificationId}
              className={`border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                !notification.readable ? "bg-blue-50" : ""
              }`}
              onClick={() => openModal(notification)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-900">{notification.message}</h3>
                <span className="text-sm text-gray-500">
                  {formatDate(notification.userInfo.createdOn)}
                </span>
              </div>
              <p className="text-gray-600">
                Role: {notification.userInfo.role.roleName}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {showModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={closeModal}
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {selectedNotification.message}
            </h2>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="mb-2">
                <span className="font-semibold">From:</span>{" "}
                {selectedNotification.userInfo.name}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Role:</span>{" "}
                {selectedNotification.userInfo.role.roleName}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Date:</span>{" "}
                {formatDate(selectedNotification.userInfo.createdOn)}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {selectedNotification.readable ? "Read" : "Unread"}
              </p>
            </div>

            <div className="mb-8">
              <p className="text-gray-700">{selectedNotification.message}</p>
            </div>

            <button
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition-colors"
              onClick={closeModal}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
