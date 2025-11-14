import { useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Eye, EyeSlash, GoogleLogo, FacebookLogo } from "@phosphor-icons/react";
import MovieIcon from "@mui/icons-material/Movie";

/* =========================================================================
   NỀN TỔNG & CARD CHUNG (để panel login nối liền với grid poster)
   ========================================================================= */
const Screen = styled("div")(() => ({
  position: "fixed",
  inset: 0,
  background:
    "radial-gradient(1100px 600px at -10% 110%, rgba(255,215,0,.08), transparent 50%), radial-gradient(900px 500px at 110% -10%, rgba(255,165,0,.08), transparent 50%), linear-gradient(135deg, #0b0b0b 0%, #121212 50%, #1d1d1d 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
}));

const MainCard = styled(Paper)(({ theme }) => ({
  width: "100vw",
  height: "100vh",
  borderRadius: 0,
  overflow: "hidden",
  display: "grid",
  gridTemplateColumns: "45% 55%",
  background: "transparent",
  boxShadow: "none",
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
    height: "100vh",
  },
}));

/* =========================================================================
   PANEL TRÁI (LOGIN) - TONE ĐEN VÀNG
   ========================================================================= */
const LeftPanel = styled("div")(({ theme }) => ({
  background:
    "linear-gradient(180deg, rgba(18,18,18,1) 0%, rgba(14,14,14,1) 100%)",
  color: "#fff",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(6),
  overflow: "auto",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(3),
    minHeight: "100vh",
  },
}));

const LoginCard = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: 460,
  padding: theme.spacing(5),
  borderRadius: 20,
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(14px)",
  boxShadow: "0 25px 50px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.05)",
  [theme.breakpoints.down("md")]: {
    maxWidth: "100%",
    padding: theme.spacing(3),
    margin: theme.spacing(2),
  },
}));

const LogoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(3),
  "& .logo": {
    width: 56,
    height: 56,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    color: "#000",
    fontWeight: 800,
    background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
    boxShadow: "0 10px 24px rgba(255,215,0,.4)",
    [theme.breakpoints.down("md")]: {
      width: 48,
      height: 48,
    },
  },
  "& .brand": {
    fontWeight: 900,
    fontSize: "1.9rem",
    letterSpacing: "-.3px",
    background: "linear-gradient(135deg, #FFD700, #FFA500)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    [theme.breakpoints.down("md")]: {
      fontSize: "1.6rem",
    },
  },
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 16,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)", // viền xám nhẹ
    color: "#fff",
    transition: "all .25s ease",
    "&:hover": { borderColor: "#FFD70066" }, // hover vàng nhạt
    "&.Mui-focused": {
      borderColor: "#FFD70099",
      boxShadow: "0 0 0 2px rgba(255,215,0,.15)",
    },
    "& fieldset": { border: "none" },
    "& input": {
      color: "#FFD700", // chữ vàng
      fontWeight: 600,
      "&::placeholder": { color: "rgba(255,215,0,.5)" },
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,215,0,.6)",
    "&.Mui-focused": { color: "#FFD700" },
  },
}));

// Bọc MainCard bằng GoldWrapper
const GoldWrapper = styled(Box)(() => ({
  width: "100vw",
  height: "100vh",
  background: "linear-gradient(135deg,#FFD700,#FFA500)", // vàng -> cam
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const PrimaryButton = styled(Button)(() => ({
  borderRadius: 16,
  padding: "12px 18px",
  fontSize: "1.05rem",
  fontWeight: 800,
  textTransform: "none",
  background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
  color: "#000",
  boxShadow: "none",
  transition: "all .25s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)",
    boxShadow: "0 12px 28px rgba(255,215,0,.35)",
    transform: "translateY(-2px)",
  },
}));

const SocialButton = styled(Button)(() => ({
  borderRadius: 16,
  padding: "10px 16px",
  textTransform: "none",
  fontWeight: 700,
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  border: "1px solid rgba(255,215,0,0.25)",
  transition: "all .25s ease",
  "&:hover": {
    background: "rgba(255,255,255,0.1)",
    borderColor: "#FFD700",
    transform: "translateY(-2px)",
    boxShadow: "0 10px 20px rgba(0,0,0,.25)",
  },
}));

/* =========================================================================
   PANEL PHẢI (LƯỚI POSTER)
   ========================================================================= */
const RightPanel = styled("div")(({ theme }) => ({
  position: "relative",
  background: "linear-gradient(135deg, #0d0d0d 0%, #151515 100%)",
  [theme.breakpoints.down("md")]: { display: "none" },
}));

const PostersGrid = styled("div")(() => ({
  position: "absolute",
  inset: 0,
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridTemplateRows: "repeat(4, 1fr)",
  gap: 12,
  padding: 16,
  boxSizing: "border-box",
}));

const PosterItem = styled("div")(({ src }) => ({
  borderRadius: 12,
  overflow: "hidden",
  backgroundImage: `url(${src})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  boxShadow: "0 10px 24px rgba(0,0,0,.45)",
  transition: "transform .28s ease, box-shadow .28s ease",
  aspectRatio: "3 / 4",
  position: "relative",
  width: "100%",
  height: "100%",
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,.36), rgba(0,0,0,.0) 40%)",
  },
  "&:hover": {
    transform: "translateY(-3px) scale(1.03)",
    boxShadow: "0 16px 36px rgba(0,0,0,.55)",
  },
}));

/* =========================================================================
   COMPONENT CHÍNH
   ========================================================================= */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();

  const posters = [
    "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg", // Avatar
    "https://upload.wikimedia.org/wikipedia/vi/thumb/b/b0/Avatar-Teaser-Poster.jpg/250px-Avatar-Teaser-Poster.jpg", // Oppenheimer
    "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg", // Top Gun Maverick
    "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", // Inception
    "https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg", // Wonder Woman
    "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg", // Infinity War
    "https://image.tmdb.org/t/p/w500/lyQBXzOQSuE59IsHyhrp0qIiPAz.jpg", // Dune
    "https://image.tmdb.org/t/p/w500/3WfvjNWr5k1Zzww81b3GWc8KQhb.jpg", // LOTR
    "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg", // Coraline
    "https://image.tmdb.org/t/p/w500/1EAxNqdkVnp48a7NUuNBHGflowM.jpg", // Argo
    "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg", // Oblivion
    "https://d1j8r0kxyu9tj8.cloudfront.net/images/1566809340Y397jnilYDd15KN.jpg", // The Offering
  ];

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const API_BASE_URL = import.meta.env.VITE_API_URL || ""; // use proxy by default

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          data?.message || data?.detail || "Username hoặc mật khẩu không đúng";
        setError(message);
        return;
      }

      if (data?.token && data?.user) {
        login(data.user, data.token);
        // Redirect to the page user was trying to access, or home
        const from = location.state?.from || "/";
        navigate(from, { replace: true });
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Không thể kết nối máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log("Login with:", provider);
  };

  return (
    <Screen>
      <GoldWrapper>
        <MainCard elevation={0}>
          {/* LEFT: LOGIN */}
          <LeftPanel>
            <LoginCard>
              <LogoRow>
                <div className="logo">
                  <MovieIcon sx={{ fontSize: 30 }} />
                </div>
                <div className="brand">PhimNhaLam</div>
              </LogoRow>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  background: "linear-gradient(135deg, #FFD700, #FFA500)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Đăng nhập
              </Typography>

              <Typography sx={{ color: "rgba(255,255,255,.75)", mb: 3 }}>
                Nếu bạn chưa có tài khoản,&nbsp;
                <Link
                  component={RouterLink}
                  to="/register"
                  sx={{
                    color: "#FFD700",
                    textDecoration: "none",
                    fontWeight: 700,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  đăng ký ngay
                </Link>
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    background: "rgba(255,0,0,.06)",
                    color: "#fff",
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <StyledTextField
                    fullWidth
                    label="Username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Nhập username của bạn"
                    required
                  />

                  <StyledTextField
                    fullWidth
                    label="Mật khẩu"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((s) => !s)}
                            edge="end"
                            sx={{ color: "rgba(255,255,255,.8)" }}
                          >
                            {showPassword ? (
                              <EyeSlash size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box sx={{ textAlign: "right" }}>
                    <Link
                      component={RouterLink}
                      to="/forgot-password"
                      sx={{
                        color: "#FFD700",
                        textDecoration: "none",
                        fontSize: ".95rem",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      Quên mật khẩu?
                    </Link>
                  </Box>

                  <PrimaryButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={22} sx={{ color: "#000" }} />
                    ) : (
                      "Đăng nhập"
                    )}
                  </PrimaryButton>
                </Stack>
              </Box>

              <Divider
                sx={{
                  my: 3,
                  borderColor: "rgba(255,215,0,0.18)",
                  "&::before,&::after": { borderColor: "rgba(255,215,0,0.18)" },
                }}
              >
                <Typography sx={{ color: "rgba(255,255,255,.65)" }}>
                  hoặc
                </Typography>
              </Divider>

              <Stack spacing={1.5}>
                <SocialButton
                  fullWidth
                  startIcon={<GoogleLogo size={18} />}
                  onClick={() => handleSocialLogin("Google")}
                >
                  Đăng nhập với Google
                </SocialButton>
                <SocialButton
                  fullWidth
                  startIcon={<FacebookLogo size={18} />}
                  onClick={() => handleSocialLogin("Facebook")}
                >
                  Đăng nhập với Facebook
                </SocialButton>
              </Stack>
            </LoginCard>
          </LeftPanel>

          {/* RIGHT: POSTERS */}
          <RightPanel>
            <PostersGrid>
              {posters.map((src, idx) => (
                <PosterItem key={idx} src={src} />
              ))}
            </PostersGrid>
          </RightPanel>
        </MainCard>
      </GoldWrapper>
    </Screen>
  );
}
