import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../utils/api";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SPACING, SIZES } from "../constants";

const Container = styled.div`
  flex: 6;
  padding: ${SPACING.m}px;
  display: flex;
  flex-wrap: wrap;
  gap: ${SPACING.m}px;
`;

const VideoCard = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.s}px;
  background-color: ${({ theme }) => theme.bgLighter};
  border-radius: ${SIZES.radius}px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
`;

const VideoThumb = styled.video`
  width: 100%;
  height: 170px;
  object-fit: cover;
  cursor: pointer;
`;

const VideoTitle = styled.h4`
  font-size: ${SIZES.body}px;
  margin: 0;
  padding: ${SPACING.s}px;
  color: ${({ theme }) => theme.text};
`;

const SavedVideos = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchSavedVideos = async () => {
      try {
        const res = await api.get("/users/saved", {
  headers: { token: `Bearer ${currentUser.accessToken}` },
});

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
        <VideoCard key={video._id}>
          <Link to={`/video/${video._id}`}>
            <VideoThumb src={video.videoUrl} />
            <VideoTitle>{video.title}</VideoTitle>
          </Link>
        </VideoCard>
      ))}
    </Container>
  );
};

export default SavedVideos;
