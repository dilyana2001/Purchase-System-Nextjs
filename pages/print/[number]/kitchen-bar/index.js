import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import moment from "moment";
import isEmpty from "lodash/isEmpty";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Middleware from "components/Layout/Middleware";
import useNotify from 'hooks/useNotify';
import api from "utils/api";
import enums from "utils/enums";

const styles = {
  menu: {
    item: {
      whiteSpace: 'break-spaces',
      my: '5px',
    },
    comment: {
      whiteSpace: 'break-spaces',
      m: '5px',
      fontSize: '10pt',
    },
  },
  typography: {
    moment: {
      my: '15px',
    },
  },
};

function KitchenBar() {
  const [items, setItems] = useState([]);
  const router = useRouter();
  const notify = useNotify();

  const { query: { number } } = router;

  const stackItems = useMemo(() => {
    const result = items
      .filter((item) => !item.purchased)
      .reduce((x, y) => {
        (x[y.title] = x[y.title] || []).push(y);
        return x;
      }, {});

    return result;
  }, [items]);

  const getMenuItems = useCallback((kitchen = false, order = 0) => (
    Object.entries(stackItems)
      .filter((item) => item[1][0].isKitchen === kitchen)
      .filter((item) => item[1][0].orderPurchase === order)
      .map(([title, valueItems]) => (
        <Box key={title}>
          <Typography sx={styles.menu.item}>
            {valueItems.length} x {title}{' '}
          </Typography>
        {kitchen && (
          <Box sx={styles.menu.item}>
            {valueItems.map((item) => (
              <Typography
                key={item.comment}
                sx={styles.menu.comment}
                >
                {item.comment && `1 - ${item.comment}`} 
              </Typography>
            ))}
        </Box>)}
      </Box>
    ))
  ), [stackItems]);

  const getPurchaseByTable = useCallback(async () => {
    if (isEmpty(number)) return;
    try {
      const token = localStorage.getItem(enums.config.storage.token);
      const response = await api.get(`/api/user/purchases/table/${number}`, {}, {}, token);
      setItems(response.data)
    } catch (err) {
      notify('Fetching failed!', { type: 'error' });
    }
  }, [notify, number]);

  const onClick = useCallback(() => {
    try {
      window.print();
      const token = localStorage.getItem(enums.config.storage.token);
      items.filter((el) => !el.purchased).map(async (item) => {
        if (isEmpty(item._id)) return;
        await api.update(`/api/user/purchases/${item._id}`, { ...item, purchased: true }, {}, token);
      });
      notify('Successfully purchased!', { type: 'success' });
    } catch (err) {
      notify('Purchased failed!', { type: 'error' });
    }
  }, [items, notify]);

  useEffect(() => {
    getPurchaseByTable();
  }, [getPurchaseByTable]);

  return (
    <Box onClick={onClick}>
       <Box>
          <Typography sx={styles.typography.moment}>
            {moment().format('hh:mm:ss')}
          </Typography>
          <hr />
          {getMenuItems(true, 1)}
          <hr />
          {getMenuItems(true, 2)}
          <hr />
          {getMenuItems(true, 3)}
        </Box>
        <Box sx={{ mt: '20px' }}>
          <Typography sx={styles.typography.moment}>
            {moment().format('hh:mm:ss')}
          </Typography>
          <hr />
          {getMenuItems()}
        </Box>
    </Box>
  );
}

export default function Layout() {
  return <KitchenBar />;
}

Layout.getLayout = function getLayout(page) {
  return <Middleware>{page}</Middleware>;
};

