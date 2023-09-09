import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginpage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import ChatPage from "scenes/chatPage";
function App() {
  const isAuth = Boolean(useSelector((state) => state.token)) // might need to make this more secure

  const mode = useSelector((state) => state.mode); // grab stuff from the store
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]) // sets up theme
  return (
    <div className="app">
      <BrowserRouter> { /*Setting up Routes */ }
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/home" element={isAuth ? <HomePage /> :  <Navigate to="/"/>} /> {/* So that if the user logs out, we redirect them to the login page*/}
              <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> :  <Navigate to="/"/>} />
              <Route path="/chat" element={isAuth ? <ChatPage /> :  <Navigate to="/"/>} />
            </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
