import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
// import { PDFDownloadLink } from '@react-pdf/renderer';
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import AddIcon from '@mui/icons-material/Add';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import FormControlLabel from "@mui/material/FormControlLabel";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Middleware from "components/Layout/Middleware";
import PurchaseTemplate from "components/PurchaseTemplate";
import TableDashboard from "components/TableDashboard";
// import KitchenBar from 'components/Print/KitchenBar';
import { useAppContext } from "context/AppContext";
import api from "utils/api";
import enums from "utils/enums";
import useNotify from 'hooks/useNotify';
import config from "styles/config";

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
    right: {
      background: config.color.green,
      ml: "-15px",
      mr: "25px",
      "&:hover": {
        background: config.color.darkerGreen,
      },
    },
  },
  box: {
    rightButtons: {
      mx: "10px",
      display: "flex",
      justifyContent: "space-between",
    },
  },
};

const NumberTable = () => {
  const [checked, setChecked] = useState([]);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const notify = useNotify();
  const { query: { number } } = router;
  const { isAdmin, onQueryTableNumber } = useAppContext();

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down('sm'));

  const bill = useMemo(() => items.reduce((o, item) => (o += Number(item.quantity) * Number(item.price)), 0).toFixed(2), [items]);

  const stackItems = useMemo(() => {
    const result = items.reduce((x, y) => {
      (x[y.title] = x[y.title] || []).push(y);
      return x;
    }, {});

    return result;
  }, [items]);

  const getPurchaseByTable = useCallback(async () => {
    if (isEmpty(number)) return;
    try {
      const token = localStorage.getItem(enums.config.storage.token);
      const response = await api.get(`/api/user/purchases/table/${number}`, {}, {}, token);
      setItems(response.data);
    } catch (err) {
      notify('Fetching failed!', { type: 'error' });
    }
  }, [notify, number]);

  const onDeleteOne = useCallback(async (id) => {
    const ifDelete = window.confirm("Are you sure want to delete the item?");
    if (ifDelete) {
      try {
        const token = localStorage.getItem(enums.config.storage.token);
        await api.remove(`/api/user/purchases/${id}`, {}, token);
        setItems(items.filter((x) => x._id !== id));
        setChecked(checked.filter((x) => x._id !== id));
        notify('Successfully deleted!', { type: 'success' });
      } catch (err) {
        notify('Deleting failed!', { type: 'error' });
      }
    }
  }, [checked, items, notify]);

  const onDeleteTable = useCallback(async () => {
    const ifDelete = window.confirm("Are you sure want to delete the item/s?");
    if (ifDelete) {
      try {
        const token = localStorage.getItem(enums.config.storage.token);
        await api.remove(`/api/user/purchases/table/number/${number}`, {}, token);
        await api.update(`/api/admin/budget`, { total: bill }, {}, token);
        setItems([]);
        setChecked([]);
        router.push(`/admin/tables`);
        notify('Successfully deleted!', { type: 'success' });
      } catch (err) {
        notify('Deleting failed!', { type: 'error' });
      }
    }
  }, [number, bill, router, notify]);

  const onCheckOne = useCallback((item) => {
    setChecked((current) => {
      if (!current.includes(item)) return [...current, item];

      return current.filter((el) => el.title !== item.title);
    });
  }, []);

  const onUncheckOne = useCallback((item) => {
    setChecked((current) => current.filter((el) => el.title !== item.title));
  }, []);

  const onCheckMany = useCallback((event, argument) => {
   if (!event.target.checked) return checked.filter((item) => item.title === argument).map((item) => onUncheckOne(item));

    return items.filter((item) => item.title === argument).map((item) => onCheckOne(item));
  }, [checked, items, onCheckOne, onUncheckOne]);

  const onCheckTable = useCallback(() => {
    if (!isEmpty(checked)) return setChecked([]);
    items.map((item)=> onCheckOne(item));
  }, [checked, items, onCheckOne]);

  const onMove = useCallback((number) => {
    if (isNil(number)) return;

    try {
      setLoading(false);
      const token = localStorage.getItem(enums.config.storage.token);
      checked.map(async (item) => {
        if (isEmpty(item._id)) return;
        await api.update(`/api/user/purchases/${item._id}`, {...item, numberOfTable: number }, {}, token)
      });
      notify('Successfully moved!', { type: 'success' });
    } catch (err) {
      notify('Moving failed!', { type: 'error' });
    } finally {
      router.push(`/admin/tables/${number}`);
      setLoading(true);
      setOpen(false);
      setChecked([]);
    }
  }, [checked, notify, router]);

  const onRestore = useCallback(() => {
    try {
      setLoading(false);
      const token = localStorage.getItem(enums.config.storage.token);
      checked.map(async (item) => {
        if (isEmpty(item._id)) return;
        await api.update(`/api/user/purchases/${item._id}`, { ...item, purchased: false }, {}, token);
      });
      notify('Successfully restored!', { type: 'success' });
    } catch (err) {
      notify('Restoring failed!', { type: 'error' });
    } finally {
      setLoading(true);
      setChecked([]);
    }
  }, [checked, notify]);

  const onPartialBill = useCallback(() => {
    router.push(`/print/${number}/bill/${JSON.stringify(checked)}`);
  }, [checked, number, router]);

  const onPurchase = useCallback(async (item) => {
    try {
      const token = localStorage.getItem(enums.config.storage.token);
      await api.create(`/api/user/purchases`, {
        title: item.title,
        price: item.price,
        quantity: 1,
        imageUrl: item.imageUrl,
        isKitchen: item.isKitchen,
        numberOfTable: number,
        orderPurchase: item.orderPurchase,
        dateOfPurchase: new Date().getTime(),
      }, {}, token);
      getPurchaseByTable();
      notify('Successfully purchased!', { type: 'success' });
    } catch (err) {
      notify('Purchase failed!', { type: 'error' });
    }
  }, [number, getPurchaseByTable, notify]);

  const onLoad = useCallback((boolean) => {
    setLoading(boolean);
  }, []);

  useEffect(() => {
    if (loading) getPurchaseByTable();
    setLoading(false);
  }, [loading, getPurchaseByTable]);

  useEffect(() => {
    getPurchaseByTable();
  }, [getPurchaseByTable]);

  useEffect(() => {
    onQueryTableNumber(number);
  }, [number, onQueryTableNumber]);
  
  if (!isAdmin) return null;

  return (
    <Grid sx={{ maxWidth: { xs: '100%', lg: '50%' }, marginX: 'auto' }}>
      <Grid sx={{ mb: "20px" }}>
        <Box sx={styles.box.rightButtons}>
          <Typography sx={styles.typography.title}>#{number}</Typography>
          {!!items.length && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ mr: "15px" }}>
                <Checkbox
                  sx={{
                    "& .MuiSvgIcon-root": { fontSize: 32 },
                    "&.Mui-checked": { color: config.color.secondary },
                  }}
                  onChange={onCheckTable}
                  checked={checked.length !== 0}
                />
              </Box>
              <Box>
                <Button
                  variant="contained"
                  size="small"
                  sx={styles.button.right}
                  onClick={() => setOpen(true)}
                  disabled={checked.length === 0}
                >
                  Move
                </Button>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  size="small"
                  sx={styles.button.right}
                  onClick={onRestore}
                  disabled={checked.length === 0}
                >
                  Restore
                </Button>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  size="small"
                  sx={styles.button.right}
                  onClick={onPartialBill}
                  disabled={checked.length === 0}
                >
                  {small ? 'PB' : 'Partial Bill'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
        <Typography sx={styles.typography.info}>
          Sum: {bill} €
        </Typography>
      </Grid>
      <Grid>
        {items.length ? (
          <Fragment>
            <Grid sx={{ display: "flex", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="small"
                sx={styles.button.print}
                onClick={() => router.push(`/print/${number}/kitchen-bar`)}
                disabled={items.filter((item) => !item.purchased).length === 0}
              >
                Kitchen/Bar
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={styles.button.print}
                onClick={() => router.push(`/print/${number}/bill`)}
              >
                Bill
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={styles.button.delete}
                onClick={() => onDeleteTable()}
              >
                Delete
              </Button>
            </Grid>
            <Grid sx={{ mt: "20px", textAlign: "-webkit-center" }}>
              {Object.entries(stackItems)
                .sort((a, b) => a[1][0].orderPurchase - b[1][0].orderPurchase)
                .sort((a, b) => b[1][0].isKitchen - a[1][0].isKitchen)
                .map(([title, valueItems]) => (
                  <Accordion key={title}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <FormControlLabel
                          label={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography
                                sx={{
                                  whiteSpace: 'break-spaces',
                                  color: !isEmpty(valueItems.filter((el) => !el.purchased)) ? config.color.black : config.color.warning,
                                }}
                              >
                                {title.trim()}{' '}
                              </Typography>
                              <Typography>x{valueItems.length}</Typography>
                            </Box>
                          }
                          control={
                            <Checkbox
                              sx={{ '&.Mui-checked': { color: config.color.secondary }, pointerEvents: 'none' }}
                              onChange={(event) => onCheckMany(event, title)}
                              disabled={!isAdmin}
                              checked={checked.filter((el) => el.title === title).length === valueItems.filter((el) => el.title === title).length}
                            />
                          }
                        />
                    </AccordionSummary>
                    <AccordionDetails>
                      <IconButton onClick={() => onPurchase(valueItems[0])}>
                        <AddIcon />
                      </IconButton>
                      {valueItems
                        .map((item) => (
                          <PurchaseTemplate
                            key={item._id}
                            checked={checked.includes(item)}
                            data={item}
                            onDelete={onDeleteOne}
                            onLoad={onLoad}
                            onCheck={onCheckOne}
                          />
                      ))}
                    </AccordionDetails>
                  </Accordion>
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
