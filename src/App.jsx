// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";
// components
import ErrorBoundary from "./components/ErrorBoundary";
// context
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
