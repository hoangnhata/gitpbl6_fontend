import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Button, Container } from "@mui/material";
import { styled } from "@mui/material/styles";

const ErrorContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  textAlign: "center",
  padding: theme.spacing(4),
}));

const ErrorTitle = styled(Typography)(({ theme }) => ({
  color: "#FFD700",
  fontWeight: 800,
  marginBottom: theme.spacing(2),
  fontSize: "2.5rem",
}));

const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: "rgba(255,255,255,0.8)",
  marginBottom: theme.spacing(4),
  maxWidth: 600,
  lineHeight: 1.6,
}));

const RetryButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
  color: "#000",
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  borderRadius: 8,
  "&:hover": {
    background: "linear-gradient(135deg, #FFEE60 0%, #FFB84D 100%)",
  },
}));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error to console in development
    if (
      typeof window !== "undefined" &&
      window.location.hostname === "localhost"
    ) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle variant="h2">Oops! Có lỗi xảy ra</ErrorTitle>
          <ErrorMessage variant="body1">
            Chúng tôi đang gặp một số vấn đề kỹ thuật. Vui lòng thử lại sau hoặc
            liên hệ với chúng tôi nếu vấn đề vẫn tiếp tục.
          </ErrorMessage>
          <RetryButton onClick={this.handleRetry}>Thử lại</RetryButton>
          {typeof window !== "undefined" &&
            window.location.hostname === "localhost" &&
            this.state.error && (
              <Box
                sx={{
                  mt: 4,
                  p: 2,
                  background: "rgba(255,0,0,0.1)",
                  borderRadius: 1,
                  maxWidth: "100%",
                  overflow: "auto",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#ff6b6b", fontFamily: "monospace" }}
                >
                  {this.state.error.toString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#ff6b6b", fontFamily: "monospace", mt: 1 }}
                >
                  {this.state.errorInfo.componentStack}
                </Typography>
              </Box>
            )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
