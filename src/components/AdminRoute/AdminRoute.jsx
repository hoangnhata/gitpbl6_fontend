import React from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "../../hooks/useAdmin";
import { Alert, Container } from "@mui/material";

const AdminRoute = ({ children }) => {
  const { isAdmin } = useAdmin();

  if (!isAdmin) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Access denied. Admin privileges required.
        </Alert>
      </Container>
    );
  }

  return children;
};

export default AdminRoute;

