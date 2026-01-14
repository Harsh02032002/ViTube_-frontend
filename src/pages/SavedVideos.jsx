import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../utils/api";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { format } from "timeago.js";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 20px;
`;

const CardContainer = styled.div`
  width: 320px;
  cursor: pointer;
  background: #ffffff;
  padding: 12px;
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 180px;
  background-color: #000;
  border-radius: 18px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 2;
`;

const BackgroundBlur = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(${(props) => props.src});
  background-size: cover;
  filter: blur(15px);
  opacity: 0.3;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 12px 0 4px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Info = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const SavedVideos = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchSavedVideos = async () => {
      try {
        const res = await api.get("/users/saved");
        setVideos(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (currentUser) fetchSavedVideos();
  }, [currentUser]);

  return (
    <Container>
      {videos.length === 0 && <p>No saved videos yet.</p>}
      {videos.map((video) => (
        <Link
          to={`/video/${video._id}`}
          key={video._id}
          style={{ textDecoration: "none" }}
        >
          <CardContainer>
            <ImageContainer>
              <BackgroundBlur src={video.imgUrl} />
              <Image src={video.imgUrl} />
            </ImageContainer>
            <Title>{video.title}</Title>
            <Info>
              {video.views} views •{" "}
              {new Date(video.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Info>
          </CardContainer>
        </Link>
      ))}
    </Container>
  );
};

export default SavedVideos;
