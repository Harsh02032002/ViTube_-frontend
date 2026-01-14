import api from "../utils/api";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { SIZES, SPACING } from "../constants";
import { signupStart, signupSuccess, signupFailure } from "../redux/userSlice";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import ToastNotification from "../components/ToastNotification";
import { FcGoogle } from "react-icons/fc";

/* ================= PREMIUM STYLES ================= */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px);
  padding: 20px 0;
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft + "30"};
  padding: 40px 50px;
  gap: 15px;
  border-radius: 30px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 420px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  margin-bottom: -5px;
`;

const SubTitle = styled.h2`
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-bottom: 10px;
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  padding: 14px;
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
  margin-top: 5px;

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

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.user);

  useEffect(() => {
    return () => {
      dispatch(signupFailure(null));
    };
  }, [dispatch]);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const signInWithGoogle = async () => {
    dispatch(signupStart());
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

      dispatch(signupSuccess(res.data));
      navigate("/");
    } catch (err) {
      dispatch(
        signupFailure(err?.response?.data?.message || "Google sign-in failed")
      );
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !username || !email || !password) {
      dispatch(signupFailure("Please fill all fields"));
      return;
    }
    if (!isValidEmail(email)) {
      dispatch(signupFailure("Invalid email format"));
      return;
    }

    dispatch(signupStart());
    try {
      const defaultImg =
        "https://uploads.commoninja.com/searchengine/wordpress/adorable-avatars.png";
      const response = await api.post(`/auth/signup`, {
        name,
        username,
        email,
        img: defaultImg,
        password,
      });

      if (response.status === 201) {
        setMsg(response.data.message);
        dispatch(signupSuccess(null));
      }
    } catch (err) {
      dispatch(signupFailure(err?.response?.data?.message || "Signup failed"));
    }
  };

  return (
    <Container>
      {error && <ToastNotification type="error" message={error} />}
      {msg && <ToastNotification type="success" message={msg} />}

      <Wrapper>
        <Title>Create Account</Title>
        <SubTitle>Join the community today</SubTitle>

        <Input
          placeholder="Full Name"
          onChange={(e) => {
            setName(e.target.value);
            dispatch(signupFailure(null));
          }}
        />
        <Input
          placeholder="Username"
          onChange={(e) => {
            setUsername(e.target.value);
            dispatch(signupFailure(null));
          }}
        />
        <Input
          placeholder="Email Address"
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
            dispatch(signupFailure(null));
          }}
        />
        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
            dispatch(signupFailure(null));
          }}
        />

        <Button onClick={handleSignup} disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>

        

        <Link
          to="/signin"
          style={{
            textDecoration: "none",
            color: "#0077ff",
            fontWeight: "600",
            marginTop: "10px",
          }}
        >
          Already have an account? Login
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

export default SignUp;
