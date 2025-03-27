import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const App = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Socket.io setup
  useEffect(() => {
    const socket = io("http://localhost:8080");

    // Listen for notification from server
    socket.on("receive_notification", (data) => {
      console.log("Received notification:", data);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        data.message,
      ]);
    });

    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle sending notification
  const sendNotification = async () => {
    const socket = io("http://localhost:8080");
    socket.emit("send_notification", { message: notificationMessage });

    // Optionally, also update backend or local state if needed
    setNotificationMessage("");
  };

  return (
    <div>
      <h1>Real-time Notifications</h1>
      <div>
        <input
          type="text"
          value={notificationMessage}
          onChange={(e) => setNotificationMessage(e.target.value)}
        />
        <button onClick={sendNotification}>Send Notification</button>
      </div>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
