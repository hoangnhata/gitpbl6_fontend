import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Eye, EyeSlash, GoogleLogo, FacebookLogo } from "@phosphor-icons/react";
import MovieIcon from "@mui/icons-material/Movie";

/* =========================================================================
   NỀN TỔNG & CARD CHUNG (để panel register nối liền với grid poster)
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
  "&::-webkit-scrollbar": {
    display: "none",
  },
  scrollbarWidth: "none",
  msOverflowStyle: "none",
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
   PANEL TRÁI (REGISTER) - TONE ĐEN VÀNG
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
  overflow: "hidden",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(3),
    minHeight: "100vh",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "0px",
      background: "transparent",
    },
  },
}));

const RegisterCard = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: 460,
  padding: theme.spacing(5),
  borderRadius: 20,
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(14px)",
  boxShadow: "0 25px 50px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.05)",
  maxHeight: "100vh",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    width: "6px",
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(255,215,0,0.3)",
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "rgba(255,215,0,0.5)",
  },
  scrollbarWidth: "thin",
  scrollbarColor: "rgba(255,215,0,0.3) transparent",
  [theme.breakpoints.down("md")]: {
    maxWidth: "100%",
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    maxHeight: "95vh",
  },
}));

const LogoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2.5),
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
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    transition: "all .25s ease",
    "&:hover": { borderColor: "#FFD70066" },
    "&.Mui-focused": {
      borderColor: "#FFD70099",
      boxShadow: "0 0 0 2px rgba(255,215,0,.15)",
    },
    "& fieldset": { border: "none" },
    "& input": {
      color: "#FFD700",
      fontWeight: 600,
      "&::placeholder": { color: "rgba(255,215,0,.5)" },
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,215,0,.6)",
    "&.Mui-focused": { color: "#FFD700" },
  },
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

const StyledCheckbox = styled(FormControlLabel)(() => ({
  "& .MuiFormControlLabel-label": {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "0.9rem",
  },
  "& .MuiCheckbox-root": {
    color: "rgba(255, 255, 255, 0.5)",
    "&.Mui-checked": {
      color: "#FFD700",
    },
  },
}));

// Bọc MainCard bằng GoldWrapper
const GoldWrapper = styled(Box)(() => ({
  width: "100vw",
  height: "100vh",
  background: "linear-gradient(135deg,#FFD700,#FFA500)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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
export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [success, setSuccess] = useState("");

  // 12 poster demo với hình ảnh đã kiểm tra
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

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Vui lòng nhập username");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Vui lòng nhập email");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Email không hợp lệ");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return false;
    }
    if (!agreeToTerms) {
      setError("Vui lòng đồng ý với điều khoản sử dụng");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const API_BASE_URL = import.meta.env.VITE_API_URL || "";
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          data?.message ||
          data?.detail ||
          "Đăng ký thất bại. Vui lòng thử lại.";
        setError(message);
        return;
      }

      setSuccess("Đăng ký thành công! Chuyển đến trang đăng nhập...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError("Không thể kết nối máy chủ. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    console.log("Register with:", provider);
  };

  return (
    <Screen>
      <GoldWrapper>
        <MainCard elevation={0}>
          {/* LEFT: REGISTER */}
          <LeftPanel>
            <RegisterCard>
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
                  fontSize: "1.8rem",
                  background: "linear-gradient(135deg, #FFD700, #FFA500)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Đăng ký
              </Typography>

              <Typography
                sx={{
                  color: "rgba(255,255,255,.75)",
                  mb: 2.5,
                  fontSize: "0.95rem",
                }}
              >
                Tạo tài khoản để trải nghiệm tốt nhất
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
              {success && (
                <Alert
                  severity="success"
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    background: "rgba(0,255,0,.06)",
                    color: "#fff",
                    border: "1px solid rgba(0,255,0,0.2)",
                  }}
                >
                  {success}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <StyledTextField
                    fullWidth
                    label="Username"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên của bạn"
                    required
                  />

                  <StyledTextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email của bạn"
                    required
                  />

                  <StyledTextField
                    fullWidth
                    label="Mật khẩu"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
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

                  <StyledTextField
                    fullWidth
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword((s) => !s)}
                            edge="end"
                            sx={{ color: "rgba(255,255,255,.8)" }}
                          >
                            {showConfirmPassword ? (
                              <EyeSlash size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <StyledCheckbox
                    control={
                      <Checkbox
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        Tôi đồng ý với{" "}
                        <Link
                          href="#"
                          sx={{
                            color: "#FFD700",
                            textDecoration: "none",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Điều khoản sử dụng
                        </Link>{" "}
                        và{" "}
                        <Link
                          href="#"
                          sx={{
                            color: "#FFD700",
                            textDecoration: "none",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Chính sách bảo mật
                        </Link>
                      </Typography>
                    }
                  />

                  <PrimaryButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={22} sx={{ color: "#000" }} />
                    ) : (
                      "Đăng ký"
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
                  onClick={() => handleSocialRegister("Google")}
                >
                  Đăng ký với Google
                </SocialButton>
                <SocialButton
                  fullWidth
                  startIcon={<FacebookLogo size={18} />}
                  onClick={() => handleSocialRegister("Facebook")}
                >
                  Đăng ký với Facebook
                </SocialButton>
              </Stack>

              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  Đã có tài khoản?{" "}
                  <Link
                    component={RouterLink}
                    to="/login"
                    sx={{
                      color: "#FFD700",
                      textDecoration: "none",
                      fontWeight: 600,
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Đăng nhập ngay
                  </Link>
                </Typography>
              </Box>
            </RegisterCard>
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
