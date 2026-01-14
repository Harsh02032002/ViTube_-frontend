import React, { useState } from "react";
import styled from "styled-components";
import { SPACING } from "../constants";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

/* ================= SOLID MODAL WITH TRANSPARENT OVERLAY ================= */

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  inset: 0;
  /* Isse piche ka content dikhega */
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 500px;
  /* Modal ekdam solid white rahega */
  background-color: #ffffff;
  color: #111111;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
  border-radius: 16px;
  /* Shadow taaki piche ke content se alag dikhe */
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
  max-height: 85vh;
  overflow-y: auto;
`;

const Close = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;
  cursor: pointer;
  font-size: 20px;
  color: #999;
  &:hover {
    color: #000;
  }
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 5px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #555;
`;

const Input = styled.input`
  border: 1px solid #e2e8f0;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
  outline: none;
  &:focus {
    border-color: #0077ff;
    background-color: #fff;
  }
`;

const Desc = styled.textarea`
  border: 1px solid #e2e8f0;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
  resize: none;
  outline: none;
  &:focus {
    border-color: #0077ff;
    background-color: #fff;
  }
`;

const Select = styled.select`
  border: 1px solid #e2e8f0;
  padding: 10px;
  border-radius: 8px;
  background-color: #f8fafc;
`;

const Button = styled.button`
  border: none;
  padding: 14px;
  background-color: #0077ff;
  color: white;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 5px;
  &:hover {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
  }
`;

const Upload = ({ setOpen }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      alert("Fill All Fields!");
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
        headers: { "Content-Type": "multipart/form-data" },
      });
      setOpen(false);
      navigate(`/video/${res.data._id}`);
    } catch (err) {
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container onClick={() => setOpen(false)}>
      <Wrapper onClick={(e) => e.stopPropagation()}>
        <Close onClick={() => setOpen(false)}>✕</Close>
        <Title>Upload Video</Title>

        <FormGroup>
          <Label>Video File</Label>
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
          />
        </FormGroup>

        <FormGroup>
          <Label>Title</Label>
          <Input name="title" placeholder="Title" onChange={handleChange} />
        </FormGroup>

        <FormGroup>
          <Label>Description</Label>
          <Desc
            name="desc"
            rows={3}
            placeholder="Tell us about the video..."
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Category</Label>
          <Select name="type" onChange={handleChange}>
            <option value="">Choose category</option>
            <option value="music">Music</option>
            <option value="sports">Sports</option>
            <option value="gaming">Gaming</option>
            <option value="movies">Movies</option>
            <option value="shorts">Shorts</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Thumbnail Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </FormGroup>

        <Button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Publish Video"}
        </Button>
      </Wrapper>
    </Container>
  );
};

export default Upload;
