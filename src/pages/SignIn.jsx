import api from "../utils/api";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { SIZES, SPACING } from "../constants";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import ToastNotification from "../components/ToastNotification";
import { FcGoogle } from "react-icons/fc"; // Google Icon ke liye

/* ================= PREMIUM STYLES ================= */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 100px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft + "30"};
  padding: 40px 50px;
  gap: 20px;
  border-radius: 30px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  margin-bottom: -10px;
`;

const SubTitle = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-bottom: 10px;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  padding: 15px;
  width: 100%;
  outline: none;
  background-color: ${({ theme }) => theme.bg};
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #0077ff;
    box-shadow: 0 0 0 4px rgba(0, 119, 255, 0.1);
  }
`;

const Button = styled.button`
  border-radius: 12px;
  border: none;
  padding: 15px;
  width: 100%;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(135deg, #0077ff 0%, #00a2ff 100%);
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 119, 255, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 25px rgba(0, 119, 255, 0.3);
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.soft};
  background-color: white;
  color: #1e293b;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #f8fafc;
  }
`;

const More = styled.div`
  display: flex;
  margin-top: 30px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
  display: flex;
  gap: 15px;
`;

const LinkIt = styled.span`
  cursor: pointer;
  &:hover {
    color: #0077ff;
  }
`;

/* ================= COMPONENT ================= */

const SignIn = () => {
  const [UnameOrEmail, setUnameOrEmail] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.user);

  useEffect(() => {
    // Component unmount par error clear kar dega
    return () => dispatch(loginFailure(null));
  }, [dispatch]);

  useEffect(() => {
    function isValidEmail(email) {
      return /\S+@\S+\.\S+/.test(email);
    }
    if (isValidEmail(UnameOrEmail)) {
      setEmail(UnameOrEmail);
      setUsername("");
    } else {
      setUsername(UnameOrEmail);
      setEmail("");
    }
  }, [UnameOrEmail]);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const response = await api.post(`/auth/signin`, {
        ...(username ? { username } : { email }),
        password,
      });
      if (response.status === 200) {
        dispatch(loginSuccess(response.data));
        navigate("/");
      }
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || "Login failed"));
    }
  };

  const signInWithGoogle = async () => {
    dispatch(loginStart());
    try {
      const result = await signInWithPopup(auth, provider);
      const tempUsername =
        result.user.displayName.split(" ").join("").toLowerCase() +
        Math.floor(Math.random() * 90 + 10);

      const res = await api.post(`/auth/google`, {
        name: result.user.displayName,
        username: tempUsername,
        email: result.user.email,
        img: result.user.photoURL,
      });

      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err) {
      dispatch(
        loginFailure(err.response?.data?.message || "Google Sign-in failed")
      );
    }
  };

  return (
    <Container>
      {/* ERROR ALERT POPUP */}
      {error && <ToastNotification type="error" message={error} />}

      <Wrapper>
        <Title>Welcome Back</Title>
        <SubTitle>Log in to your account</SubTitle>

        <Input
          placeholder="Username or Email"
          onChange={(e) => {
            setUnameOrEmail(e.target.value);
            if (error) dispatch(loginFailure(null));
          }}
        />
        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) dispatch(loginFailure(null));
          }}
        />

        <Button onClick={handleLogin} disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </Button>

        

        <Link
          to="/signup"
          style={{
            textDecoration: "none",
            color: "#0077ff",
            fontWeight: "600",
            marginTop: "10px",
          }}
        >
          Don't have an account? Create one
        </Link>
      </Wrapper>

      <More>
        English(USA)
        <Links>
          <LinkIt>Help</LinkIt>
          <LinkIt>Privacy</LinkIt>
          <LinkIt>Terms</LinkIt>
        </Links>
      </More>
    </Container>
  );
};

export default SignIn;
