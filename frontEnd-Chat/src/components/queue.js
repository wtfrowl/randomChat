import React, { useEffect } from 'react';

const Queue = ({ socket, onMatched }) => {
  useEffect(() => {
    // Listen for the 'matched' event from the server
    socket.on('matched', (data) => {
      onMatched(data.partnerId);
    });

    // Clean up the event listener on component unmount
    return () => {
      socket.off('matched');
    };
  }, [socket, onMatched]);

  return (
    <div>
      <h2>Waiting to be matched...</h2>
    </div>
  );
};

export default Queue;
