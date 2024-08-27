import Queue from "./components/queue";
import Chat from "./components/chat";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Header from "./components/header";

function App() {
  const [socket, setSocket] = useState(null);
  const [started, setStarted] = useState(false);
  const [matched, setMatched] = useState(false);
  const [partnerId, setPartnerId] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    if (socket && started) {
      socket.emit("joinQueue");
      console.log("starting");
    }

    const fetchUserCount = async () => {
      try {
        const response = await fetch(
          "https://randomchat-7jgq.onrender.com/totalUsers",
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTotalUsers(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserCount();
  }, [socket, started]);

  const handleStartChat = () => {
    const newSocket = io("https://randomchat-7jgq.onrender.com"); // Create socket connection
    setSocket(newSocket); // Set the socket state
    setStarted(true);

    // Handle socket events
    newSocket.on("matched", (data) => {
      handleMatched(data.partnerId);
    });

    newSocket.on("partnerDisconnected", () => {
      alert("Your partner has disconnected.");
      handleDisconnect();
    });
  };

  const handleMatched = (partnerId) => {
    setMatched(true);
    setPartnerId(partnerId);
  };

  const handleDisconnect = () => {
    console.log("the guy has disconnected")
    if (socket) {
      socket.emit("disconnectChat", { partnerId });
      socket.disconnect();
      setSocket(null);
    }
    setStarted(false);
    setMatched(false);
    setPartnerId(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Header totalUsers={totalUsers} />
      <main className=" flex items-center justify-center flex-1 static">
        {!started ? (
          <button
            onClick={handleStartChat}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Start New Chat
          </button>
        ) : !matched ? (
          <Queue socket={socket} onMatched={handleMatched} />
        ) : (
          <Chat
            socket={socket}
            partnerId={partnerId}
            onDisconnect={handleDisconnect}
          />
        )}
      </main>
    </div>
  );
}

export default App;
