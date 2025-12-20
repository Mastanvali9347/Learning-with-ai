import { useEffect, useState } from "react";
import socket from "./socket";

function App() {
  const [status, setStatus] = useState("Connecting...");
  const [reply, setReply] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      setStatus("Connected to backend ✅");
      socket.emit("message", { text: "Hello Backend" });
    });

    socket.on("response", (data) => {
      setReply(data.reply);
    });

    socket.on("disconnect", () => {
      setStatus("Disconnected ❌");
    });

    return () => {
      socket.off("connect");
      socket.off("response");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>{status}</h2>
      <p>{reply}</p>
    </div>
  );
}

export default App;
