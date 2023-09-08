import React, { useCallback } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useAppContext } from "context/AppContext";
import LoggedPage from "components/Layout/Logged";
import errors from "utils/errors";
import enums from "utils/enums";
import api from "utils/api";
import useNotify from "hooks/useNotify";

const Login = () => {
  const { login } = useAppContext();
  const router = useRouter();
  const notify = useNotify();

  const onSubmitHandler = useCallback(async (e) => {
    e.preventDefault();
    const { target: { username, password } } = e;
    try { 
        const token = localStorage.getItem(enums.config.storage.token);
        const response = await api.create(`/api/auth/login`, {
          username: username.value,
          password: password.value,
        }, {}, token);
        const { data } = response;
        if (!data.token) return alert(data.massage || errors.error[500]);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userId', data._id);
        localStorage.setItem('isAdmin', data.isAdmin);
        login({
          token: data.token,
          username: data.username,
          userId: data._id,
          isAdmin: data.isAdmin,
        });
        router.push('/');
      } catch (err) {
        notify('Login failed!', { type: 'error' });
      }
  }, [login, notify, router]);

  return (
    <Box sx={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <form
        style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={onSubmitHandler}
      >
        <TextField
          sx={{ margin: '5px' }}
          label="Username"
          type="text"
          name="username"
        />
        <TextField
          sx={{ margin: '5px' }}
          label="Password"
          type="password"
          name="password"
        />
        <Box>
          <Button type="submit" variant="outlined">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default function LoginPage() {
  const { isAuthenticated } = useAppContext();
  if (isAuthenticated) return <LoggedPage />;

  return <Login />;
}
