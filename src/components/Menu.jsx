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
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import api from "../utils/api";


const Container = styled.div`
  flex: 1.1;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.bgLighter};
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
  border-right: 1px solid ${({ theme }) => theme.soft + "50"}; // Very faint border
  transition: all 0.3s ease;

  /* Scroller ko ekdum patla aur minimalist banaya */
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: ${({ theme }) => theme.soft}; border-radius: 10px; }

  @media only screen and (max-width: 700px) {
    display: ${(props) => props.type !== "sm" && `none`};
  }
`;

const Wrapper = styled.div`
  padding: 20px 15px;
`;

const SectionTitle = styled.h2`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${({ theme }) => theme.textSoft};
  margin: 25px 0 10px 15px;
  opacity: 0.6; // Light and subtle look
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 12px; // More rounded for modern feel
  transition: 0.2s ease-in-out;
  color: ${({ theme }) => theme.text};
  font-size: 14.5px;
  font-weight: 500;

  &:hover {
    background-color: ${({ theme }) => theme.soft + "40"}; // Light hover effect
    transform: translateX(3px);
  }

  &.active {
    background-color: #0077ff15; // Soft blue tint
    color: #0077ff;
    font-weight: 600;
  }
`;

const Hr = styled.hr`
  margin: 20px 15px;
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.soft + "30"};
`;

const SignBtn = styled.button`
  padding: 10px;
  background-color: #0077ff;
  border: none;
  color: white;
  border-radius: 10px;
  font-weight: 600;
  margin-top: 15px;
  cursor: pointer;
  width: 100%;
  box-shadow: 0 4px 15px rgba(0, 119, 255, 0.2);
  &:hover { background: #0066db; }
`;

const Menu = ({ darkMode, setDarkMode, type }) => {
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
        
        <Link to="/subscriptions" style={{ textDecoration: "none", color: "inherit" }}>
          <Item className={location.pathname === "/subscriptions" ? "active" : ""}>
            <IoCheckmarkDoneOutline size={22} /> Subscriptions
          </Item>
        </Link>

        <Hr />

        <SectionTitle>Categories</SectionTitle>
        <Link to="/category/music" style={{ textDecoration: "none", color: "inherit" }}>
          <Item><IoMusicalNotesOutline size={21} /> Music</Item>
        </Link>
        <Link to="/category/sports" style={{ textDecoration: "none", color: "inherit" }}>
          <Item><IoTrophyOutline size={21} /> Sports</Item>
        </Link>
        <Link to="/category/gaming" style={{ textDecoration: "none", color: "inherit" }}>
          <Item><IoGameControllerOutline size={21} /> Gaming</Item>
        </Link>
        <Link to="/category/movies" style={{ textDecoration: "none", color: "inherit" }}>
          <Item><IoFilmOutline size={21} /> Movies</Item>
        </Link>
        <Link to="/category/news" style={{ textDecoration: "none", color: "inherit" }}>
          <Item><IoNewspaperOutline size={21} /> News</Item>
        </Link>

        <Hr />

        <SectionTitle>Library</SectionTitle>
        <Link to="/category/shorts" style={{ textDecoration: "none", color: "inherit" }}>
          <Item><IoShapesOutline size={21} /> Snaps</Item>
        </Link>
        <Link to="/saved" style={{ textDecoration: "none", color: "inherit" }}>
          <Item className={location.pathname === "/saved" ? "active" : ""}>
            <MdOutlineCollections size={21} /> Saved
          </Item>
        </Link>

        <Hr />

        <Item onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <MdOutlineWbSunny size={21} /> : <MdNightlightRound size={21} />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </Item>
        
        <Item><MdOutlineSettings size={21} /> Settings</Item>
        <Item><MdOutlineHelpOutline size={21} /> Help</Item>

        {currentUser ? (
          <Item onClick={logOut} style={{ color: "#ff4757", marginTop: "10px" }}>
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