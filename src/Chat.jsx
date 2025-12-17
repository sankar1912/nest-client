import React, { useEffect, useState } from "react"
import { socket } from "./socket"

export default function Chat() {
    const [myEmail, setMyEmail] = useState("")
    const [otherEmail, setOtherEmail] = useState("")
    const [joined, setJoined] = useState(false)

    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])

    /* ---------------- SOCKET LISTENERS ---------------- */

    useEffect(() => {
        socket.on("chatHistory", (history) => {
            setMessages(history)
        })

        socket.on("newMessage", (msg) => {
            setMessages((prev) => [...prev, msg])
        })

        return () => {
            socket.off("chatHistory")
            socket.off("newMessage")
        }
    }, [])

    /* ---------------- ACTIONS ---------------- */

    const joinChat = () => {
        if (!myEmail || !otherEmail) return

        socket.emit("joinPrivateChat", {
            senderEmail: myEmail,
            receiverEmail: otherEmail,
        })
        setJoined(true)
    }

    const sendMessage = () => {
        if (!message.trim()) return

        socket.emit("createChat", {
            senderEmail: myEmail,
            receiverEmail: otherEmail,
            message,
        })

        setMessage("")
    }

    /* ---------------- UI ---------------- */

    return (
        <div style={styles.container}>
            {!joined ? (
                <div style={styles.card}>
                    <h2>Private Chat</h2>

                    <input
                        style={styles.input}
                        placeholder="Your email"
                        value={myEmail}
                        onChange={(e) => setMyEmail(e.target.value)}
                    />

                    <input
                        style={styles.input}
                        placeholder="Other person's email"
                        value={otherEmail}
                        onChange={(e) => setOtherEmail(e.target.value)}
                    />

                    <button style={styles.button} onClick={joinChat}>
                        Start Chat
                    </button>
                </div>
            ) : (
                <div style={styles.chatBox}>
                    <div style={styles.header}>
                        Chat with <strong>{otherEmail}</strong>
                    </div>

                    <div style={styles.messages}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    ...styles.message,
                                    alignSelf:
                                        msg.senderEmail === myEmail
                                            ? "flex-end"
                                            : "flex-start",
                                    background:
                                        msg.senderEmail === myEmail
                                            ? "white"
                                            : "black",
                                    color:
                                        msg.senderEmail === myEmail
                                            ? "black"
                                            : "white",

                                }}
                            >
                                <div style={styles.sender}>{msg.senderEmail}</div>
                                <div>{msg.message}</div>
                            </div>
                        ))}
                    </div>

                    <div style={styles.inputRow}>
                        <input
                            style={styles.textInput}
                            placeholder="Type a message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button style={styles.sendButton} onClick={sendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}


const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f8",
    },
    card: {
        width: 350,
        padding: 24,
        borderRadius: 8,
        background: "#fff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },
    input: {
        padding: 10,
        fontSize: 14,
    },
    button: {
        padding: 10,
        background: "#1976d2",
        color: "#fff",
        border: "none",
        cursor: "pointer",
    },
    chatBox: {
        width: 400,
        height: 550,
        display: "flex",
        flexDirection: "column",
        background: "#e5ddd5",
        borderRadius: 8,
        overflow: "hidden",
    },
    header: {
        padding: 12,
        background: "#075e54",
        color: "#fff",
    },
    messages: {
        flex: 1,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        overflowY: "auto",
    },
    message: {
        maxWidth: "75%",
        padding: 10,
        borderRadius: 6,
        boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
    },
    sender: {
        fontSize: 10,
        opacity: 0.6,
        marginBottom: 4,
    },
    inputRow: {
        display: "flex",
        padding: 8,
        background: "#f0f0f0",
    },
    textInput: {
        flex: 1,
        padding: 10,
    },
    sendButton: {
        padding: "0 16px",
        background: "#128c7e",
        color: "#fff",
        border: "none",
        cursor: "pointer",
    },
}
