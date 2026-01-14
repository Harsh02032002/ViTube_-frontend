import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../utils/api";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/userSlice";
import ToastNotification from "../components/ToastNotification";
import { SIZES, SPACING } from "../constants";
import { format } from "timeago.js";

/* ================= PREMIUM STYLES ================= */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.text};
  padding: ${SPACING.xl}px;
  gap: 40px;
`;

const ProfileCard = styled.div`
  width: 100%;
  max-width: 800px;
  background: ${({ theme }) => theme.bgLighter};
  border-radius: 30px;
  padding: 40px;
  border: 1px solid ${({ theme }) => theme.soft + "30"};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const AvatarWrapper = styled.div`
  position: relative;
  margin-bottom: 15px;

  &:hover span {
    opacity: 1;
  }
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Input = styled.input`
  padding: 15px;
  border-radius: 15px;
  border: 1px solid ${({ theme }) => theme.soft};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: 0.3s;

  &:focus {
    outline: none;
    border-color: #0077ff;
    box-shadow: 0 0 0 4px rgba(0, 119, 255, 0.1);
  }

  &:disabled {
    background: ${({ theme }) => theme.soft + "20"};
    cursor: not-allowed;
  }
`;

const SaveButton = styled.button`
  grid-column: span 2;
  padding: 16px;
  border: none;
  border-radius: 15px;
  background: linear-gradient(135deg, #0077ff 0%, #00a2ff 100%);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 10px 20px rgba(0, 119, 255, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 25px rgba(0, 119, 255, 0.3);
  }

  @media (max-width: 600px) {
    grid-column: span 1;
  }
`;

/* ================= VIDEO GRID STYLES ================= */

const VideosSection = styled.div`
  width: 100%;
  max-width: 1200px;
`;

const SectionHeader = styled.h2`
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
`;

const MyVideoCard = styled.div`
  background: ${({ theme }) => theme.bgLighter};
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.soft + "20"};
  transition: 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
  }
`;

const ThumbContainer = styled.div`
  width: 100%;
  height: 160px;
  position: relative;
  background: #000;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const CardContent = styled.div`
  padding: 15px;
`;

const Title = styled.h3`
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.text};
`;

const Meta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
  display: flex;
  justify-content: space-between;
`;

const DeleteButton = styled.button`
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  background-color: #fff5f5; /* Light Red BG */
  color: #ff4757; /* Soft Red Text */
  border: 1px solid #ffe3e3;
  border-radius: 12px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #ff4757;
    color: white;
    border-color: #ff4757;
  }
`;

/* ================= COMPONENT ================= */

const Account = () => {
  const dispatch = useDispatch();
  const { currentUser, error, loading } = useSelector((state) => state.user);

  const [inputs, setInputs] = useState({
    name: currentUser?.name || "",
    username: currentUser?.username || "",
  });

  const [img, setImg] = useState(null);
  const [videos, setVideos] = useState([]);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const formData = new FormData();
      formData.append("name", inputs.name);
      formData.append("username", inputs.username);
      if (img) formData.append("img", img);

      const res = await api.put(`/users/${currentUser._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(updateUserSuccess(res.data));
      alert("Profile updated successfully!");
    } catch (err) {
      dispatch(
        updateUserFailure(err.response?.data?.message || "Update failed")
      );
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await api.get(`/videos/user/${currentUser._id}`);
      setVideos(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Bhai, delete karna hai pakka?")) return;
    try {
      await api.delete(`/videos/${id}`);
      setVideos(videos.filter((v) => v._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser) fetchVideos();
  }, [currentUser]);

  if (!currentUser) return <div>User not found</div>;

  return (
    <Container>
      <ProfileCard>
        <Details>
          <AvatarWrapper>
            <Avatar src={currentUser.img} alt="profile" />
          </AvatarWrapper>
          <h1 style={{ fontSize: "24px", fontWeight: "800" }}>
            {currentUser.name}
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            @{currentUser.username}
          </p>
        </Details>

        <Form onSubmit={handleSave}>
          {error && <ToastNotification message={error} />}

          <FormGroup>
            <Label>Display Name</Label>
            <Input
              name="name"
              value={inputs.name}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Username</Label>
            <Input
              name="username"
              value={inputs.username}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Email Address</Label>
            <Input value={currentUser.email} disabled />
          </FormGroup>

          <FormGroup>
            <Label>Change Avatar</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImg(e.target.files[0])}
            />
          </FormGroup>

          <SaveButton type="submit" disabled={loading}>
            {loading ? "Updating..." : "Save Profile Changes"}
          </SaveButton>
        </Form>
      </ProfileCard>

      <VideosSection>
        <SectionHeader>Your Uploads ({videos.length})</SectionHeader>
        {videos.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.5 }}>
            No videos uploaded yet.
          </p>
        ) : (
          <VideoGrid>
            {videos.map((video) => (
              <MyVideoCard key={video._id}>
                <Link
                  to={`/video/${video._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <ThumbContainer>
                    <Thumbnail src={video.imgUrl} />
                  </ThumbContainer>
                  <CardContent>
                    <Title>{video.title}</Title>
                    <Meta>
                      <span>{video.views} views</span>
                      <span>
                        {new Date(video.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </Meta>
                    <DeleteButton onClick={(e) => handleDelete(e, video._id)}>
                      Remove Video
                    </DeleteButton>
                  </CardContent>
                </Link>
              </MyVideoCard>
            ))}
          </VideoGrid>
        )}
      </VideosSection>
    </Container>
  );
};

export default Account;
