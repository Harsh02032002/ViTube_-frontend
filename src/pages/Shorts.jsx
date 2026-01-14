import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import api from "../utils/api";

import {
  MdThumbUp,
  MdThumbDown,
  MdOutlineAddTask,
} from "react-icons/md";
import { IoArrowRedoOutline, IoChevronUpOutline, IoChevronDownOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

/* ---------------- STYLES ---------------- */

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 70px);
  background-color: ${({ theme }) => theme.bg};
  display: flex;
  justify-content: center;
  overflow: hidden;
`;

const ShortCard = styled.div`
  width: 100%;
  max-width: 450px;
  height: 90vh;
  margin-top: 20px;
  background: black;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);

  @media (max-width: 700px) {
    height: 100vh;
    margin-top: 0;
    border-radius: 0;
  }
`;

const VideoFrame = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;

  &::-webkit-media-controls {
    display: none !important;
  }
`;

const SeekOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  z-index: 15;
`;

const SeekZone = styled.div`
  flex: 1;
`;

const GradientOverlay = styled.div`
  position: absolute;
  bottom: 0;
  height: 35%;
  width: 100%;
  background: linear-gradient(transparent, rgba(0,0,0,0.85));
  pointer-events: none;
`;

const InfoOverlay = styled.div`
  position: absolute;
  bottom: 25px;
  left: 20px;
  color: white;
  z-index: 20;
  max-width: 75%;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
`;

const Desc = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const RightOverlay = styled.div`
  position: absolute;
  right: 15px;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 20;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));
`;

const ActionButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.text};

  span {
    font-size: 11px;
    font-weight: 700;
    color: ${({ theme }) => theme.textSoft};
  }

  &:hover {
    color: #0077ff;
    transform: translateY(-2px);
    transition: 0.2s;
  }
`;

const NavContainer = styled.div`
  position: absolute;
  right: -80px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 1100px) {
    right: 20px;
    background: rgba(0,0,0,0.2);
    padding: 10px;
    border-radius: 50px;
  }
`;

const ArrowBtn = styled.div`
  width: 50px;
  height: 50px;
  background: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.soft};

  &:hover {
    background: #0077ff;
    color: white;
  }
`;

/* ---------------- COMPONENT ---------------- */

const ShortsVideoPage = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    api.get("/videos/type/shorts")
      .then(res => setVideos(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIndex) {
        vid.play().catch(() => {
          vid.muted = true;
          vid.play();
        });
      } else {
        vid.pause();
      }
    });
  }, [currentIndex, videos]);

  const seekBackward = (vid) => {
    if (!vid) return;
    vid.currentTime = Math.max(vid.currentTime - 10, 0);
  };

  const seekForward = (vid) => {
    if (!vid) return;
    vid.currentTime = Math.min(vid.currentTime + 10, vid.duration);
  };

  return (
    <Container>
      <div style={{ position: "relative" }}>
        {videos.map((video, index) => (
          <ShortCard
            key={video._id}
            style={{ display: index === currentIndex ? "block" : "none" }}
          >
            <VideoFrame
              ref={(el) => (videoRefs.current[index] = el)}
              src={video.videoUrl}
              loop
              muted
              playsInline
              controls={false}
            />

            {/* TAP ZONES */}
            <SeekOverlay>
              <SeekZone onClick={() => seekBackward(videoRefs.current[index])} />
              <SeekZone
                onClick={() => {
                  const vid = videoRefs.current[index];
                  vid.paused ? vid.play() : vid.pause();
                }}
              />
              <SeekZone onClick={() => seekForward(videoRefs.current[index])} />
            </SeekOverlay>

            <GradientOverlay />

            <InfoOverlay>
              <Title>{video.title}</Title>
              <Desc>{video.desc}</Desc>
            </InfoOverlay>

            <RightOverlay>
              <ActionButton>
                <MdThumbUp size={28} />
                <span>{video.likes?.length || 0}</span>
              </ActionButton>
              <ActionButton>
                <MdThumbDown size={28} />
                <span>Dislike</span>
              </ActionButton>
              <ActionButton>
                <MdOutlineAddTask size={28} />
                <span>Save</span>
              </ActionButton>
              <ActionButton>
                <IoArrowRedoOutline size={28} />
                <span>Share</span>
              </ActionButton>
            </RightOverlay>
          </ShortCard>
        ))}

        <NavContainer>
          <ArrowBtn onClick={() => setCurrentIndex(i => Math.max(i - 1, 0))}>
            <IoChevronUpOutline size={24} />
          </ArrowBtn>
          <ArrowBtn onClick={() => setCurrentIndex(i => Math.min(i + 1, videos.length - 1))}>
            <IoChevronDownOutline size={24} />
          </ArrowBtn>
        </NavContainer>
      </div>
    </Container>
  );
};

export default ShortsVideoPage;
