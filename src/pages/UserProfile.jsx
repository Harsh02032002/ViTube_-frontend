import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";
import Card from "../components/Card";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await api.get(`/users/find/${id}`);
      const videoRes = await api.get(`/videos/user/${id}`);
      setUser(userRes.data);
      setVideos(videoRes.data);
    };
    fetchData();
  }, [id]);

  return (
    <div>
      <h2>{user?.name}</h2>
      <img src={user?.img} width="80" />
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {videos.map((v) => (
          <Card key={v._id} video={v} />
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
