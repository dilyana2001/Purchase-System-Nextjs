import React, { useCallback, useState } from "react";
import moment from "moment";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import { useAppContext } from "context/AppContext";
import api from "utils/api";
import enums from "utils/enums";
import useNotify from 'hooks/useNotify';
import config from "styles/config";

const styles = {
  box: {
    close: {
      "&:hover": {
        background: config.color.darkerWarning,
        color: config.color.white,
        cursor: "pointer",
      },
      background: config.color.white,
      color: config.color.darkerWarning,
      lineHeight: "24px",
      textAlign: "center",
      width: "24px",
      borderRadius: "12px",
      m: '5px',
      fontSize: '10pt',
    },
  },
  card: {
    wrapper: {
      width: {
        xs: "100%",
        md: "50%",
      },
      background: config.color.white,
      position: "relative",
    },
  },
};

const PurchaseTemplate = ({ checked, data, onDelete, onCheck, onLoad }) => {
  const [open, setOpen] = useState(false);
  const [orderPurchase, setOrderPurchase] = useState(data.orderPurchase);
  const notify = useNotify();
  const { isAdmin } = useAppContext();

  const changeTheCommentHandler = useCallback(async (event) => {
      event.preventDefault();
      const { comment } = event.target;
      if (!comment.value.trim()) return;
      try {
        onLoad(false);
        const token = localStorage.getItem(enums.config.storage.token);
        await api.update(`/api/user/purchases/${data._id}`, {
          ...data,
          comment: comment.value,
        }, {}, token);
        await api.get(`/api/user/purchases/${data._id}`, {}, {}, token);
        setOpen(false);
        notify('Successfully changed!', { type: 'success' });
      } catch (err) {
        notify('Changing failed!', { type: 'error' });
      } finally {
        onLoad(true);
      }
    }, [data, onLoad, notify]);

  const deleteCommentHandler = useCallback(() => {
    try {
      onLoad(false);
      const token = localStorage.getItem(enums.config.storage.token);
      api.update(`/api/user/purchases/${data._id}`, {
        ...data,
        comment: '',
      }, {}, token);
      setOpen(false);
      notify('Successfully deleted!', { type: 'success' });
    } catch (err) {
      notify('Deleting failed!', { type: 'error' });
    } finally {
      onLoad(true);
    }
  }, [data, onLoad, notify]);

  const getOrderPurchase = useCallback(async (num) => {
    try {
      const token = localStorage.getItem(enums.config.storage.token);
      await api.update(`/api/user/purchases/${data._id}`, { orderPurchase: num }, {}, token);
      const getResponse = await api.get(`/api/user/purchases/${data._id}`, {}, {}, token);
      setOrderPurchase(getResponse.data.orderPurchase);
      onLoad(true);
      notify('Successfully changed!', { type: 'success' });
    } catch (err) {
      notify('Changing failed!', { type: 'error' });
    }
    }, [data._id, onLoad, notify]);

  const getOrderPurchaseStyles = useCallback((num) => {
    if (num === orderPurchase) return config.color.warning;
    return config.color.green;
  }, [orderPurchase]);

  return (
    <Card>
      {open && (
        <Box>
          <form onSubmit={changeTheCommentHandler}>
            <TextField
              name="comment"
              label="Change the note..."
              variant="outlined"
              sx={{ margin: "10px" }}
              defaultValue={data.comment}
            />
            <Box>
              <Button
                variant="text"
                type="submit"
                sx={{ textTransform: "capitalize" }}
              >
                OK
              </Button>
              <Button
                variant="text"
                onClick={deleteCommentHandler}
                sx={{ textTransform: 'capitalize', color: 'red' }}
              >
                Delete
              </Button>
            </Box>
          </form>
        </Box>
      )}
      <CardContent sx={{ p: '5px', pb: '5px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <FormControlLabel
            label={
                <Box sx={{ display: 'flex' }}>
                  <Typography
                    sx={{
                      whiteSpace: 'break-spaces',
                      color: data.purchased ? config.color.warning : config.color.black,
                      fontSize: '6pt',
                      maxWidth: 'min-content',
                    }}
                  >
                    {data.title.trim()}{' '}
                  </Typography>
                </Box>
            }
            control={
              <Checkbox
                sx={{ "&.Mui-checked": { color: config.color.secondary } }}
                onChange={() => onCheck(data)}
                checked={checked}
                disabled={!isAdmin}
              />
            }
          />
          {!!data.orderPurchase && data.isKitchen && (
            <Box sx={{ display: 'flex' }}>
              <Box>
                <IconButton
                  sx={{ color: getOrderPurchaseStyles(1), p: '4px' }}
                  onClick={() => getOrderPurchase(1)}
                >
                  <LooksOneIcon fontSize="small" />
                </IconButton>
                <IconButton
                  sx={{ color: getOrderPurchaseStyles(2), p: '4px' }}
                  onClick={() => getOrderPurchase(2)}
                >
                  <LooksTwoIcon fontSize="small" />
                </IconButton>
                <IconButton
                  sx={{ color: getOrderPurchaseStyles(3), p: '4px' }}
                  onClick={() => getOrderPurchase(3)}
                >
                  <Looks3Icon fontSize="small" />
                </IconButton>
              </Box>
              <Box
                sx={{ fontStyle: 'italic', fontSize: '8pt', alignSelf: 'center' }}
                onClick={() => setOpen(true)}
              >
                ---
              </Box>
            </Box>
          )}
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ m: '5px', fontSize: '8pt', placeSelf: 'center' }}>
              {moment(data.dateOfPurchase).startOf('minutes').fromNow()}
            </Typography>
            <Box sx={styles.box.close} onClick={() => onDelete(data._id)}>x</Box>
          </Box>
        </Box>
        <Typography
            onClick={() => setOpen(true)}
            sx={{ color: config.color.warning, px: '10px' }}
          >
            {data.isKitchen && data.comment && data.comment.trim()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PurchaseTemplate;

