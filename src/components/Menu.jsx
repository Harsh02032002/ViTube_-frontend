import React from "react";
import styled from "styled-components";
import { 
  IoMusicalNotesOutline, IoTrophyOutline, IoGameControllerOutline, 
  IoFilmOutline, IoNewspaperOutline, IoShapesOutline,
  IoCompassOutline, IoFlameOutline, IoCheckmarkDoneOutline
} from "react-icons/io5";
import { 
  MdOutlineSettings, MdOutlineHelpOutline, MdOutlineWbSunny, 
  MdNightlightRound, MdLogout, MdOutlineCollections 
} from "react-icons/md";
import { IoPeopleOutline, IoPersonAddOutline } from "react-icons/io5";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import api from "../utils/api";


const Container = styled.div`
  flex: 1.1;
  color: ${({ theme }) => theme.text};
  /* Light Calm Background with glass effect */
  background-color: #f8fafc;
  height: calc(100vh - 40px); // Subtracting margin
  position: sticky;
  top: 5px; // Spacing from top
  left: 0;
  overflow-y: auto;
 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 119, 255, 0.05);
  transition: all 0.4s ease;

  &::-webkit-scrollbar {
    width: 0px;
  } // Scrollbar hide kar di premium look ke liye

  @media only screen and (max-width: 700px) {
    display: ${(props) => props.type !== "sm" && `none`};
    margin: 0;
    height: 100vh;
    border-radius: 0;
  }
`;

const Wrapper = styled.div`
  padding: 25px 15px;
`;

const SectionTitle = styled.h2`
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.8px;
  color: #94a3b8; // Calm blue-grey
  margin: 30px 0 12px 15px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  padding: 12px 18px;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #64748b; // Muted calm text
  font-size: 14.5px;
  font-weight: 500;
  margin-bottom: 6px;

  &:hover {
    background-color: #f1f5f9;
    color: #0077ff;
    transform: translateX(5px);
  }

  &.active {
    background: #eef2ff; // Very light indigo
    color: #0077ff;
    font-weight: 700;
  }
`;

// Sexy Gradient Divider
const Hr = styled.div`
  height: 1px;
  margin: 25px 15px;
  background: linear-gradient(
    90deg,
    rgba(0, 119, 255, 0) 0%,
    rgba(0, 119, 255, 0.15) 50%,
    rgba(0, 119, 255, 0) 100%
  );
`;

const SignBtn = styled.button`
  padding: 14px;
  background: #0077ff;
  border: none;
  color: white;
  border-radius: 16px;
  font-weight: 700;
  margin-top: 20px;
  cursor: pointer;
  width: 100%;
  box-shadow: 0 10px 20px rgba(0, 119, 255, 0.15);
  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }
`;
const Menu = ({ type }) => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logOut = async () => {
    try {
      await api.post(`/auth/signout`);
      localStorage.removeItem("persist:root");
      dispatch(logout());
      navigate("/");
    } catch (err) { console.log(err); }
  };

  return (
    <Container type={type}>
      <Wrapper>
        <SectionTitle>Menu</SectionTitle>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Item className={location.pathname === "/" ? "active" : ""}>
            <IoCompassOutline size={22} /> Explore
          </Item>
        </Link>

        <Link
          to="/subscriptions"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item
            className={location.pathname === "/subscriptions" ? "active" : ""}
          >
            <IoCheckmarkDoneOutline size={22} /> Subscriptions
          </Item>
        </Link>
        <Hr />

        <SectionTitle>Connections</SectionTitle>

        <Link
          to="/following"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item className={location.pathname === "/following" ? "active" : ""}>
            <IoPersonAddOutline size={21} /> Subscribed
          </Item>
        </Link>

        <Link
          to="/followers"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item className={location.pathname === "/followers" ? "active" : ""}>
            <IoPeopleOutline size={21} /> Subscribers
          </Item>
        </Link>

        <Hr />

        <SectionTitle>Categories</SectionTitle>
        <Link
          to="/category/music"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item>
            <IoMusicalNotesOutline size={21} /> Music
          </Item>
        </Link>
        <Link
          to="/category/sports"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item>
            <IoTrophyOutline size={21} /> Sports
          </Item>
        </Link>
        <Link
          to="/category/gaming"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item>
            <IoGameControllerOutline size={21} /> Gaming
          </Item>
        </Link>
        <Link
          to="/category/movies"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item>
            <IoFilmOutline size={21} /> Movies
          </Item>
        </Link>
        <Link
          to="/category/news"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item>
            <IoNewspaperOutline size={21} /> News
          </Item>
        </Link>

        <Hr />

        <SectionTitle>Library</SectionTitle>
        <Link
          to="/category/shorts"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item>
            <IoShapesOutline size={21} /> Snaps
          </Item>
        </Link>
        <Link to="/saved" style={{ textDecoration: "none", color: "inherit" }}>
          <Item className={location.pathname === "/saved" ? "active" : ""}>
            <MdOutlineCollections size={21} /> Saved
          </Item>
        </Link>

        <Hr />

        
        <Link
          to="/account"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item>
            <MdOutlineSettings size={21} /> Settings
          </Item>
        </Link>
        <Link
          to="/connect"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item>
            <MdOutlineHelpOutline size={21} /> Help
          </Item>
        </Link>
        {currentUser ? (
          <Item
            onClick={logOut}
            style={{ color: "#ff4757", marginTop: "10px" }}
          >
            <MdLogout size={21} /> Sign Out
          </Item>
        ) : (
          <Link to="/signin" style={{ textDecoration: "none" }}>
            <SignBtn>Sign In</SignBtn>
          </Link>
        )}
      </Wrapper>
    </Container>
  );
};

export default Menu;