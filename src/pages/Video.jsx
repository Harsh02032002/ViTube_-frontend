import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdOutlineThumbUp, MdOutlineThumbDown, MdOutlineReply, MdOutlineAddTask, MdThumbUp, MdThumbDown, MdClose } from 'react-icons/md';
import timeago from 'timeago.js';
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import styled from 'styled-components';
import Comments from '../components/Comments';
import { SPACING, SIZES, COLORS } from '../constants';
import { dislike, fetchSuccess, like } from '../redux/videoSlice';
import { subscription } from '../redux/userSlice';
import Recommendation from '../components/Recommendation';

const Container = styled.div`display:flex; gap:${SPACING.s}px; @media(max-width:700px){display:block; min-height:100vh;}`;
const Content = styled.div`flex:6;`;
const VideoWrapper = styled.div``;
const Title = styled.div`font-size:${SIZES.m}px; font-weight:400; margin-top:${SPACING.s}px; margin-bottom:${SPACING.xs}px; color:${({theme})=>theme.text};`;
const Details = styled.div`display:flex; align-items:center; justify-content:space-between;`;
const Info = styled.span`color:${({theme})=>theme.textSoft};`;
const Buttons = styled.div`display:flex; gap:${SPACING.s}px; color:${({theme})=>theme.text};`;
const Button = styled.div`display:flex; align-items:center; gap:${SPACING.s}px; cursor:pointer;`;
const Hr = styled.hr`margin:${SIZES.radius}px 0; border:${SPACING.xs/9}px solid ${({theme})=>theme.soft};`;
const Channel = styled.div`display:flex; justify-content:space-between;`;
const ChannelInfo = styled.div`display:flex; gap:${SPACING.m}px;`;
const Image = styled.img`width:50px; height:50px; border-radius:50%;`;
const ChannelDetail = styled.div`display:flex; flex-direction:column; color:${({theme})=>theme.text};`;
const ChannelName = styled.div`font-weight:500;`;
const ChannelCounter = styled.div`margin-top:${SPACING.xs}px; margin-bottom:${SPACING.m}px; color:${({theme})=>theme.textSoft}; font-size:${SIZES.small}px;`;
const Description = styled.p`font-size:${SIZES.body}px;`;
const DescriptionMob = styled.p`max-width:300px; font-size:${SIZES.body}px; overflow:hidden; color:${({theme})=>theme.text}; padding:${SPACING.s}px;`;
const Subscribe = styled.button`background-color:${COLORS.error}; color:${COLORS.white}; border:none; border-radius:${SIZES.radius/5}px; height:max-content; padding:${SPACING.s}px ${SPACING.m}px; cursor:pointer;`;
const VideoFrame = styled.video`max-width:64rem; width:100%; max-height:30.875rem; height:100%;`;

/* Modal styles */
const ModalOverlay = styled.div`
  position: fixed; top:0; left:0; right:0; bottom:0;
  background: rgba(0,0,0,0.5);
  display:flex; align-items:center; justify-content:center;
  z-index:1000;
`;
const ModalContent = styled.div`
  background:#111; color:white; padding:20px; border-radius:10px; width:300px; text-align:center; position:relative;
`;
const CloseButton = styled(MdClose)`position:absolute; top:10px; right:10px; cursor:pointer;`;

const Video = () => {
  const timeagoInstance = timeago();
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();
  const path = useLocation().pathname.split("/")[2];
  const [channel, setChannel] = useState({});
  const [shareCount, setShareCount] = useState(currentVideo?.share?.length || 0);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`/videos/find/${path}`);
        if (videoRes.data) await axios.put(`/videos/view/${path}`);
        const channelRes = await axios.get(`/users/find/${videoRes.data.userId}`);
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
        setShareCount(videoRes.data.share?.length || 0);
      } catch (err) {}
    };
    fetchData();
  }, [path, dispatch]);

  const handleLike = async () => { await axios.put(`/users/like/${currentVideo._id}`); dispatch(like(currentUser?._id)); };
  const handleDislike = async () => { await axios.put(`/users/dislike/${currentVideo._id}`); dispatch(dislike(currentUser?._id)); };
  const handleSub = async () => { currentUser?.subscribedUsers.includes(channel._id) ? await axios.put(`/users/unsub/${channel._id}`) : await axios.put(`/users/sub/${channel._id}`); dispatch(subscription(channel._id)); };
  const handleSave = async (video) => {
  if (!currentUser) return alert("Please login first");
  try {
    await axios.put(`/users/save/${video._id}`, {}, {
      headers: { token: `Bearer ${currentUser.accessToken}` },
    });
    alert("Video saved!");
  } catch (err) {
    console.log(err);
    alert("Error saving video");
  }
};

  const handleShare = async () => {
  if (!currentUser) return;

  try {
    const res = await axios.put(`/users/share/${currentVideo._id}`);
    setShareCount(res.data); // update count from server
    setShowShareModal(true);
  } catch (err) {
    console.log(err);
  }
};

  return (
    <Container>
      <Content>
        <VideoWrapper><VideoFrame src={currentVideo?.videoUrl} controls /></VideoWrapper>
        <Title>{currentVideo?.title}</Title>
        <Details>
          <Info>{currentVideo?.views} views • {timeagoInstance.format(currentVideo?.createdAt)}</Info>
          <Buttons>
            <Button onClick={handleLike}>{currentVideo?.likes?.includes(currentUser?._id)?<MdThumbUp/>:<MdOutlineThumbUp/>} {currentVideo?.likes?.length}</Button>
            <Button onClick={handleDislike}>{currentVideo?.dislikes?.includes(currentUser?._id)?<MdThumbDown/>:<MdOutlineThumbDown/>} Dislike</Button>
            <Button onClick={handleShare}><MdOutlineReply /> Share ({shareCount})</Button>
            <Button onClick={() => handleSave(currentVideo)}>
  <MdOutlineAddTask /> Save
</Button>

          </Buttons>
        </Details>

        <DescriptionMob>{currentVideo?.desc}</DescriptionMob>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel.img} />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
              <Description>{currentVideo?.desc}</Description>
            </ChannelDetail>
          </ChannelInfo>
          {currentUser ? <Subscribe onClick={handleSub}>{currentUser?.subscribedUsers?.includes(channel._id)?"SUBSCRIBED":"SUBSCRIBE"}</Subscribe> :
            <Link to="/signin" style={{textDecoration:'none', color:'inherit'}}><Subscribe>SUBSCRIBE</Subscribe></Link>}
        </Channel>
        <Hr />
        <Comments videoId={currentVideo?._id} />
      </Content>
      <Recommendation tags={currentVideo?.tags} />

      {showShareModal && (
        <ModalOverlay onClick={()=>setShowShareModal(false)}>
          <ModalContent onClick={(e)=>e.stopPropagation()}>
            <CloseButton onClick={()=>setShowShareModal(false)} />
            <h3>Share this video</h3>
            <input type="text" value={window.location.href} readOnly style={{width:"100%", padding:"5px"}}/>
            <p>Copy the link or share on social media!</p>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  )
}

export default Video;
