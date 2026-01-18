import React, { useEffect, useState, useContext } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import "../styles/Main.css"

export default function Posts() {
    const { courseName } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch posts for the current course. Called on mount and after changes
    // (create/update/delete) to refresh the displayed list.
    const fetchPosts = () => {
        if (!courseName) return;
        setLoading(true);
        fetch(`http://localhost:8800/api/posts/course/${encodeURIComponent(courseName)}`)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => { fetchPosts(); }, [courseName]);

    const [editPostId, setEditPostId] = useState(null);
    const [editValues, setEditValues] = useState({ tip: "", gradivo: "", vrijeme: "", lokacija: "" });
    const [sentRequests, setSentRequests] = useState([]); // track posts for which user already sent a request

    // Start editing: populate inline edit form with the post's current values
    const startEdit = (post) => {
        setEditPostId(post.id_post);
        setEditValues({ tip: post.tip || "", gradivo: post.gradivo || "", vrijeme: post.vrijeme || "", lokacija: post.lokacija || "" });
    };

    const cancelEdit = () => { setEditPostId(null); setEditValues({ tip: "", gradivo: "", vrijeme: "", lokacija: "" }); };

    // Save edited post: sends PUT to backend with current user's id for ownership check.
    // On success, cancel edit mode and refresh posts list.
    const saveEdit = async (id_post) => {
        try {
            await axios.put(`http://localhost:8800/api/posts/${id_post}`, { ...editValues, id_user: currentUser.id_user });
            cancelEdit();
            fetchPosts();
        } catch (err) {
            alert('Greška pri spremanju: ' + (err.response?.data?.error || err.message));
        }
    };

    // Delete handler: confirms with user and calls backend. Backend enforces ownership
    // (so even if frontend mis-sends id_user, server will prevent unauthorized deletes).
    const deletePost = async (id_post) => {
        if (!window.confirm('Obrisati zahtjev?')) return;
        try {
            await axios.delete(`http://localhost:8800/api/posts/${id_post}`, { data: { id_user: currentUser.id_user } });
            fetchPosts();
        } catch (err) {
            alert('Greška pri brisanju: ' + (err.response?.data?.error || err.message));
        }
    };
    return (
        <div className="course-page-container">
            <Header />
            <div className="course-page flex">
                {/* LEFT PANEL */}
                <div className="left-panel">
                <div className="course-name-circle">
                    {courseName}
                </div>
                <div className="buttons-container">
                    <button className="course-btn" onClick={() => navigate(`/course/${courseName}`)}><b>Kreiraj zahtjev</b></button>
                    <button className="course-btn" onClick={() => navigate(`/posts/${courseName}`)}><b>Zahtjevi</b></button>
                    <button className="course-btn" onClick={() => navigate(`/notes/${courseName}`)}><b>Moje bilješke</b></button>
                    <button className="course-btn" onClick={() => navigate(`/script/${courseName}`)}><b>Moje skripte</b></button>
                </div>
                </div>
                {/* RIGHT PANEL */}
                <div className="right-panel">
                <h2>ZAHTJEVI ZA UČENJE – {courseName}</h2>

                {loading && <div>Učitavam...</div>}
                {error && <div>Greška: {error}</div>}
                                {!loading && !error && posts.map(post => (
                                        <div className="square" key={post.id_post}>
                                        <div className="request-form">

                                                <h3>{post.username || post.student || 'Nepoznati korisnik'}</h3>

                                                {editPostId === post.id_post ? (
                                                    <>
                                                        <div className="form-group">
                                                            <b>Tip učenja:</b>
                                                            <input value={editValues.tip} onChange={e => setEditValues(v => ({ ...v, tip: e.target.value }))} />
                                                        </div>
                                                        <div className="form-group">
                                                            <b>Gradivo:</b>
                                                            <input value={editValues.gradivo} onChange={e => setEditValues(v => ({ ...v, gradivo: e.target.value }))} />
                                                        </div>
                                                        <div className="form-group">
                                                            <b>Prijedlog termina:</b>
                                                            <input value={editValues.vrijeme} onChange={e => setEditValues(v => ({ ...v, vrijeme: e.target.value }))} />
                                                        </div>
                                                        <div className="form-group">
                                                            <b>Prijedlog lokacije:</b>
                                                            <input value={editValues.lokacija} onChange={e => setEditValues(v => ({ ...v, lokacija: e.target.value }))} />
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button className="course-btn1" onClick={() => saveEdit(post.id_post)}>Spremi</button>
                                                            <button className="course-btn1" onClick={cancelEdit}>Odustani</button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="form-group">
                                                            <b>Tip učenja:</b> {post.tip || post.type || ''}
                                                        </div>

                                                        <div className="form-group">
                                                            <b>Gradivo:</b> {post.gradivo || post.subject || ''}
                                                        </div>

                                                        <div className="form-group">
                                                            <b>Prijedlog termina:</b> {post.vrijeme || post.time || ''}
                                                        </div>

                                                        <div className="form-group">
                                                            <b>Prijedlog lokacije:</b> {post.lokacija || post.location || ''}
                                                        </div>

                                                        {currentUser && post.user_id === currentUser.id_user ? (
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <button className="course-btn1" onClick={() => startEdit(post)}><b>Uredi</b></button>
                                                                <button className="course-btn1" onClick={() => deletePost(post.id_post)}><b>Obriši</b></button>
                                                            </div>
                                                        ) : (
                                                            // BeBuddy button: sends match request to backend. After success, mark as sent.
                                                            <button className="course-btn1" disabled={sentRequests.includes(post.id_post)} onClick={async () => {
                                                                try {
                                                                    await axios.post('http://localhost:8800/api/matches/create', {
                                                                        followedUserId: post.user_id,
                                                                    }, { withCredentials: true });
                                                                    setSentRequests(s => [...s, post.id_post]);
                                                                } catch (err) {
                                                                    alert('Greška pri slanju zahtjeva: ' + (err.response?.data?.error || err.message));
                                                                }
                                                            }}>
                                                                <b>{sentRequests.includes(post.id_post) ? 'Poslano' : 'BeBuddy'}</b>
                                                            </button>
                                                        )}
                                                    </>
                                                )}

                                        </div>
                                        </div>
                                ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}