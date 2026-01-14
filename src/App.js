import React from "react";
import styled from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";
import Search from "./pages/Search";
import SignUp from "./pages/SignUp";
import Account from "./pages/Account";
import { useSelector } from "react-redux";
import EmailVerify from "./components/EmailVerify";
import Connect from "./pages/Connect";
import PageNotFound from "./pages/PageNotFound";
import Category from "./pages/Category";
import Shorts from "./pages/Shorts";
import SavedVideos from "./pages/SavedVideos";
import Followers from "./pages/Followers";
import Following from "./pages/Following";
import UserProfile from "./pages/UserProfile";

// 1. Sabse bahar ka dabba jo screen ko vertical divide karega
const Root = styled.div`
  display: flex;
  flex-direction: column; // Navbar upar, baaki sab niche
  background-color: #f1f5f9;
  min-height: 100vh;
`;

// 2. Navbar ke niche wala hissa (Sidebar + Main Content)
const Body = styled.div`
  display: flex; // Sidebar aur Main ko bagal-bagal lane ke liye
  flex: 1;
`;

const Main = styled.div`
  flex: 7;
  background-color: #f1f5f9;
`;

const Wrapper = styled.div`
  padding: 22px 16px;
  min-height: 100vh;
`;

const App = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <Root>
        {/* Navbar ab top par hai, poori width lega */}
        <Navbar />

        <Body>
          {/* Menu ab Navbar ke niche left mein fixed hai */}
          <Menu />

          <Main>
            <Wrapper>
              <Routes>
                <Route path="/">
                  <Route index element={<Home type="random" />} />
                  <Route path="trending" element={<Home type="trend" />} />
                  <Route path="subscriptions" element={<Home type="sub" />} />
                  <Route path="search" element={<Search />} />
                  <Route path="signin" element={<SignIn />} />
                  <Route path="signup" element={<SignUp />} />

                  {currentUser ? (
                    <Route
                      path="account"
                      element={<Account currentUser={currentUser} />}
                    />
                  ) : (
                    <Route path="account" element={<SignIn />} />
                  )}

                  <Route path="connect" element={<Connect />} />
                  <Route path="video">
                    <Route path=":id" element={<Video />} />
                  </Route>
                  <Route
                    path="/auth/:id/verify/:token"
                    element={<EmailVerify />}
                  />
                  <Route path="/category/:type" element={<Category />} />
                  <Route path="/user/:id" element={<UserProfile />} />
                  <Route path="/category/shorts" element={<Shorts />} />
                  <Route path="/saved" element={<SavedVideos />} />
                  <Route path="/followers" element={<Followers />} />
                  <Route path="/following" element={<Following />} />
                  <Route path="*" element={<PageNotFound />} />
                </Route>
              </Routes>
            </Wrapper>
          </Main>
        </Body>
      </Root>
    </BrowserRouter>
  );
};

export default App;
