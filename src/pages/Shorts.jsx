import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { MdThumbUp, MdThumbDown, MdOutlineAddTask, MdClose } from "react-icons/md";
import { IoArrowRedoOutline, IoChevronUpOutline, IoChevronDownOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 70px); // Navbar ki height minus ki
  overflow: hidden;
  background-color: ${({ theme }) => theme.bg}; // Black ki jagah Theme BG
  position: relative;
  display: flex;
  justify-content: center;
`;

const ShortCard = styled.div`
  width: 100%;
  max-width: 450px; // Desktop par container jaisa dikhega
  height: 90vh;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: #000; // Sirf video ke piche black rahega for contrast
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3); // Premium shadow

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
  cursor: pointer;
`;

const GradientOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 35%;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  pointer-events: none;
`;

const InfoOverlay = styled.div`
  position: absolute;
  bottom: 30px;
  left: 20px;
  color: white;
  z-index: 10;
  max-width: 80%;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #fff;
`;

const Desc = styled.p`
  margin: 5px 0 0 0;
  font-size: 0.9rem;
  color: #eee;
  opacity: 0.8;
`;

const RightOverlay = styled.div`
  position: absolute;
  right: 15px;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  z-index: 20;
`;

const ActionButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: white;
  
  span {
    font-size: 11px;
    font-weight: 700;
    margin-top: 4px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  }

  &:hover {
    color: #0077ff;
    transform: translateY(-2px);
    transition: 0.2s;
  }
`;

const NavContainer = styled.div`
  position: absolute;
  right: -80px; // Video card ke bahar desktop par
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 1100px) {
    right: 20px; // Screen choti hone par andar aa jayega
    background: rgba(0,0,0,0.2);
    padding: 10px;
    border-radius: 50px;
  }
`;

const ArrowBtn = styled.div`
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 1px solid ${({ theme }) => theme.soft};
  &:hover { background: #0077ff; color: white; }
`;

const ShortsVideoPage = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const res = await axios.get("/videos/type/shorts");
        setVideos(res.data);
      } catch (err) { console.log(err); }
    };
    fetchShorts();
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (vid) idx === currentIndex ? vid.play().catch(() => { vid.muted = true; vid.play(); }) : vid.pause();
    });
  }, [currentIndex, videos]);

  const handleNext = () => setCurrentIndex(prev => (prev + 1 < videos.length ? prev + 1 : prev));
  const handlePrev = () => setCurrentIndex(prev => (prev - 1 >= 0 ? prev - 1 : prev));

  return (
    <Container>
      <div style={{ position: 'relative', height: 'fit-content' }}>
        {videos.map((video, index) => (
          <ShortCard key={video._id} style={{ display: index === currentIndex ? "flex" : "none" }}>
            <VideoFrame 
              ref={el => videoRefs.current[index] = el} 
              src={video.videoUrl} 
              loop 
              playsInline 
              onClick={() => {
                const vid = videoRefs.current[index];
                vid.paused ? vid.play() : vid.pause();
              }}
              muted 
            />
            <GradientOverlay />
            <InfoOverlay>
              <Title>{video.title}</Title>
              <Desc>{video.desc}</Desc>
            </InfoOverlay>

            <RightOverlay>
              <ActionButton><MdThumbUp size={28}/><span>{video.likes?.length || 0}</span></ActionButton>
              <ActionButton><MdThumbDown size={28}/><span>Dislike</span></ActionButton>
              <ActionButton><MdOutlineAddTask size={28}/><span>Save</span></ActionButton>
              <ActionButton><IoArrowRedoOutline size={28}/><span>Share</span></ActionButton>
            </RightOverlay>
          </ShortCard>
        ))}

        <NavContainer>
          <ArrowBtn onClick={handlePrev} title="Previous"><IoChevronUpOutline size={24} /></ArrowBtn>
          <ArrowBtn onClick={handleNext} title="Next"><IoChevronDownOutline size={24} /></ArrowBtn>
        </NavContainer>
      </div>
    </Container>
  );
};

export default ShortsVideoPage;