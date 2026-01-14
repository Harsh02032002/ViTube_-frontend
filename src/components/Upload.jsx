import React, { useState } from "react";
import styled from "styled-components";
import { SPACING } from "../constants";
import api from "../utils/api";

import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Wrapper = styled.div`
  width: 600px;
  max-height: 90vh;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: ${SPACING.m}px;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.m}px;
  position: relative;
  overflow-y: auto;
  border-radius: 8px;
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
`;

const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: ${SPACING.s}px;
  background-color: transparent;
`;

const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: ${SPACING.s}px;
  background-color: transparent;
`;

const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: ${SPACING.s}px;
  background-color: transparent;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: ${SPACING.s}px ${SPACING.m}px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
`;

const Upload = ({ setOpen }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);

  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // JWT stored in localStorage

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  const handleUpload = async () => {
    if (!videoFile || !imageFile || !inputs.title || !inputs.desc || !inputs.type) {
      alert("Please fill all fields!");
      return;
    }

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
          "Authorization": `Bearer ${token}`, // JWT added here
          "Content-Type": "multipart/form-data"
        },
      });

      setOpen(false);
      navigate(`/video/${res.data._id}`);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Token is not valid. Please login again.");
      } else {
        alert("Upload failed!");
      }
    }
  };

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>✕</Close>
        <Title>Upload Video</Title>

        <Label>Video File</Label>
        <Input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />

        <Input name="title" placeholder="Title" onChange={handleChange} />
        <Desc name="desc" rows={4} placeholder="Description" onChange={handleChange} />

        <Label>Category</Label>
        <Select name="type" onChange={handleChange}>
          <option value="">Select Category</option>
          <option value="music">Music</option>
          <option value="sports">Sports</option>
          <option value="gaming">Gaming</option>
          <option value="movies">Movies</option>
          <option value="news">News</option>
          <option value="shorts">Shorts</option>
        </Select>

        <Input placeholder="Tags (comma separated)" onChange={handleTags} />

        <Label>Thumbnail</Label>
        <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />

        <Button onClick={handleUpload}>Upload</Button>
      </Wrapper>
    </Container>
  );
};

export default Upload;
