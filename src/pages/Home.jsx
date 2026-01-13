import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios";
import LoadingComp from "../components/LoadingComp";
import Tags from "../components/Tags";
import { fetchAllSuccess } from "../redux/videosSlice";
import { useDispatch, useSelector } from "react-redux";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  @media only screen and (max-width: 700px) {
    justify-content: center;
  }
`;

const Wrapper = styled.div`
  padding: 0.5rem 0;
  font-size: 0.8rem;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  overflow-x: scroll;
  scrollbar-width: none;
  color: ${({ theme }) => theme.text};

  &::-webkit-scrollbar {
    width: 0px;
  }

  @media only screen and (max-width: 700px) {
    margin: 10px 0px;
  }
`;

const Details = styled.div`
  display: flex;
  margin-top: 40px;
  gap: 10px;
  flex: 1;
  min-height: 100vh;
  color: ${({ theme }) => theme.text};
  justify-content: center;
  align-items: center;
`;

const Home = ({ type }) => {
  const { allVideos } = useSelector((state) => state.videos);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`/videos/${type}`);

        // ✅ SAFE: force array only
        const videos = Array.isArray(res.data)
          ? res.data
          : res.data?.videos || [];

        dispatch(fetchAllSuccess(videos));
      } catch (err) {
        console.log(err);
        setError(true);
        dispatch(fetchAllSuccess([]));
      } finally {
        setLoading(false);
      }
    };

    const fetchTags = async () => {
      try {
        const res = await axios.get(`/videos/tags/all`);
        setTags(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchVideos();
    fetchTags();
  }, [type, dispatch]);

  return (
    <>
      <Wrapper>
        <Tags tags={tags} />
      </Wrapper>

      <Container>
        {loading ? (
          <LoadingComp />
        ) : error ? (
          <Details>Something went wrong. Please refresh.</Details>
        ) : Array.isArray(allVideos) && allVideos.length > 0 ? (
          allVideos.map((video) => (
            <Card key={video._id} video={video} />
          ))
        ) : (
          <Details>No videos found</Details>
        )}
      </Container>
    </>
  );
};

export default Home;
