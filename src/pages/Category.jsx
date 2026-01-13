import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoCard from "../components/Card";
import styled from "styled-components";
import { useParams } from "react-router-dom";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const Category = () => {
  const { type } = useParams();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`/videos/type/${type}`);
      setVideos(res.data);
    };
    fetchVideos();
  }, [type]);

  return (
    <Container>
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Category;
