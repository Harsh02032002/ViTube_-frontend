import React, { useState } from "react";
import styled from "styled-components";
import { SPACING, SIZES } from "../constants";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

/* ================= PREMIUM STYLES ================= */

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px); /* Background blur for premium feel */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  overflow-y: auto;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.soft + "40"};
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.soft};
    border-radius: 10px;
  }
`;

const Close = styled.div`
  position: absolute;
  top: 20px;
  right: 25px;
  cursor: pointer;
  font-size: 24px;
  color: ${({ theme }) => theme.textSoft};
  transition: 0.2s;
  &:hover {
    color: #ff4757;
    transform: rotate(90deg);
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 10px;
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
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  padding: 14px;
  background-color: ${({ theme }) => theme.bg};
  outline: none;
  font-size: 14px;
  transition: 0.3s;

  &:focus {
    border-color: #0077ff;
    box-shadow: 0 0 0 4px rgba(0, 119, 255, 0.1);
  }

  &[type="file"] {
    padding: 10px;
    font-size: 12px;
    cursor: pointer;
  }
`;

const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  padding: 14px;
  background-color: ${({ theme }) => theme.bg};
  outline: none;
  font-size: 14px;
  resize: none;
  transition: 0.3s;
  &:focus {
    border-color: #0077ff;
  }
`;

const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  padding: 14px;
  background-color: ${({ theme }) => theme.bg};
  outline: none;
  cursor: pointer;
`;

const UploadButton = styled.button`
  border-radius: 12px;
  border: none;
  padding: 16px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  background: linear-gradient(135deg, #0077ff 0%, #00a2ff 100%);
  color: white;
  margin-top: 10px;
  transition: 0.3s;
  box-shadow: 0 10px 20px rgba(0, 119, 255, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 25px rgba(0, 119, 255, 0.3);
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    transform: none;
  }
`;

/* ================= COMPONENT ================= */

const Upload = ({ setOpen }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (
      !videoFile ||
      !imageFile ||
      !inputs.title ||
      !inputs.desc ||
      !inputs.type
    ) {
      alert("Oye, saare fields bhar de pehle!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", inputs.title);
      formData.append("desc", inputs.desc);
      formData.append("tags", tags.join(","));
      formData.append("type", inputs.type);
      formData.append("video", videoFile);
      formData.append("img", imageFile);

      const res = await api.post("/videos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setOpen(false);
      navigate(`/video/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container onClick={() => setOpen(false)}>
      <Wrapper onClick={(e) => e.stopPropagation()}>
        <Close onClick={() => setOpen(false)}>✕</Close>
        <Title>Upload New Video</Title>

        <FormGroup>
          <Label>Step 1: Select Video</Label>
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
          />
        </FormGroup>

        <FormGroup>
          <Label>Step 2: Video Details</Label>
          <Input
            name="title"
            placeholder="Give your video a catchy title"
            onChange={handleChange}
          />
          <Desc
            name="desc"
            rows={4}
            placeholder="Tell us more about the video..."
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Step 3: Categorize</Label>
          <Select name="type" onChange={handleChange}>
            <option value="">Select Category</option>
            <option value="music">🎵 Music</option>
            <option value="sports">⚽ Sports</option>
            <option value="gaming">🎮 Gaming</option>
            <option value="movies">🎬 Movies</option>
            <option value="news">📰 News</option>
            <option value="shorts">📱 Shorts</option>
          </Select>
          <Input
            placeholder="Tags (e.g. funny, tutorial, vlog)"
            onChange={handleTags}
          />
        </FormGroup>

        <FormGroup>
          <Label>Step 4: Custom Thumbnail</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </FormGroup>

        <UploadButton onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading Magic..." : "🚀 Publish Video"}
        </UploadButton>
      </Wrapper>
    </Container>
  );
};

export default Upload;
