import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import api from "../utils/api";
import {
  MdThumbUp,
  MdThumbDown,
  MdOutlineAddTask,
  MdPlayArrow,
  MdPause,
} from "react-icons/md";
import {
  IoArrowRedoOutline,
  IoChevronUpOutline,
  IoChevronDownOutline,
} from "react-icons/io5";
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
`;

const VideoFrame = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;

  &::-webkit-media-controls {
    display: none !important;
  }
`;

/* 👉 Tap zones for 10 sec seek */
const SeekOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  z-index: 10;
`;

const SeekZone = styled.div`
  flex: 1;
`;

const RightOverlay = styled.div`
  position: absolute;
  right: 15px;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 18px;
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
    opacity: 0.8;
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
`;

/* ---------------- COMPONENT ---------------- */

const ShortsVideoPage = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
   const { currentUser } = useSelector((state) => state.user);

  const isSaved = videos.savedBy?.includes(currentUser?._id);

  const videoRefs = useRef([]);
 
  useEffect(() => {
    api.get("/videos/type/shorts").then((res) => setVideos(res.data));
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIndex) {
        vid.play();
        setIsPlaying(true);
      } else {
        vid.pause();
      }
    });
  }, [currentIndex, videos]);

  /* ================= ACTIONS ================= */

  const handleLike = async (id) => {
    if (!currentUser) return alert("Login first");
    await api.put(`/users/like/${id}`);
    updateLocal(id, "likes");
  };

  const handleDislike = async (id) => {
    if (!currentUser) return alert("Login first");
    await api.put(`/users/dislike/${id}`);
    updateLocal(id, "dislikes");
  };

  const handleSave = async (id) => {
    if (!currentUser) return alert("Login first");

    const res = await api.put(`/users/save/${id}`);

    setVideos((prev) =>
      prev.map((v) =>
        v._id === id
          ? { ...v, savedBy: Array(res.data.savedByCount).fill("x") }
          : v
      )
    );
  };



  const handleShare = async (id) => {
    await api.put(`/users/share/${id}`);
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied");
  };

  /* ================= PLAY / PAUSE ================= */

  const togglePlay = () => {
    const vid = videoRefs.current[currentIndex];
    if (!vid) return;

    if (vid.paused) {
      vid.play();
      setIsPlaying(true);
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  /* ================= SEEK ================= */

  const seekBackward = () => {
    const vid = videoRefs.current[currentIndex];
    if (vid) vid.currentTime = Math.max(vid.currentTime - 10, 0);
  };

  const seekForward = () => {
    const vid = videoRefs.current[currentIndex];
    if (vid) vid.currentTime = Math.min(vid.currentTime + 10, vid.duration);
  };

  /* ================= LOCAL UPDATE ================= */

  const updateLocal = (videoId, type) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v._id !== videoId) return v;
        const uid = currentUser._id;

        if (type === "likes") {
          v.likes = v.likes.includes(uid)
            ? v.likes.filter((i) => i !== uid)
            : [...v.likes, uid];
          v.dislikes = v.dislikes.filter((i) => i !== uid);
        }

        if (type === "dislikes") {
          v.dislikes = v.dislikes.includes(uid)
            ? v.dislikes.filter((i) => i !== uid)
            : [...v.dislikes, uid];
          v.likes = v.likes.filter((i) => i !== uid);
        }
        return { ...v };
      })
    );
  };

  /* ================= UI ================= */

  return (
    <Container>
      <div style={{ position: "relative" }}>
        {videos.map(
          (video, index) =>
            index === currentIndex && (
              <ShortCard key={video._id}>
                <VideoFrame
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={video.videoUrl}
                  loop
                  playsInline
                />

                {/* 🔥 10 sec tap zones */}
                <SeekOverlay>
                  <SeekZone onClick={seekBackward} />
                  <SeekZone onClick={togglePlay} />
                  <SeekZone onClick={seekForward} />
                </SeekOverlay>

                <RightOverlay>
                  <ActionButton onClick={() => handleLike(video._id)}>
                    <MdThumbUp size={28} />
                    <span>{video.likes?.length || 0}</span>
                  </ActionButton>

                  <ActionButton onClick={() => handleDislike(video._id)}>
                    <MdThumbDown size={28} />
                    <span>{video.dislikes?.length || 0}</span>
                  </ActionButton>

                  <ActionButton onClick={togglePlay}>
                    {isPlaying ? (
                      <MdPause size={30} />
                    ) : (
                      <MdPlayArrow size={30} />
                    )}
                    <span>{isPlaying ? "Pause" : "Play"}</span>
                  </ActionButton>

                  <ActionButton onClick={() => handleSave(video._id)}>
                    <MdOutlineAddTask
                      size={28}
                      color={isSaved ? "#3ea6ff" : "white"}
                    />
                    <span>{video.savedBy?.length || 0}</span>
                  </ActionButton>

                  <ActionButton onClick={() => handleShare(video._id)}>
                    <IoArrowRedoOutline size={28} />
                    <span>{video.share?.length || 0}</span>
                  </ActionButton>
                </RightOverlay>
              </ShortCard>
            )
        )}

        <NavContainer>
          <ArrowBtn onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}>
            <IoChevronUpOutline />
          </ArrowBtn>
          <ArrowBtn
            onClick={() =>
              setCurrentIndex((i) => Math.min(i + 1, videos.length - 1))
            }
          >
            <IoChevronDownOutline />
          </ArrowBtn>
        </NavContainer>
      </div>
    </Container>
  );
};

export default ShortsVideoPage;
