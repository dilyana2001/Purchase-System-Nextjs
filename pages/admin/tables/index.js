import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import DeckIcon from "@mui/icons-material/Deck";
import CircularProgress from '@mui/material/CircularProgress';
import enums from "utils/enums";
import api from "utils/api";
import Middleware from "components/Layout/Middleware";
import { useAppContext } from "context/AppContext";
import useNotify from 'hooks/useNotify';
import config from "styles/config";

const styles = {
  grid: {
    loading: {
      textAlign: "center",
      marginTop: "100px",
    },
    wrapper: {
      maxWidth: "500px",
      margin: "0 auto",
    },
    outsideWrapper: {
      p: "10px",
      textAlignLast: "center",
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      height: "280px",
    },
    insideWrapper: {
      p: "10px",
      textAlignLast: "center",
      display: "flex",
      flexWrap: "wrap",
    },
    innerWrapper: {
      margin: "15px",
      width: "54px",
      height: "53px",
    },
  },
  typography: {
    number: {
      fontSize: "12px",
      color: config.color.black,
      alignSelf: "center",
      width: "15px",
    },
  },
  button: {
    action: {
      display: "flex",
      flexDirection: "column",
      cursor: 'pointer',
      mx: '5px',
      background: config.color.black,
      '&:hover': {
        background: config.color.black,
      },
      fontSize: {
        xs: 10,
        sm: 14,
      },
    },
  },
};

const Tables = () => {
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [extendButtons, setExtendButtons] = useState(false);

  const router = useRouter();
  const notify = useNotify();

  const { numberOfTable, isAdmin } = useAppContext();

  const total = useMemo(() => items?.reduce((acc, o) => acc += o.quantity * Number(o.price), 0), [items]);

  const getLocalTableStyles = useCallback((number) => Number(numberOfTable) !== number ? 'none' : 'underline', [numberOfTable]);

  const getAllPurchases = useCallback(async () => {
    try {
      const token = localStorage.getItem(enums.config.storage.token);
      const response = await api.get("/api/user/purchases", {}, {}, token);
      setItems(response.data);
    } catch (err) {
      notify('Fetching failed!', { type: 'error' });
    } finally {
      setFetching(false);
    }
  }, [notify]);

  const getBill = useCallback((bill) => {
      const sum = 0;
      items?.filter((item) => item.numberOfTable === bill && (sum += item.quantity * Number(item.price)));

      return sum > 0 && `${sum.toFixed(2)} €`;
  }, [items]);


  const onDeleteAllPurchases = useCallback(async () => {
    const ifDelete = window.confirm("Are you sure want to delete the item/s?");
    if (ifDelete) {
      try {
        const token = localStorage.getItem(enums.config.storage.token);
        await api.remove(`/api/user/purchases`, {}, token);
        await api.update(`/api/admin/budget`, { total }, {}, token);
        router.push('/admin/tables');
        console.log(total);
        notify('Successfully deleted!', { type: 'success' });
      } catch (err) {
        notify('Deleting failed!', { type: 'error' });
      }
    }
  }, [total, router, notify]);

  useEffect(() => {
    getAllPurchases();
  }, [getAllPurchases]);

  useEffect(() => {
    if (!isAdmin) router.push("/");
  }, [getAllPurchases, isAdmin, router]);

  if (fetching) return <Grid sx={styles.grid.loading}><CircularProgress color="success" /></Grid>

  return (
    <Grid sx={styles.grid.wrapper}>
      <Typography sx={{ px: '10px' }}>Inside</Typography>
      <Grid sx={styles.grid.insideWrapper}>
        {Array.from(Array(15).keys()).map((number) => {
          const bill = getBill(number + 1);

          return (
            <Grid key={number + 1} sx={styles.grid.innerWrapper}>
              <Link
                href={`/admin/tables/${number + 1}`}
                sx={{ textDecoration: getLocalTableStyles(number + 1) }}
              >
                <Grid sx={{ display: 'flex' }}>
                  <Typography sx={styles.typography.number}>
                    {number + 1}
                  </Typography>
                  <TableRestaurantIcon
                    fontSize="large"
                    sx={{ color: isEmpty(bill) ? config.color.green : config.color.warning }}
                  />
                </Grid>
                <Typography 
                  sx={{ fontSize: '12px', color: isEmpty(bill) ? config.color.green : config.color.warning }}
                >
                  {bill}
                </Typography>
              </Link>
            </Grid>
          );
        })}
      </Grid>
      <Divider />
      <Typography sx={{ px: '10px' }}>Outside</Typography>
      <Grid sx={{ display: 'flex' }}>
        <Grid sx={styles.grid.insideWrapper}>
          {Array.from(Array(7).keys()).map((number) => {
            const bill = getBill(50 + number);

            return (
              <Grid key={50 + number} sx={styles.grid.innerWrapper}>
                <Link
                  href={`/admin/tables/${50 + number}`}
                  sx={{ textDecoration: getLocalTableStyles(50 + number) }}
                >
                  <Grid sx={{ display: 'flex' }}>
                    <Typography sx={styles.typography.number}>
                      {50 + number}
                    </Typography>
                    <DeckIcon
                      sx={{ color: isEmpty(bill) ? config.color.green : config.color.warning }}
                      fontSize="large"
                    />
                  </Grid>
                  <Typography
                    sx={{ fontSize: '12px', color: isEmpty(bill) ? config.color.green : config.color.warning }}
                  >
                    {bill}
                  </Typography>
                </Link>
              </Grid>
            );
          })}
        </Grid>

        <Grid sx={styles.grid.insideWrapper}>
          {Array.from(Array(7).keys()).map((number) => {
            const bill = getBill(60 + number);

            return (
              <Grid key={60 + number} sx={styles.grid.innerWrapper}>
                <Link
                  href={`/admin/tables/${60 + number}`}
                  sx={{ textDecoration: getLocalTableStyles(60 + number) }}
                >
                  <Grid sx={{ display: 'flex' }}>
                    <Typography sx={styles.typography.number}>
                      {60 + number}
                    </Typography>
                    <DeckIcon
                      sx={{ color: isEmpty(bill) ? config.color.green : config.color.warning }}
                      fontSize="large"
                    />
                  </Grid>
                  <Typography
                    sx={{ fontSize: '12px',  color: isEmpty(bill) ? config.color.green : config.color.warning }}
                  >
                    {getBill(60 + number)}
                  </Typography>
                </Link>
              </Grid>
            );
          })}
        </Grid>

        <Grid sx={styles.grid.insideWrapper}>
          {Array.from(Array(7).keys()).map((number) => {
            const bill = getBill(70 + number);

            return (
              <Grid key={70 + number} sx={styles.grid.innerWrapper}>
                <Link
                  href={`/admin/tables/${70 + number}`}
                  sx={{ textDecoration: getLocalTableStyles(70 + number) }}
                >
                  <Grid sx={{ display: 'flex' }}>
                    <Typography sx={styles.typography.number}>
                      {70 + number}
                    </Typography>
                    <DeckIcon
                      sx={{ color: isEmpty(bill) ? config.color.green : config.color.warning, }}
                      fontSize="large"
                    />
                  </Grid>
                  <Typography
                    sx={{ fontSize: '12px', color: isEmpty(bill) ? config.color.green : config.color.warning }}
                  >
                    {getBill(70 + number)}
                  </Typography>
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <Box sx={{ textAlign: 'end' }}>
          <IconButton
            onClick={() => setExtendButtons(!extendButtons)}
          >
            {extendButtons ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </Box>
      {extendButtons && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: '15px' }}>
          <Button
            variant="contained"
            sx={styles.button.action}
            onClick={onDeleteAllPurchases}
          >
            Delete all purchases
          </Button>
        </Box>
      )}
    </Grid>
  );
};

export default function Layout() {
  return <Tables />;
}

Layout.getLayout = function getLayout(page) {
  return <Middleware>{page}</Middleware>;
};
