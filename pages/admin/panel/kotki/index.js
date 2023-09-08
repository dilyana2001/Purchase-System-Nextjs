import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Middleware from "components/Layout/Middleware";
import useNotify from 'hooks/useNotify';
import api from "utils/api";
import enums from "utils/enums";

const Budget = () => {
  const [data, setData] = useState([]);
  const notify = useNotify();

  const getData = useCallback(async () => {
    try {
      const token = localStorage.getItem(enums.config.storage.token);
      const response = await api.get(`/api/admin/budget`, {}, {}, token);
      setData(response.data);
    } catch (err) {
      notify('Reseting failed!', { type: 'error' });
    }
  }, [notify]);

  const onReset = useCallback(async () => {
    try {
      const token = localStorage.getItem(enums.config.storage.token);
      await api.remove(`/api/admin/budget`, {}, token);
      notify('Successfully reset!', { type: 'success' });
    } catch (err) {
      notify('Reseting failed!', { type: 'error' });
    } finally {
      getData();
    }
  }, [getData, notify]);

  useEffect(() => {
    getData();
  }, [getData]);

    return (
      <Box>
        {data?.map((el) => (
        <Typography
          key={el?.total}
          sx={{ m: '10px' }}
        >
          {el?.total?.toFixed(2)}
        </Typography>
        ))}
        <Button
          variant="contained"
          onClick={onReset}
          sx={{ mx: '10px'}}
        >
          Reset
        </Button>
      </Box>
  );
};

export default function Layout() {
  return <Budget />;
}

Layout.getLayout = function getLayout(page) {
  return <Middleware>{page}</Middleware>;
};
