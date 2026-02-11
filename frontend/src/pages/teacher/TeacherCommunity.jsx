// src/pages/teacher/TeacherCommunity.jsx
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { FaComments, FaPaperPlane, FaReply } from "react-icons/fa";

function TeacherCommunity() {
  const [threads, setThreads] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    api.get("/community/threads")
      .then(res => setThreads(res.data))
      .catch(() => {
        setThreads([
          {
            id: 1,
            author: "Ali Khan (Student)",
            content: "Sir, can you share grammar notes?",
            replies: [
              { author: "Teacher (You)", content: "Yes, I'll share in next class." }
            ]
          },
          {
            id: 2,
            author: "Sara Ahmed (Student)",
            content: "When is the next live session?",
            replies: []
          },
          {
            id: 3,
            author: "Teacher (You)",
            content: "Reminder: Vocabulary quiz deadline is 12th Sept.",
            replies: [
              { author: "Bilal Hussain (Student)", content: "Thank you sir!" }
            ]
          }
        ]);
      });
  }, []);

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(),
      author: "Teacher (You)",
      content: newPost,
      replies: []
    };
    setThreads([post, ...threads]);
    setNewPost("");
  };

  const handleReply = (threadId) => {
    if (!replyText.trim()) return;
    setThreads(threads.map(thread => 
      thread.id === threadId 
        ? { ...thread, replies: [...thread.replies, { author: "Teacher (You)", content: replyText }] }
        : thread
    ));
    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f0ff",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{
          background: "white",
          padding: "50px",
          borderRadius: "32px",
          boxShadow: "0 20px 60px rgba(139,92,246,0.1)"
        }}>
          <h1 style={{ fontSize: "48px", color: "#6b21a8", textAlign: "center", marginBottom: "15px" }}>
            Community
          </h1>
          <p style={{ fontSize: "22px", color: "#9333ea", textAlign: "center", marginBottom: "50px" }}>
            Interact with students — post announcements and reply to questions
          </p>

          {/* Post Announcement */}
          <div style={{
            background: "#f3e8ff",
            padding: "40px",
            borderRadius: "24px",
            border: "2px solid #ddd6fe",
            marginBottom: "50px"
          }}>
            <h2 style={{ fontSize: "28px", color: "#6b21a8", marginBottom: "20px", display: "flex", alignItems: "center", gap: "15px" }}>
              <FaPaperPlane /> Post Announcement or Message
            </h2>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Write your message here..."
              rows="4"
              style={{
                width: "100%",
                padding: "20px",
                borderRadius: "16px",
                border: "2px solid #ddd6fe",
                fontSize: "18px",
                resize: "none",
                marginBottom: "20px"
              }}
            />
            <button
              onClick={handlePost}
              style={{
                background: "linear-gradient(45deg, #7c3aed, #6b21a8)",
                color: "white",
                padding: "15px 40px",
                border: "none",
                borderRadius: "30px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 10px 30px rgba(124,58,237,0.3)"
              }}
            >
              Post Message
            </button>
          </div>

          {/* Threads */}
          <div>
            <h2 style={{ fontSize: "32px", color: "#6b21a8", textAlign: "center", marginBottom: "30px" }}>
              Discussions
            </h2>

            {threads.length === 0 ? (
              <p style={{ textAlign: "center", fontSize: "20px", color: "#9ca3af" }}>
                No discussions yet. Start one!
              </p>
            ) : (
              <div style={{ display: "grid", gap: "30px" }}>
                {threads.map(thread => (
                  <div key={thread.id} style={{
                    background: "#f3e8ff",
                    padding: "30px",
                    borderRadius: "24px",
                    border: "2px solid #ddd6fe",
                    boxShadow: "0 10px 30px rgba(139,92,246,0.1)"
                  }}>
                    <p style={{ fontSize: "18px", color: "#6b21a8", fontWeight: "bold", marginBottom: "15px" }}>
                      {thread.author}
                    </p>
                    <p style={{ fontSize: "18px", color: "#4c1d95", lineHeight: "1.6", marginBottom: "20px" }}>
                      {thread.content}
                    </p>

                    {/* Replies */}
                    {thread.replies?.length > 0 && (
                      <div style={{ marginLeft: "40px", marginTop: "20px" }}>
                        {thread.replies.map((reply, idx) => (
                          <div key={idx} style={{
                            background: "white",
                            padding: "20px",
                            borderRadius: "16px",
                            marginBottom: "15px",
                            borderLeft: "4px solid #7c3aed"
                          }}>
                            <p style={{ fontSize: "16px", color: "#6b21a8", fontWeight: "bold", marginBottom: "8px" }}>
                              {reply.author}
                            </p>
                            <p style={{ fontSize: "16px", color: "#4c1d95" }}>
                              {reply.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Box */}
                    {replyingTo === thread.id ? (
                      <div style={{ marginLeft: "40px", marginTop: "20px" }}>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply..."
                          rows="3"
                          style={{
                            width: "100%",
                            padding: "15px",
                            borderRadius: "16px",
                            border: "2px solid #ddd6fe",
                            fontSize: "16px",
                            resize: "none",
                            marginBottom: "10px"
                          }}
                        />
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            onClick={() => handleReply(thread.id)}
                            style={{
                              background: "#7c3aed",
                              color: "white",
                              padding: "10px 25px",
                              border: "none",
                              borderRadius: "30px",
                              fontWeight: "bold"
                            }}
                          >
                            Send Reply
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                            style={{
                              background: "#e5e7eb",
                              color: "#4b5563",
                              padding: "10px 25px",
                              border: "none",
                              borderRadius: "30px"
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingTo(thread.id)}
                        style={{
                          marginLeft: "40px",
                          background: "transparent",
                          color: "#7c3aed",
                          border: "none",
                          fontSize: "16px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        <FaReply /> Reply
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherCommunity;