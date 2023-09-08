import React, { Fragment, useCallback, useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Middleware from "components/Layout/Middleware";
import Typography from "@mui/material/Typography";
import { useAppContext } from "context/AppContext";
import PurchaseTemplate from "components/PurchaseTemplate";
import api from "utils/api";
import enums from "utils/enums";
import config from "styles/config";
import TableDashboard from "components/TableDashboard";
import useNotify from "hooks/useNotify";

const styles = {
  typography: {
    info: {
      m: "10px 20px",
      fontWeight: "700",
      color: config.color.black,
      fontSize: "20px",
    },
    title: {
      m: "10px",
      fontWeight: "700",
      color: config.color.warning,
      fontSize: "20px",
    },
  },
  button: {
    print: {
      ml: "20px",
      my: "5px",
      background: config.color.secondary,
      "&:hover": {
        background: config.color.darkerSecondary,
      },
    },
    delete: {
      ml: "20px",
      my: "5px",
      background: config.color.warning,
      "&:hover": {
        background: config.color.darkerWarning,
      },
    },
    move: {
      background: config.color.green,
      ml: "-15px",
      "&:hover": {
        background: config.color.darkerGreen,
      },
    },
  },
};

const NumberTable = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [orderChange, setOrderChange] = useState(false);
  const [load, setLoad] = useState(false);
  const [checked, setChecked] = useState([]);
  const [bill, setBill] = useState(0);
  const { numberOfTable } = useAppContext();
  const notify = useNotify();

  const deleteTableHandler = useCallback(async () => {
    const ifDelete = window.confirm('Are u sure you want to delete the item/s?');
    if (ifDelete) {
      try {
        const token = localStorage.getItem(enums.config.storage.token);
        await api.remove(`/api/user/purchases/table/number/${numberOfTable}`, {}, token);
        setItems([]);
        notify('Successfully deleted!', { type: 'success' });
      } catch (err) {
        notify('Deleting failed!', { type: 'error' });
      }
    }
  }, [numberOfTable, notify]);

  const onDelete = useCallback(async (id) => {
    const ifDelete = window.confirm('Are u sure?');
    if (ifDelete) {
      try {
        const token = localStorage.getItem(enums.config.storage.token);
        await api.remove(`/api/user/purchases/${id}`, {}, token);
        setItems(items.filter((item) => item._id !== id));
        notify('Successfully deleted!', { type: 'success' });
      } catch (err) {
        notify('Deleting failed!', { type: 'error' });
      }
    }
  }, [items, notify]);

  const onCheck = useCallback((id) => {
    setChecked((current) => {
      if (!current.includes(id)) {
        return [...current, id];
      } else {
        return current.filter((el) => el !== id);
      }
    });
  }, []);

  const getPurchaseByTable = useCallback(async () => {
    if (isEmpty(numberOfTable)) return;
    try {
      const token = localStorage.getItem(enums.config.storage.token);
      const response = await api.get(`/api/user/purchases/table/${numberOfTable}`, {}, {}, token);
      setItems(response.data);
      notify('Successfully fetched!', { type: 'success' });
    } catch (err) {
      notify('Fetching failed!', { type: 'error' });
    }
  }, [numberOfTable, notify]);

  const getBill = useCallback(() =>
    setBill(items.reduce((o, item) => (o += Number(item.quantity) * Number(item.price)),0)
  ), [items]);

  const getOrderChange = useCallback((boolean) => {
    setOrderChange(boolean);
  }, []);

  const getLoaderChange = useCallback((boolean) => {
    setLoad(boolean);
  }, []);

  useEffect(() => {
    if (orderChange || load) getPurchaseByTable();
    setOrderChange(false);
    getLoaderChange(false);
  }, [orderChange, load, getLoaderChange, getPurchaseByTable]);

  useEffect(() => {
    getPurchaseByTable();
  }, [getPurchaseByTable]);

  useEffect(() => {
    getBill();
  }, [getBill]);

  return (
    <Grid>
      <Grid sx={{ mb: '20px' }}>
        <Box
          sx={{ mx: '10px', display: 'flex', justifyContent: 'space-between' }}
        >
          <Typography sx={styles.typography.title}>Table #{numberOfTable}</Typography>
        </Box>
        <Typography sx={styles.typography.info}>
          Sum: {bill.toFixed(2)} €
        </Typography>
      </Grid>
      <Grid>
        {items.length ? (
          <Fragment>
            <Grid sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="small"
                sx={styles.button.delete}
                onClick={() => deleteTableHandler()}
              >
                Delete
              </Button>
            </Grid>
            <Grid sx={{ mt: '20px', textAlign: '-webkit-center' }}>
              {items
                .sort((a, b) => a.orderPurchase - b.orderPurchase)
                .sort((a, b) => b.isKitchen - a.isKitchen)
                .map((item) => (
                  <PurchaseTemplate
                    key={item._id}
                    checked={checked.includes(item)}
                    data={item}
                    onDelete={onDelete}
                    orderChange={getOrderChange}
                    onCheck={onCheck}
                  />
                ))}
            </Grid>
          </Fragment>
        ) : (
          <Typography sx={styles.typography.info}>No orders</Typography>
        )}
      </Grid>
      <Grid>
        {open && (
          <TableDashboard
            handleClose={() => setOpen(false)}
            open={open}
            onMove={onMove}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default function Layout() {
  return <NumberTable />;
}

Layout.getLayout = function getLayout(page) {
  return <Middleware>{page}</Middleware>;
};
