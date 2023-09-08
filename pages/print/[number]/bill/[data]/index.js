import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Divider from '@mui/material/Divider';
import Typography from "@mui/material/Typography";
import Middleware from "components/Layout/Middleware";

const styles = {
  box: {
    wrapper: {
      m: '10px',
    },
    item: {
      whiteSpace: 'break-spaces',
      mb: '10px',
    },
    quantity: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
};

function BillPrint() {
  const [bill, setBill] = useState(0);
  const [items, setItems] = useState([]);
  const router = useRouter();
  const { query: { data } } = router;

  const stackItems = useMemo(() => {
    const result = items.reduce((x, y) => {
      (x[y.title] = x[y.title] || []).push(y);
      return x;
    }, {});

    return result;
  }, [items]);

  useEffect(() => {
    setItems(JSON.parse(data));
  }, [data]);

  useEffect(() => {
    setBill(items?.reduce((o, item) => o += Number(item.quantity) * Number(item.price), 0))
  }, [items]);

  return (
    <Box
      sx={styles.box.wrapper}
      onClick={() => window.print()}
    >
     {Object.entries(stackItems).map(([title, valueItems]) => (
        <Box
          key={title}
          sx={styles.box.item}
        >
          <Typography>
            {title}
          </Typography>
          <Box sx={styles.box.quantity}>
            <Typography>
              {valueItems.length} x {valueItems[0].price}
            </Typography>
            <Typography>
              {(Number(valueItems.length) * Number(valueItems[0].price)).toFixed(2)}€
            </Typography>
          </Box>
        </Box>
      ))}
    <Divider />
    <Box sx={styles.box.quantity}>
      <Box />
      <Box>Total: {bill.toFixed(2)}€</Box>
    </Box>
  </Box>
  );
}

export default function Layout() {
  return <BillPrint />;
}

Layout.getLayout = function getLayout(page) {
  return <Middleware>{page}</Middleware>;
};

