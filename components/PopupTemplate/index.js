import React, { useCallback, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useAppContext } from "context/AppContext";
import api from "utils/api";
import enums from "utils/enums";
import config from "styles/config";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import useNotify from 'hooks/useNotify';

const styles = {
  typography: {
    content: {
      fontSize: "14px",
      whiteSpace: "break-spaces",
    },
  },
};

const PopupTemplate = ({ item, open, handleClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [orderComment, setOrderComment] = useState('');
  const [orderPurchase, setOrderPurchase] = useState(item.orderPurchase);

  const notify = useNotify();
  const { numberOfTable } = useAppContext();

  if (quantity < 0) setQuantity(0);

  const purchaseHandler = useCallback(() => {
    if (quantity === 0) return;
    const data = {
      title: item.title,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
      comment: orderComment,
      isKitchen: item.isKitchen,
      numberOfTable,
      orderPurchase,
      dateOfPurchase: new Date().getTime(),
    };
    try {
      const token = localStorage.getItem(enums.config.storage.token);
      Array.from(Array(quantity).keys()).map(() => api.create(`/api/user/purchases`, data, {}, token));
      handleClose();
      notify('Successfully purchased!', { type: 'success' });
    } catch (err) {
      notify('Purchase failed!', { type: 'error' });
    }
  }, [
    item,
    quantity,
    orderComment,
    numberOfTable,
    orderPurchase,
    handleClose, 
    notify,
  ]);

  const getOrderPurchaseStyles = useCallback(
    (num) => {
      if (num === orderPurchase) return { color: config.color.warning };
      return { color: config.color.green };
    },
    [orderPurchase]
  );

  return (
    <Dialog onClose={handleClose} open={open} scroll="body">
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
      <Card sx={{ maxWidth: 345, margin: "auto ", p: "10px" }}>
        <CardActionArea>
          <Typography gutterBottom variant="h5" component="div">
            <Box>
              <DialogTitle sx={{ whiteSpace: "break-spaces",  paddingBottom: 0 }}>
                {item.title}
              </DialogTitle>
              <DialogTitle sx={{ whiteSpace: "break-spaces", fontSize: 10, py: 0 }}>
                {item.category}
                {' '}
                {item.subcategory}
              </DialogTitle>
              <DialogTitle sx={{ py: 0 }}>
                {Number(item.price).toFixed(2)} €
              </DialogTitle>
             {item?.description &&  (
                <DialogTitle sx={styles.typography.content}>
                  {item.description.trim()}
                </DialogTitle>
              )}
            </Box>
          </Typography>
          <CardMedia
            component="img"
            width="300"
            image={item.imageUrl || "/images/template.png"}
            alt="item"
            sx={{ height: '25vh' }}
          />
          <CardContent>
            <Box>
              {item.isKitchen && (
                <TextField
                  label="Write a note..."
                  variant="outlined"
                  onChange={(e) => setOrderComment(e.target.value)}
                  value={orderComment}
                  sx={{ margin: "10px" }}
                />
              )}
              <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                <IconButton
                  sx={{
                    color: config.color.darkerGreen,
                  }}
                >
                  <RemoveCircleOutlineIcon
                    onClick={() => setQuantity(quantity - 1)}
                    fontSize="large"
                  />
                </IconButton>
                <Box
                  sx={{
                    m: "5px",
                    alignSelf: "center",
                    fontSize: "20px",
                    fontWeight: "700",
                  }}
                >
                  {quantity}
                </Box>
                <IconButton
                  sx={{
                    color: config.color.darkerGreen,
                  }}
                >
                  <ControlPointIcon
                    onClick={() => setQuantity(quantity + 1)}
                    fontSize="large"
                  />
                </IconButton>
                <Box
                  onClick={purchaseHandler}
                  sx={{
                    background: config.color.darkerGreen,
                    color: config.color.white,
                    p: "7px 15px",
                    borderRadius: '25px',
                    alignSelf: 'center',
                    display: 'flex',
                  }}
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
                </Box>
              </Box>
              {!!orderPurchase && item.isKitchen && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <IconButton
                    onClick={() => setOrderPurchase(1)}
                    sx={getOrderPurchaseStyles(1)}
                  >
                    <LooksOneIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => setOrderPurchase(2)}
                    sx={getOrderPurchaseStyles(2)}
                  >
                    <LooksTwoIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => setOrderPurchase(3)}
                    sx={getOrderPurchaseStyles(3)}
                  >
                    <Looks3Icon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Dialog>
  );
};

export default PopupTemplate;
