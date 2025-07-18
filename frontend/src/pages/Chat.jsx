import axios from "axios";
import React from "react";
import { useState } from "react";

const Chat = () => {
  const [chats, setChats] = useState([]);

  const fetchChat = async () => {
    const data = await axios.get("http://localhost:5000/api/chat");
    console.log("here is data", data);
  };

  return (
    <button
      onClick={() => {
        fetchChat();
      }}
      className="bg-red-500"
    >
      CLick Me
    </button>
  );
};

export default Chat;
