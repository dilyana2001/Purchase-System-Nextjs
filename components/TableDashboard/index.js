import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import isEmpty from "lodash/isEmpty";
import CloseIcon from "@mui/icons-material/Close";
import DeckIcon from "@mui/icons-material/Deck";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import useNotify from 'hooks/useNotify';
import api from "utils/api";
import enums from "utils/enums";
import config from "styles/config";

const styles = {
  grid: {
    wrapper: {
      maxWidth: "500px",
      margin: "20px auto",
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
      cursor: 'pointer',
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
};

const TableDashboard = ({ handleClose, open, onMove }) => {
  const [items, setItems] = useState([]);
  const notify = useNotify();

  const getAllPurchases = useCallback(async () => {
    try {
      const token = localStorage.getItem(enums.config.storage.token);
      const response = await api.get(`/api/user/purchases`, {}, {}, token);
      setItems(response.data);
    } catch (err) {
      notify('Fetching failed!', { type: 'error' });
    }
  }, [notify]);

  const getBill = useCallback((bill) => {
      const sum = 0;
      items?.filter((item) => item.numberOfTable === bill && (sum += item.quantity * item.price));

      return sum > 0 && `${sum.toFixed(2)} €`;
    }, [items]);

  useEffect(() => {
    getAllPurchases();
  }, [getAllPurchases]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          zIndex: 100000,
        }}
      >
        <CloseIcon />
      </IconButton>

      <Grid sx={styles.grid.wrapper}>
        <Grid sx={styles.grid.insideWrapper}>
          {Array.from(Array(15).keys()).map((number) => {
            const bill = getBill(number + 1);

            return (
              <Grid
                key={number + 1}
                sx={styles.grid.innerWrapper}
                onClick={() => onMove(number + 1)}
              >
                <Grid sx={{ display: "flex" }}>
                  <Typography sx={styles.typography.number}>
                    {number + 1}
                  </Typography>
                  <TableRestaurantIcon
                    sx={{
                      color: isEmpty(bill)
                        ? config.color.green
                        : config.color.warning,
                    }}
                    fontSize="large"
                  />
                </Grid>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: isEmpty(bill)
                      ? config.color.green
                      : config.color.warning,
                  }}
                >
                  {bill}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
        <Divider />

        <Grid sx={{ display: "flex" }}>
          <Grid sx={styles.grid.insideWrapper}>
            {Array.from(Array(7).keys()).map((number) => {
              const bill = getBill(50 + number);

              return (
                <Grid 
                  key={50 + number} 
                  sx={styles.grid.innerWrapper}
                  onClick={() => onMove(50 + number)}
                >
                  <Grid sx={{ display: "flex" }}>
                    <Typography sx={styles.typography.number}>
                      {50 + number}
                    </Typography>
                    <DeckIcon
                      sx={{
                        color: isEmpty(bill)
                          ? config.color.green
                          : config.color.warning,
                      }}
                      fontSize="large"
                    />
                  </Grid>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: isEmpty(bill)
                        ? config.color.green
                        : config.color.warning,
                    }}
                  >
                    {bill}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>

          <Grid sx={styles.grid.insideWrapper}>
            {Array.from(Array(7).keys()).map((number) => {
              const bill = getBill(60 + number);

              return (
                <Grid
                  key={60 + number}
                  sx={styles.grid.innerWrapper}
                  onClick={() => onMove(60 + number)}
                >
                  <Grid sx={{ display: "flex" }}>
                    <Typography sx={styles.typography.number}>
                      {60 + number}
                    </Typography>
                    <DeckIcon
                      sx={{
                        color: isEmpty(bill)
                          ? config.color.green
                          : config.color.warning,
                      }}
                      fontSize="large"
                    />
                  </Grid>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: isEmpty(bill)
                        ? config.color.green
                        : config.color.warning,
                    }}
                  >
                    {getBill(60 + number)}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>

          <Grid sx={styles.grid.insideWrapper}>
            {Array.from(Array(7).keys()).map((number) => {
              const bill = getBill(70 + number);

              return (
                <Grid
                  key={70 + number}
                  sx={styles.grid.innerWrapper}
                  onClick={() => onMove(70 + number)}
                >
                  <Grid sx={{ display: "flex" }}>
                    <Typography sx={styles.typography.number}>
                      {70 + number}
                    </Typography>
                    <DeckIcon
                      sx={{
                        color: isEmpty(bill)
                          ? config.color.green
                          : config.color.warning,
                      }}
                      fontSize="large"
                    />
                  </Grid>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: isEmpty(bill)
                        ? config.color.green
                        : config.color.warning,
                    }}
                  >
                    {getBill(70 + number)}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default TableDashboard;
