import { memo } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
  keyframes,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MovieIcon from "@mui/icons-material/Movie";

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FooterContainer = styled(Box)(({ theme }) => ({
  background: "linear-gradient(180deg, rgba(0,0,0,0.95) 0%, #000 100%)",
  padding: theme.spacing(6, 0, 3),
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    background:
      "linear-gradient(90deg, transparent 0%, #FFD700 50%, transparent 100%)",
  },
}));

const Logo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  "& .logo-icon": {
    width: 40,
    height: 40,
    borderRadius: "10px",
    background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
    display: "grid",
    placeItems: "center",
    color: "#000",
    "& .MuiSvgIcon-root": {
      fontSize: "1.5rem",
    },
  },
  "& .main-text": {
    color: "#fff",
    fontSize: "1.5rem",
    fontWeight: 900,
    background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
}));

const FooterTitle = styled(Typography)(() => ({
  color: "#fff",
  fontSize: "1.2rem",
  fontWeight: 700,
  marginBottom: "1rem",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: 0,
    width: 30,
    height: 2,
    background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
    borderRadius: 1,
  },
}));

const FooterLink = styled(Link)(() => ({
  color: "rgba(255,255,255,0.7)",
  textDecoration: "none",
  display: "block",
  padding: "0.5rem 0",
  transition: "all 0.3s ease",
  "&:hover": {
    color: "#FFD700",
    paddingLeft: "0.5rem",
  },
}));

const SocialButton = styled(IconButton)(() => ({
  color: "rgba(255,255,255,0.7)",
  border: "1px solid rgba(255,255,255,0.2)",
  margin: "0.25rem",
  transition: "all 0.3s ease",
  "&:hover": {
    color: "#FFD700",
    borderColor: "rgba(255,215,0,0.5)",
    background: "rgba(255,215,0,0.1)",
    transform: "translateY(-2px)",
  },
}));

const ContactInfo = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  color: "rgba(255,255,255,0.7)",
  marginBottom: "0.75rem",
  "& .MuiSvgIcon-root": {
    color: "#FFD700",
    fontSize: "1.2rem",
  },
}));

const Copyright = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  paddingTop: theme.spacing(3),
  borderTop: "1px solid rgba(255,255,255,0.1)",
  textAlign: "center",
  color: "rgba(255,255,255,0.6)",
}));

const Footer = memo(() => {
  const footerSections = [
    {
      title: "Phim & Series",
      links: [
        { label: "Phim Mới", href: "#" },
        { label: "Phim Hot", href: "#" },
        { label: "Phim Lẻ", href: "#" },
        { label: "Phim Bộ", href: "#" },
        { label: "Anime", href: "#" },
        { label: "Phim Việt Nam", href: "#" },
      ],
    },
    {
      title: "Thể Loại",
      links: [
        { label: "Hành Động", href: "#" },
        { label: "Tình Cảm", href: "#" },
        { label: "Hài Hước", href: "#" },
        { label: "Kinh Dị", href: "#" },
        { label: "Khoa Học Viễn Tưởng", href: "#" },
        { label: "Tài Liệu", href: "#" },
      ],
    },
    {
      title: "Hỗ Trợ",
      links: [
        { label: "Trung Tâm Trợ Giúp", href: "#" },
        { label: "Liên Hệ", href: "#" },
        { label: "Báo Lỗi", href: "#" },
        { label: "Góp Ý", href: "#" },
        { label: "Điều Khoản Sử Dụng", href: "#" },
        { label: "Chính Sách Bảo Mật", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, href: "#", label: "Facebook" },
    { icon: <TwitterIcon />, href: "#", label: "Twitter" },
    { icon: <InstagramIcon />, href: "#", label: "Instagram" },
    { icon: <YouTubeIcon />, href: "#", label: "YouTube" },
  ];

  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo & Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ animation: `${fadeInUp} 0.8s ease-out` }}>
              <Logo>
                <div className="logo-icon">
                  <MovieIcon />
                </div>
                <div className="main-text">PhimNhaLam</div>
              </Logo>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.6,
                  marginBottom: 2,
                }}
              >
                Nền tảng xem phim trực tuyến hàng đầu Việt Nam. Khám phá hàng
                nghìn bộ phim chất lượng cao với trải nghiệm xem tuyệt vời.
              </Typography>

              {/* Social Links */}
              <Box>
                {socialLinks.map((social, index) => (
                  <SocialButton
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    size="small"
                  >
                    {social.icon}
                  </SocialButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Footer Sections */}
          {footerSections.map((section, sectionIndex) => (
            <Grid item xs={12} sm={6} md={2.67} key={sectionIndex}>
              <Box
                sx={{
                  animation: `${fadeInUp} 0.8s ease-out ${
                    (sectionIndex + 1) * 0.1
                  }s both`,
                }}
              >
                <FooterTitle variant="h6">{section.title}</FooterTitle>
                {section.links.map((link, linkIndex) => (
                  <FooterLink key={linkIndex} href={link.href} variant="body2">
                    {link.label}
                  </FooterLink>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ animation: `${fadeInUp} 0.8s ease-out 0.4s both` }}>
              <FooterTitle variant="h6">Liên Hệ</FooterTitle>

              <ContactInfo>
                <EmailIcon />
                <Typography variant="body2">support@phimnhalam.com</Typography>
              </ContactInfo>

              <ContactInfo>
                <PhoneIcon />
                <Typography variant="body2">+84 123 456 789</Typography>
              </ContactInfo>

              <ContactInfo>
                <LocationOnIcon />
                <Typography variant="body2">Hà Nội, Việt Nam</Typography>
              </ContactInfo>

              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    lineHeight: 1.6,
                  }}
                >
                  Thời gian hỗ trợ: 24/7
                  <br />
                  Phản hồi trong vòng 2 giờ
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Copyright>
          <Typography variant="body2">
            © 2024 PhimNhaLam. Tất cả quyền được bảo lưu. Phát triển bởi đội ngũ
            yêu phim Việt Nam.
          </Typography>
        </Copyright>
      </Container>
    </FooterContainer>
  );
});

Footer.displayName = "Footer";

export default Footer;
