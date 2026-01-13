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
  z-index: 999;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.bgLighter};
  height: 70px; // Standard premium height
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  backdrop-filter: blur(10px); // Glassmorphism effect
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 24px;
  max-width: 1800px;
  margin: 0 auto;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 900;
  font-size: 20px;
  letter-spacing: -1px;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  span { color: #0077ff; }
`;

const SearchContainer = styled.div`
  flex: 0.5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 18px;
  background-color: ${({ theme }) => theme.bg}; // Slightly darker than navbar
  border-radius: 50px; // Pill shape
  border: 1px solid ${({ theme }) => theme.soft};
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #0077ff;
    box-shadow: 0 0 0 2px rgba(0, 119, 255, 0.2);
    flex: 0.6; // Expands slightly on focus
  }

  @media only screen and (max-width: 700px) {
    display: none; // Hide on small mobile to show only icon
  }
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

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 14px;
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #333;
  object-fit: cover;
  border: 2px solid transparent;
  cursor: pointer;
  &:hover { border-color: #0077ff; }
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
  padding: 8px 18px;
  background-color: #0077ff;
  border: none;
  color: white;
  border-radius: 50px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.3s;
  &:hover { background-color: #0062d1; transform: translateY(-1px); }
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