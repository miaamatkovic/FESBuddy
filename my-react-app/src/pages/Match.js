import React, { useState, useEffect, useContext, useRef } from "react";
import "../styles/Main.css";  
import { useNavigate } from "react-router-dom";
import Footer from "../pages/Footer";
import Header from "../pages/Header";
import axios from "axios";
import { AuthContext } from "../context/authContext";

export default function Match()
{
    const [requests, setRequests] = useState([]);
    const [outgoing, setOutgoing] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const [buddies, setBuddies] = useState([]);
    const [selectedBuddy, setSelectedBuddy] = useState(null);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const chatBoxRef = useRef(null);

    // Fetch real incoming/outgoing match requests from backend
    const fetchMatches = async () => {
      try {
        const res = await axios.get('http://localhost:8800/api/matches', { withCredentials: true });
        setRequests(res.data.incoming || []);
        setOutgoing(res.data.outgoing || []);
      } catch (err) {
        console.error('Error fetching matches', err);
      }
    };

        const fetchBuddies = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/matches/friends", { withCredentials: true });
        setBuddies(res.data.buddies || []);
      } catch (err) {
        console.error("Error fetching buddies", err);
      }
    };

    const fetchMessages = async (buddyId) => {
      if (!buddyId) return;
      setLoadingMsgs(true);
      try {
        const res = await axios.get(`http://localhost:8800/api/messages/with/${buddyId}`, { withCredentials: true });
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Error fetching messages", err);
        alert("Ne mogu dohvatiti poruke: " + (err.response?.data?.error || err.message));
      } finally {
        setLoadingMsgs(false);
      }
    };

    const fetchMessagesSilent = async (buddyId) => {
      if (!buddyId) return;
      try {
        const res = await axios.get(`http://localhost:8800/api/messages/with/${buddyId}`, { withCredentials: true });
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Polling fetch messages error", err);
      }
    };

    const sendMessage = async () => {
      const text = messageInput.trim();
      if (!selectedBuddy?.buddyId) return alert("Odaberi buddy-a prvo.");
      if (!text) return;

      try {
        await axios.post("http://localhost:8800/api/messages", { buddyId: selectedBuddy.buddyId, text }, { withCredentials: true });
        setMessageInput("");
        await fetchMessagesSilent(selectedBuddy.buddyId);
      } catch (err) {
        console.error("Send message error", err);
        alert("Greška pri slanju: " + (err.response?.data?.error || err.message));
      }
    };

    const fetchLastConversationAndOpen = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/messages/conversations", { withCredentials: true });
        const convos = res.data.conversations || [];
        if (convos.length > 0) {
          setSelectedBuddy({ buddyId: convos[0].buddyId, username: convos[0].buddyUsername });
        }
      } catch (err) {
        console.error("Error fetching conversations", err);
      }
    };
    useEffect(() => { fetchMatches(); fetchBuddies(); fetchLastConversationAndOpen(); }, []);
    
    useEffect(() => {
      if (!selectedBuddy?.buddyId) return;

      // odmah učitaj
      fetchMessages(selectedBuddy.buddyId);

      // polling svake 3 sekunde
      const t = setInterval(() => {
        fetchMessagesSilent(selectedBuddy.buddyId);
      }, 3000);

      return () => clearInterval(t);
      // eslint-disable-next-line
    }, [selectedBuddy?.buddyId]);

    useEffect(() => {
      const t = setInterval(() => {
        fetchMatches();
        fetchBuddies();
      }, 5000);
      return () => clearInterval(t);
      // eslint-disable-next-line
    }, []);

    useEffect(() => {
      // ako još nije odabran buddy, a postoji bar jedan buddy -> odaberi prvog (najnoviji)
      if (!selectedBuddy && buddies.length > 0) {
        const b = buddies[0];
        setSelectedBuddy({ buddyId: b.buddyId, username: b.username });
      }
    }, [buddies]); // eslint-disable-line

    useEffect(() => {
      const el = chatBoxRef.current;
      if (!el) return;

      // autoscroll samo ako si blizu dna (da ne smeta kad čitaš stare poruke)
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;

      if (nearBottom) {
        el.scrollTop = el.scrollHeight;
      }
    }, [messages]);

      useEffect(() => {
        const saved = localStorage.getItem(`lastChatBuddy_${currentUser?.id_user}`);
        if (saved) {
          try {
            const buddy = JSON.parse(saved);
            if (buddy?.buddyId) setSelectedBuddy(buddy);
          } catch (e) {
            console.error("Bad lastChatBuddy in localStorage");
          }
        }
      }, []);

    const acceptRequest = async (id_match) => {
      try {
        await axios.put(`http://localhost:8800/api/matches/${id_match}/accept`, {}, { withCredentials: true });
        fetchMatches();
        fetchBuddies();
      } catch (err) {
        alert('Greška pri prihvaćanju: ' + (err.response?.data?.error || err.message));
      }
    };

    const rejectRequest = async (id_match) => {
      try {
        await axios.put(`http://localhost:8800/api/matches/${id_match}/reject`, {}, { withCredentials: true });
        fetchMatches();
        fetchBuddies();
      } catch (err) {
        alert('Greška pri odbijanju: ' + (err.response?.data?.error || err.message));
      }
    };

    return (
        <div className="match-page">
            <Header />
            <div className="main-container">
        {/* LEFT COLUMN */}
          <div className="column left-col">
            <img src={"../pictures/match.png"} alt="profile" />

            <h2>FESBuddies</h2>

            <div className="buddies-list">
              {buddies.length === 0 && (
                <div className="empty">Nema još buddy-a</div>
              )}

              {buddies
              .filter(b => b.buddyId !== currentUser?.id_user)
              .map((b) => {
                const name = b.username || "Nepoznato";
                const initials = (name || "??")
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("");

                return (
                  <div
                    key={b.id_match}
                    className={
                      "buddy-item" +
                      (selectedBuddy?.buddyId === b.buddyId ? " active" : "")
                    }
                    onClick={() => {
                      if (b.buddyId === currentUser?.id_user) return;
                      const buddy = { buddyId: b.buddyId, username: b.username };
                      setSelectedBuddy(buddy);
                      localStorage.setItem(`lastChatBuddy_${currentUser?.id_user}`, JSON.stringify(buddy));
                    }}
                    title={"Otvori chat s: " + name}
                  >
                    <div className="avatar">{initials}</div>
                    <div className="name">{name}</div>
                  </div>
                );
              })}
            </div>
          </div>


        {/* MIDDLE COLUMN */}
        <div className="column middle-col">
          <h2 className="text-center">
            {selectedBuddy ? `CHAT: ${selectedBuddy.username}` : "ODABERI BUDDY-A ZA CHAT"}
          </h2>

          <div className="chat-box" ref={chatBoxRef}>
            {!selectedBuddy && (
              <p>Klikni na buddy-a lijevo da otvoriš razgovor.</p>
            )}

            {selectedBuddy && loadingMsgs && (
              <div className="chat-empty">Učitavam poruke…</div>
            )}

            {selectedBuddy && !loadingMsgs && messages.length === 0 && (
              <div className="chat-empty">Nema poruka još. Pošalji prvu 🙂</div>
            )}

            {selectedBuddy && !loadingMsgs && messages.map((m) => {
              const mine = Number(m.id_sender) === Number(currentUser?.id_user);
              return (
                <div key={m.id_message} className={"msg" + (mine ? " mine" : " theirs")}>
                  <div className="bubble">{m.text}</div>
                  <div className="time">{new Date(m.sent_at).toLocaleString()}</div>
                </div>
              );
            })}
          </div>

          {/* composer */}
          <div className="chat-composer">
            <input
              className="chat-input"
              placeholder={selectedBuddy ? "Upiši poruku…" : "Odaberi buddy-a prvo…"}
              value={messageInput}
              disabled={!selectedBuddy}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button className="chat-btn-primary" disabled={!selectedBuddy} onClick={sendMessage}>
              Pošalji
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="column right-col">
          <h2>ZAHTJEVI</h2>

          <div className="requests-list">
            {requests
            .filter(r => r.followerUserId !== currentUser?.id_user)
            .map(req => {
              const matchId = req.id || req.id_match;
              const name = req.followerName || req.name || req.username || 'Nepoznato';
              const initials = (name || '??').split(' ').map(n => n[0]).slice(0,2).join('');
              return (
              <div key={matchId} className="request-item incoming">
                <div className="avatar">{initials}</div>
                <div className="request-body">
                  <div className="name">{name}</div>
                  <div className="meta">Zahtjev za učenje</div>
                </div>
                {req.status === "pending" && (
                    <div className="actions">
                    <button className="accept" onClick={() => acceptRequest(matchId)} aria-label="Prihvati">✔</button>
                    <button className="reject" onClick={() => rejectRequest(matchId)} aria-label="Odbij">✖</button>
                  </div>
                )}
                {req.status === "accepted" && (
                  <span className="status accepted" title="Prihvaćeno">✔</span>
                )}

                {req.status === "rejected" && (
                  <span className="status rejected" title="Odbijeno">✖</span>
                )}
              </div>
            )})}

            {/* Outgoing requests (requests this user has sent) */}
            {outgoing.filter(o => o.status === "pending").length > 0 && (
              <div className="outgoing-section">
                <h3>Poslani zahtjevi</h3>
                {outgoing
                .filter(o => o.status === "pending")
                .map(o => {
                  const matchId = o.id || o.id_match;
                  const name = o.followedName || o.name || o.username || 'Nepoznato';
                  const initials = (name || '??').split(' ').map(n => n[0]).slice(0,2).join('');
                  return (
                  <div key={matchId} className="request-item outgoing">
                    <div className="avatar">{initials}</div>
                    <div className="request-body">
                      <div className="name">{name}</div>
                      <div className="meta">Čekanje odgovora</div>
                    </div>
                    {o.status === 'pending' && (
                      <span className="status pending" title="Čeka se">🕒</span>
                    )}
                  </div>
                )})}
              </div>
            )}
          </div>
          </div>
        </div>
            <Footer />
        </div>
    );
}