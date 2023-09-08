import React, { useCallback } from "react";
import Link from "next/link";
import BottomNavigation from "@mui/material/BottomNavigation";
import { useAppContext } from "context/AppContext";
import config from "styles/config";
import Box from "@mui/material/Box";
import api from "utils/api";
import useNotify from 'hooks/useNotify';

const styles = {
  footer: {
    wrapper: {
      backgroundColor: config.color.white,
      color: config.color.black,
      fontWeight: "700",
      textTransform: "capitalize",
      alignItems: "center",
    },
  },
  box: {
    text: {
      cursor: 'pointer',
    },
  }
};

const Footer = () => {
  const { isAuthenticated, login } = useAppContext();
  const notify = useNotify();

  const onLogout = useCallback(async () => {
    try {
      const response = await api.get("/api/auth/signout");
      if (response.data.message !== "Logout") return alert("Something went wrong!");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("userId");
      localStorage.removeItem("isAdmin");
      login(null);
    } catch (err) {
      notify('Logout failed!', { type: 'error' });
    }
  }, [login, notify]);

  return (
    <BottomNavigation
      sx={styles.footer.wrapper}
    >
      {!isAuthenticated ? (
        <Link href="/login">
          <Box sx={styles.box.text}>
            Login
          </Box>
        </Link>
      ) : (
        <Link href="/">
          <Box sx={styles.box.text} onClick={onLogout}>
            Logout
          </Box>
        </Link>
      )}
    </BottomNavigation>
  );
};

export default Footer;
