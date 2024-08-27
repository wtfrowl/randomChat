import React, { useState, useEffect } from 'react';

const Chat = ({ socket, partnerId, onDisconnect }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  
  useEffect(() => {
    document.addEventListener('keydown', handleKeys);

    const tempUsername = generateTempUsername();
    setUsername(tempUsername);
  function generateTempUsername() {
    return 'u_' + Math.random().toString(36).substr(2, 9);
  }
    // Listen for incoming messages
    socket.on('message', (data) => {
        console.log(data)
      setMessages((prevMessages) => [...prevMessages, {sender: data.uid, text: data.message }]);
    });
 

    // Listen for partner disconnection
    socket.on('partnerDisconnected', ({ partnerId }) => {
      alert('Your partner has disconnected.');
      onDisconnect(partnerId); // Handle disconnection (e.g., return to start chat screen)
    });

    return () => {
      socket.off('message');
      socket.off('partnerDisconnected');
    };
  }, [socket, onDisconnect]);

  const sendMessage = () => {
    if (message.trim()) {
      // Send message to server
      socket.emit('sendMessage', { message, to: partnerId ,uid:partnerId});
      // Add to local message list
      setMessages((prevMessages) => [...prevMessages, { sender: 'You', text: message }]);
      setMessage('');
    }
  };

  const handleDisconnect = () => {
    // Emit a custom event to inform the server about the disconnection
    socket.emit('disconnectChat', { partnerId });
    onDisconnect(partnerId); // Handle the UI changes after disconnection
  };

  const handleKeys = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
    handleDisconnect();
  }
    }



 const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };



 
  return (
    <div className="flex flex-col w-full mx-auto bg-white text-black shadow-lg rounded-lg  h-screen ">
    {/* Fixed header */}
    <div className="p-2 border-b bg-green-100 text-[14px] sm:text-lg font-medium static top-0 left-0 right-0 ">
     You are Chatting with <b> {partnerId.slice(0,5).toLowerCase()}</b>
    </div>
    
    {/* Chat messages container */}
    <div className="flex-1 p-2 overflow-scroll flex flex-col-reverse w-full mt-[2px] overflow-x-hidden  ">
      <div className="space-y-1 break-words text-wrap  ">
        {messages.slice().map((msg, index) => (
          <p key={index}
         >
           
            <strong  style={{
            color: msg.sender != 'You' ? 'red' : 'blue',
          }}> {msg.sender.charAt(0).toUpperCase()+msg.sender.slice(1,5).toLowerCase()} :</strong> {msg.text}
          </p>
        ))}
      </div>
    </div>
    
    {/* Input and buttons */}
    <div className="flex flex-col w-full items-center p-4 border-t sm:flex-col sm:p-2 mb-14">
      <input
        type="text"
        value={message}
        onKeyDown={handleKeyDown}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-2 border w-full rounded mr-2  sm:mr-0 mb-2"
      />
      <div className="flex space-x-2  sm:space-x-0 sm:space-y-2 sm:flex-col w-full">
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded w-full"
        >
          Send
        </button>
        <button
          onClick={handleDisconnect}
          className="ml-2 px-4 py-2 bg-red-500 text-white rounded sm:w-full sm:ml-0"
        >
          Disconnect
        </button>
      </div>
    </div>
  </div>
  
  

  );
};

export default Chat;
