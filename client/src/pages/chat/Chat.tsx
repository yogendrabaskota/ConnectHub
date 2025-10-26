import React, { useState, useRef, useEffect } from "react";

const Chat: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState(0);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contacts = [
    {
      id: 1,
      name: "New Movie! Expendables 4",
      img: "https://darrenjameseeley.files.wordpress.com/2014/09/expendables3.jpeg",
      msg: "Get Andrés on this movie ASAP!",
      lastSeen: "12:45 pm",
      online: true,
      participants: "Andrés, Tom, Harrison, Arnold, Sylvester",
    },
    {
      id: 2,
      name: "Arnold Schwarzenegger",
      img: "https://www.biography.com/.image/t_share/MTE5NDg0MDU1MTIyMTE4MTU5/arnold-schwarzenegger-9476355-1-402.jpg",
      msg: "I'll be back.",
      lastSeen: "11:30 am",
      online: true,
    },
    {
      id: 3,
      name: "Russell Crowe",
      img: "https://www.famousbirthdays.com/headshots/russell-crowe-6.jpg",
      msg: "Hold the line!",
      lastSeen: "Yesterday",
      online: false,
    },
    {
      id: 4,
      name: "Tom Cruise",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGpYTzuO0zLW7yadaq4jpOz2SbsX90okb24Z9GtEvK6Z9x2zS5",
      msg: "Show me the money!",
      lastSeen: "10:15 am",
      online: true,
    },
    {
      id: 5,
      name: "Harrison Ford",
      img: "https://www.biography.com/.image/t_share/MTE5NTU2MzE2MjE4MTY0NzQ3/harrison-ford-9298701-1-sized.jpg",
      msg: "Tell Java I have the money.",
      lastSeen: "09:20 am",
      online: false,
    },
  ];

  const messages = [
    {
      id: 1,
      text: "Hi everyone! Glad you could join! I am making a new movie.",
      sender: "Sylvester Stallone",
      time: "12:45 pm",
      date: "February 20, 2018",
    },
    {
      id: 2,
      text: "Count me in! When do we start shooting?",
      sender: "Arnold Schwarzenegger",
      time: "12:47 pm",
    },
    {
      id: 3,
      text: "I'm excited to be part of this project!",
      sender: "Tom Cruise",
      time: "12:49 pm",
    },
  ];

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.msg.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedContact]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", message);
      setMessage("");
      setTimeout(scrollToBottom, 100);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 min-h-screen flex items-center justify-center p-4">
      <div className="flex w-full max-w-6xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        {/* LEFT SIDEBAR */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                  src="http://andressantibanez.com/res/avatar.png"
                  alt="avatar"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className="font-bold text-gray-800">Andrés Santibáñez</p>
                <p className="text-xs text-green-600 font-medium">Online</p>
              </div>
            </div>
            <div className="flex space-x-4 text-gray-600">
              <button className="p-2 rounded-full hover:bg-white hover:text-teal-600 transition-all duration-200 shadow-sm hover:shadow-md">
                <i className="ri-search-line text-lg"></i>
              </button>
              <button className="p-2 rounded-full hover:bg-white hover:text-teal-600 transition-all duration-200 shadow-sm hover:shadow-md">
                <i className="ri-chat-3-line text-lg"></i>
              </button>
              <button className="p-2 rounded-full hover:bg-white hover:text-teal-600 transition-all duration-200 shadow-sm hover:shadow-md">
                <i className="ri-more-2-fill text-lg"></i>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 bg-white">
            <div className="relative">
              <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search or start new chat"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl text-sm bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Contacts */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
            {filteredContacts.map((contact, index) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(index)}
                className={`flex items-center gap-4 p-4 cursor-pointer transition-all duration-200 ${
                  selectedContact === index
                    ? "bg-gradient-to-r from-teal-50 to-emerald-50 border-r-4 border-teal-500"
                    : "hover:bg-gray-50 border-r-4 border-transparent"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={contact.img}
                    alt={contact.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                  />
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-gray-800 truncate">
                      {contact.name}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {contact.lastSeen}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm truncate">
                    {contact.msg}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT CHAT AREA */}
        <div className="w-2/3 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  className="w-12 h-12 rounded-2xl border-2 border-white shadow-md"
                  src={contacts[selectedContact].img}
                  alt="chat"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className="font-bold text-gray-800">
                  {contacts[selectedContact].name}
                </p>
                <p className="text-sm text-gray-500">
                  {contacts[selectedContact].participants || "Online"}
                </p>
              </div>
            </div>
            <div className="flex space-x-3 text-gray-600">
              <button className="p-3 rounded-2xl hover:bg-white hover:text-teal-600 transition-all duration-200 shadow-sm hover:shadow-md">
                <i className="ri-phone-line text-lg"></i>
              </button>
              <button className="p-3 rounded-2xl hover:bg-white hover:text-teal-600 transition-all duration-200 shadow-sm hover:shadow-md">
                <i className="ri-vidicon-line text-lg"></i>
              </button>
              <button className="p-3 rounded-2xl hover:bg-white hover:text-teal-600 transition-all duration-200 shadow-sm hover:shadow-md">
                <i className="ri-information-line text-lg"></i>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Date separator */}
            <div className="flex justify-center">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 text-xs rounded-full text-gray-600 border border-gray-200 shadow-sm">
                {messages[0].date}
              </div>
            </div>

            {/* Encryption notice */}
            <div className="flex justify-center">
              <div className="bg-yellow-50/80 backdrop-blur-sm px-6 py-3 rounded-2xl text-gray-600 text-sm shadow-sm max-w-md text-center border border-yellow-100">
                <i className="ri-shield-check-line text-yellow-500 mr-2"></i>
                Messages to this chat are secured with end-to-end encryption.
              </div>
            </div>

            {/* Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "Sylvester Stallone"
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <div
                  className={`max-w-md rounded-2xl px-5 py-3 shadow-sm transition-all duration-200 hover:shadow-md ${
                    msg.sender === "Sylvester Stallone"
                      ? "bg-white border border-gray-100 rounded-tl-none"
                      : "bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-tr-none"
                  }`}
                >
                  {msg.sender === "Sylvester Stallone" && (
                    <p className="font-semibold text-teal-600 text-sm mb-1">
                      {msg.sender}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p
                    className={`text-xs mt-2 ${
                      msg.sender === "Sylvester Stallone"
                        ? "text-gray-400"
                        : "text-teal-100"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-gray-100">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-3"
            >
              <div className="flex space-x-2 text-gray-500">
                <button
                  type="button"
                  className="p-3 rounded-2xl hover:bg-gray-50 hover:text-teal-600 transition-all duration-200"
                >
                  <i className="ri-emotion-happy-line text-xl"></i>
                </button>
                <button
                  type="button"
                  className="p-3 rounded-2xl hover:bg-gray-50 hover:text-teal-600 transition-all duration-200"
                >
                  <i className="ri-attachment-2 text-xl"></i>
                </button>
              </div>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-50 px-6 py-4 rounded-2xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-4 rounded-2xl font-medium hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <span>Send</span>
                <i className="ri-send-plane-2-line"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
