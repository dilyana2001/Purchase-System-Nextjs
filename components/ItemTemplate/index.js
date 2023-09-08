import React, { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import PopupTemplate from "components/PopupTemplate";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import StarIcon from "@mui/icons-material/Star";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useAppContext } from "context/AppContext";
import api from "utils/api";
import config from "styles/config";
import enums from "utils/enums"; 
import useNotify from 'hooks/useNotify';

const styles = {
  typography: {
    content: {
      fontSize: '14px',
      whiteSpace: 'break-spaces',
    },
  },
  card: {
    wrapper: {
      width: {
        xs: '45%',
        sm: 165,
      },
      m: '7px',
      cursor: 'pointer',
      "&:hover": {
        backgroundColor: '#ECF0F7',
      },
      pb: '5px',
    },
    media: {
      width: 165,
      height: 75,
      objectFit: "cover",
    },
  },
  box: {
    content: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'start',
      p: '5px',
      pb: '1px !important',
    },
    purchase: {
      background: config.color.darkerGreen,
      color: config.color.white,
      borderRadius: '25px',
      alignSelf: 'center',
      display: 'flex',
      '&:hover': {
        backgroundColor: config.color.green,
      },
    },
  },
  icon: {
    button: {
      color: config.color.golden,
      padding: '0 0 2px 10px',
      position: 'absolute',
      zIndex: 100,
      top: -4,
      left: -14,
    },
  },
};

const ItemTemplate = React.memo(function ItemTemplate({ item }) {
  const [popup, setPopup] = useState(false);
  const { numberOfTable } = useAppContext();
  const notify = useNotify();

  const purchaseHandler = useCallback(async () => {
    try {
      const token = localStorage.getItem(enums.config.storage.token);
      await api.create(`/api/user/purchases`, {
        title: item.title,
        price: item.price,
        quantity: 1,
        imageUrl: item.imageUrl,
        isKitchen: item.isKitchen,
        numberOfTable,
        orderPurchase: item.orderPurchase,
        dateOfPurchase: new Date().getTime(),
      }, {}, token);
      notify('Successfully purchased!', { type: 'success' });
    } catch (err) {
      notify('Purchase failed!', { type: 'error' });
    }
  }, [item, notify, numberOfTable]);

  if (!item) return null;

  return (
    <Card sx={styles.card.wrapper}>
      <Box onClick={() => setPopup(true)}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            sx={styles.card.media}
            image={item.imageUrl || "/images/template.png"}
            alt="Menu item"
            loading="lazy"
          />
          {item.badge && (
            <IconButton
              sx={styles.icon.button}
            >
              <StarIcon />
            </IconButton>
          )}
        </Box>
        <CardContent sx={styles.box.content}>
          <Typography sx={styles.typography.content}>
            {item.title.trim()}
          </Typography>
          <Typography sx={styles.typography.content}>
            {Number(item.price).toFixed(2).trim()} €
          </Typography>
        </CardContent>
      </Box>
      <Button
        onClick={purchaseHandler}
        sx={styles.box.purchase}
      >
        <Typography sx={{ mr: '10px'}}>
        Add
        </Typography>
        <IconButton sx={{ p: 0 }}>
          <ShoppingCartIcon
            sx={{ color: config.color.white }}
            fontSize="small"
          />
        </IconButton>
      </Button>
      {popup && (
        <PopupTemplate
          item={item}
          open={popup}
          handleClose={() => setPopup(false)}
        />
      )}
    </Card>
  );
});

export default ItemTemplate;