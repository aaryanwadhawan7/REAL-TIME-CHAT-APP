import { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  // When App component mounts I want my frontend to access the ws server
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8081");
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };

    return () => ws.close();
    // clean up on unmount
  }, []);

  return (
    <div className="h-screen bg-black">
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {messages.map((message) => (
          <div className="flex justify-start mb-4">
            <span className="bg-white text-black rounded-2xl px-6 py-3 shadow-md max-w-[70%] break-words font-bold text-lg">
              {message}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-white flex">
        <input
          id="btn"
          className="flex-1 p-4 rounded-l-xl border-none outline-none text-black font-bold text-lg"
        ></input>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-r-xl transition"
          onClick={() => {
            const message = (document.getElementById("btn") as HTMLInputElement)
              ?.value;
            if (wsRef.current) {
              wsRef.current.send(
                JSON.stringify({
                  type: "chat",
                  payload: {
                    message: message,
                  },
                })
              );
            }
          }}
        >
          <b>Send Message</b>
        </button>
      </div>
    </div>
  );
}

export default App;
