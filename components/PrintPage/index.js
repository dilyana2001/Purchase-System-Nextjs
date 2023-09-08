import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from '@mui/material/Divider';
import MenuItem from "@mui/material/MenuItem";

const styles = {
  box: {
      dialog: {
        '& > div': {
          position: 'relative',
          margin: '2vh auto',
          padding: '10px 15px 30px',
          borderRadius: '10px',
          background: '#fff',
          transition: 'opacity 400ms ease-in',
          maxWidth: '250px'
        },
        position: 'fixed',
        overflow: 'scroll',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        zIndex: 10000,
        opacity: 1,
      },
      close: {
        cursor: 'pointer',
        position: 'absolute',
        right: '12px',
        textAlign: 'center',
        width: '24px',
    },
  },
};

export default function PrintPage({ items, handler, isKitchen = false }) {
  const [bill, setBill] = useState(0);

  const openWindowPrint = useCallback(() => {
    window.print();
  }, []);

  useEffect(() => {
    let sum = 0;
    if (!isKitchen) {
      for (const x of items) {
        sum += Number(x.quantity) * Number(x.price);
      }
      setBill(sum);
    }
  }, [items, isKitchen]);

  return (
    <Box sx={styles.box.dialog}>
      <Box>
        <Box sx={{ display: 'flex', mb: '10px'}}>
          <Box onClick={handler} sx={styles.box.close}>
            X
          </Box>
          <Box
              sx={{ cursor: "pointer" }}
              onClick={openWindowPrint}
            >
              Print
          </Box>
        </Box>
        <Box>
          {isKitchen ? (
          <Box>
            FIRST:
            {items.filter((x) => x.orderPurchase === 1).map((x) => (
              <MenuItem key={x._id} sx={{ whiteSpace: 'break-spaces', my: '5px' }}>
                {x.quantity} x {x.title}{" "}
                {isKitchen && x.comment && `(${x.comment})`}
              </MenuItem>
            ))}
            <Divider />
            SECOND:
            {items.filter((x) => x.orderPurchase === 2).map((x) => (
              <MenuItem key={x._id} sx={{ whiteSpace: 'break-spaces', my: '5px' }}>
                {x.quantity} x {x.title}{" "}
                {isKitchen && x.comment && `(${x.comment})`}
              </MenuItem>
            ))}
            <Divider />
            THIRD:
            {items.filter((x) => x.orderPurchase === 3).map((x) => (
              <MenuItem key={x._id} sx={{ whiteSpace: 'break-spaces', my: '5px' }}>
                {x.quantity} x {x.title}{" "}
                {isKitchen && x.comment && `(${x.comment})`}
              </MenuItem>
            ))}
          </Box>
          ) : (
            items.map((x) => (
              <MenuItem key={x._id} sx={{whiteSpace: 'break-spaces' }}>
                {x.quantity} x {x.title}{" "}
                {!isKitchen && <span>{(Number(x.quantity) * Number(x.price)).toFixed(2)}€</span>}
              </MenuItem>
            ))
          )}
          <Divider />
          {!isKitchen && <span>sum: {bill.toFixed(2)}€</span>}
        </Box>
      </Box>
    </Box>
  );
}
