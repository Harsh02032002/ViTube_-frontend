import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";



export default function Following() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const res = await api.get(`/users/following`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Following fetch error:", err);
      }
    };

    fetchFollowing();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Subscribed</h2>

      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => navigate(`/user/${user._id}`)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
          }}
        >
          <img
            src={user.img}
            alt={user.name}
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />

          <div>
            <div style={{ fontWeight: "600" }}>{user.name}</div>
            <div style={{ fontSize: "12px", color: "#777" }}>
              {user.subscribers} subscribers
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
