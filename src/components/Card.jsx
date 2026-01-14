import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import api from "../utils/api";
import LoadingComp from "./LoadingComp";

const Container = styled.div`
  display: ${(props) => (props.type === "sm" ? "flex" : "block")};
  width: ${(props) => (props.type === "sm" ? "100%" : "340px")};
  margin-bottom: ${(props) => (props.type === "sm" ? "12px" : "45px")};
  cursor: pointer;
  gap: 16px;
  background: ${({ theme }) => theme.bgLighter};
  padding: ${(props) => (props.type === "sm" ? "10px" : "12px")};
  border-radius: 24px; // Extra rounded for premium feel
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid ${({ theme }) => theme.soft + "20"};

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    border-color: #0077ff40;
  }

  @media only screen and (max-width: 700px) {
    width: 95%;
    margin: 0 auto 20px auto;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: ${(props) => (props.type === "sm" ? "110px" : "190px")};
  background-color: #000; // Background black taaki contain mein gaps gande na lagen
  border-radius: 18px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain; // Thumbnail poora dikhega
  z-index: 2;
`;

// Thumbnail ke peeche halka glow dene ke liye background
const BackgroundBlur = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(${(props) => props.src});
  background-size: cover;
  filter: blur(20px);
  opacity: 0.3;
  z-index: 1;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => (props.type !== "sm" ? "16px" : "0px")};
  gap: 12px;
  flex: 1.5;
  padding: 0 4px;
`;

const ChannelImage = styled.img`
  display: ${(props) => props.type === "sm" && "none"};
  width: 42px;
  height: 42px;
  border-radius: 14px; // Squircle
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Texts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  color: ${({ theme }) => theme.text};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ChannelName = styled.h2`
  font-size: 13px;
  font-weight: 600;
  color: #0077ff; // Calm Indigo/Blue color for premium feel
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Info = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
  letter-spacing: 0.3px;
`;

const Card = ({ type, video }) => {
  const [channel, setChannel] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await api.get(`/users/find/${video.userId}`);
        setChannel(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchChannel();
  }, [video.userId]);

  return (
    <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
      {loading ? (
        <LoadingComp />
      ) : (
        <Container type={type}>
          <ImageContainer type={type}>
            <BackgroundBlur src={video.imgUrl} />
            <Image type={type} src={video.imgUrl} alt={video.title} />
          </ImageContainer>
          <Details type={type}>
            <ChannelImage type={type} src={channel.img} />
            <Texts type={type}>
              <Title>{video.title}</Title>
              <ChannelName>{channel.name}</ChannelName>
              <Info>
                {video.views} views •{" "}
                {new Date(video.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Info>
            </Texts>
          </Details>
        </Container>
      )}
    </Link>
  );
};

export default Card;
