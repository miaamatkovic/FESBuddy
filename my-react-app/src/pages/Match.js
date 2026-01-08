import React, { useState } from "react";
import "../styles/Main.css";  
import { useNavigate } from "react-router-dom";
import Footer from "../pages/Footer";
import Header from "../pages/Header";

export default function Match()
{
    const [requests, setRequests] = useState([
    { id: 1, name: "Student ABC", status: "pending" },
    { id: 2, name: "Student DEF", status: "pending" },
    { id: 3, name: "Student GHI", status: "accepted" },
    ]);

    // outgoing requests that this user has sent to others
    const [outgoing, setOutgoing] = useState([
      { id: 101, name: "Student XYZ", status: "pending" },
    ]);

    const acceptRequest = (id) => {
    setRequests(requests.map(r =>
      r.id === id ? { ...r, status: "accepted" } : r
    ));
    };

    const rejectRequest = (id) => {
    setRequests(requests.map(r =>
      r.id === id ? { ...r, status: "rejected" } : r
    ));
    };

    return (
        <div className="match-page">
            <Header />
            <div className="main-container">
        {/* LEFT COLUMN */}
        <div className="column left-col">

          <img src={"../pictures/match.png"} alt="profile" />

          <h2>FESBuddies</h2>
          <div>
          </div>
        </div>

        {/* MIDDLE COLUMN */}
        <div className="column middle-col">
            <h2 className="text-center">TRENUTNO OTVOREN RAZGOVOR - CHAT </h2>
        </div>

        {/* RIGHT */}
        <div className="column right-col">
          <h2>ZAHTJEVI</h2>

          <div className="requests-list">
            {requests.map(req => (
              <div key={req.id} className="request-item incoming">
                <div className="avatar">{req.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                <div className="request-body">
                  <div className="name">{req.name}</div>
                  <div className="meta">Zahtjev za učenje</div>
                </div>
                {req.status === "pending" && (
                  <div className="actions">
                    <button className="accept" onClick={() => acceptRequest(req.id)} aria-label="Prihvati">✔</button>
                    <button className="reject" onClick={() => rejectRequest(req.id)} aria-label="Odbij">✖</button>
                  </div>
                )}
                {req.status === "accepted" && (
                  <span className="status accepted" title="Prihvaćeno">✔</span>
                )}

                {req.status === "rejected" && (
                  <span className="status rejected" title="Odbijeno">✖</span>
                )}
              </div>
            ))}

            {/* Outgoing requests (requests this user has sent) */}
            {outgoing.length > 0 && (
              <div className="outgoing-section">
                <h3>Poslani zahtjevi</h3>
                {outgoing.map(o => (
                  <div key={o.id} className="request-item outgoing">
                    <div className="avatar">{o.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                    <div className="request-body">
                      <div className="name">{o.name}</div>
                      <div className="meta">Čekanje odgovora</div>
                    </div>
                    {o.status === 'pending' && (
                      <span className="status pending" title="Čeka se">🕒</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>
            <Footer />
        </div>
    );
}