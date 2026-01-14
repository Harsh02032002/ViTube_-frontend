import React, { useState } from 'react'
import styled from 'styled-components';
import { SPACING, SIZES } from '../constants';
import { IoPlayCircleOutline, IoSearchOutline, IoCloudUploadOutline, IoMenuOutline } from "react-icons/io5";
import { MdOutlineAccountCircle } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Upload from './Upload';
import Menu from './Menu';

const Container = styled.div`
  position: sticky;
  top: 0;
  
  width: 100%;
  z-index: 1000;
  background-color: rgba(248, 250, 252, 0.9); // Calm Light BG
  height: 80px; 
  backdrop-filter: blur(15px);
  border-bottom: 1px solid ${({ theme }) => theme.soft + "20"};
  display: flex;
  align-items: center;
  justify-content: center; // This helps in centering the search
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative; // This is the anchor for absolute elements
  padding: 0 30px; // Overall horizontal breathing space
`;

const Left = styled.div`
  position: absolute;
  left: 0; // LOGO FIXED AT FAR LEFT
  display: flex;
  align-items: center;
  padding-left: 20px; // Left se thoda margin
  
  a {
    text-decoration: none;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 22px;
  color: #1e293b;
  cursor: pointer;
  span { 
    background: linear-gradient(135deg, #0077ff, #00d4ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const SearchContainer = styled.div`
  /* THE MAGIC CENTER LOGIC */
  position: absolute;
  left: 50%;
  transform: translateX(-50%); // PERFECT CENTER
  
  width: 100%;
  max-width: 500px; // Deskptop par ek fixed size rahega
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #ffffff;
  border-radius: 50px; // Pill Shape
  border: 1px solid rgba(0, 119, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;

  &:focus-within {
    max-width: 550px;
    border-color: #0077ff;
    box-shadow: 0 8px 25px rgba(0, 119, 255, 0.1);
  }

  @media only screen and (max-width: 768px) {
    display: none; 
  }
`;

const Right = styled.div`
  position: absolute;
  right: 0; // PROFILE FIXED AT FAR RIGHT
  display: flex;
  align-items: center;
  gap: 20px;
  padding-right: 20px; // Right se thoda margin
`;


const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  &::placeholder { color: #666; font-weight: 500; }
`;



const User = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 14px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 12px; // Modern squircle instead of circle
  background-color: #f1f5f9;
  object-fit: cover;
  border: 2px solid transparent;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    border-color: #0077ff;
    transform: scale(1.05);
  }
`;

const IconButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text};
  transition: 0.2s;
  &:hover { color: #0077ff; }
`;

const Button = styled.button`
  padding: 10px 22px;
  background: transparent;
  border: 2px solid #0077ff;
  color: #0077ff;
  border-radius: 100px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.3s;

  &:hover {
    background-color: #0077ff;
    color: white;
    box-shadow: 0 4px 15px rgba(0, 119, 255, 0.3);
  }
`;

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [q, setQ] = useState("");
  const { currentUser } = useSelector(state => state.user);

  const handleSearch = () => {
    if (q) navigate(`/search?q=${q}`);
  };

  return (
    <>
      <Container>
        <Wrapper>
          <Left>
            
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Logo>
                <IoPlayCircleOutline size={28} color="#0077ff" />
                VIM<span>TUBE</span>
              </Logo>
            </Link>
          </Left>

          <SearchContainer>
            <Input 
              placeholder="Search cinematic works..." 
              onChange={e => setQ(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
            <IoSearchOutline 
                size={20} 
                style={{ cursor: "pointer", opacity: 0.7 }} 
                onClick={handleSearch} 
            />
          </SearchContainer>

          <Right>
            {currentUser ? (
              <User>
                <IconButton onClick={() => setOpen(true)}>
                  <IoCloudUploadOutline size={24} />
                </IconButton>
                <Avatar src={currentUser.img} onClick={() => setOpenMenu(true)} />
                <span style={{ cursor: "pointer" }} onClick={() => setOpenMenu(true)}>
                    {currentUser.name}
                </span>
              </User>
            ) : (
              <Link to="/signin" style={{ textDecoration: "none" }}>
                <Button>
                  <MdOutlineAccountCircle size={18} />
                  SIGN IN
                </Button>
              </Link>
            )}
          </Right>
        </Wrapper>
      </Container>
      
      {open && <Upload setOpen={setOpen} />}
      {openMenu && (
        <Menu 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          setOpenMenu={setOpenMenu} 
          type='sm' 
        />
      )}
    </>
  )
}

export default Navbar;