import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import Middleware from "components/Layout/Middleware";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Typography from "@mui/joy/Typography";
import api from "utils/api";
import enums from "utils/enums";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import IconButton from "@mui/material/IconButton";
import useNotify from 'hooks/useNotify';
import config from "styles/config";

const EditItem = () => {
  const [item, setItem] = useState({});
  const [enableKitchen, setEnableKitchen] = useState(false);
  const [enableBadge, setEnableBadge] = useState(false);
  const [orderPurchase, setOrderPurchase] = useState(item.orderPurchase || 1);
  const router = useRouter();
  const notify = useNotify();

  const {
    query: { itemId },
  } = router;

  const getOrderPurchaseStyles = useCallback(
    (num) => {
      if (num === orderPurchase) return { color: config.color.warning };
      return { color: config.color.green };
    },
    [orderPurchase]
  );

  const getItem = useCallback(async () => {
    if (isEmpty(itemId)) return;
      try {
      const token = localStorage.getItem(enums.config.storage.token);
      const response = await api.get(`/api/${itemId}`, {}, {}, token);
      setItem(response.data)
      setOrderPurchase(response.data.orderPurchase);
    } catch (err) {
      notify('Fetching failed!', { type: 'error' });
    }
  }, [itemId, notify]);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    const {
      target: { title, imageUrl, price, category, description, subcategory },
    } = e;
    if (!title.value || !price.value || !category.value || !subcategory.value)
      return alert("Enter values for: title, price, category and subcategory!");

    const data = {
      title: title.value.trim(),
      imageUrl: imageUrl.value.trim(),
      price: price.value.trim(),
      category: category.value.trim(),
      subcategory: subcategory.value.trim(),
      description: description.value.trim(),
      isKitchen: enableKitchen,
      orderPurchase: enableKitchen && orderPurchase,
      badge: enableBadge,
    };

    try {
      const token = localStorage.getItem(enums.config.storage.token);
      await api.update(`/api/admin/edit/${item._id}`, data, {}, token);
      router.push(`/admin/item/${item._id}`);
      notify('Successfully edited!', { type: 'success' });
    } catch (err) {
      notify('Edition failed!', { type: 'error' });
    }
  }, [enableBadge, enableKitchen, item._id, orderPurchase, router, notify]);

  useEffect(() => {
    getItem();
  }, [getItem]);

  useEffect(() => {
    setEnableKitchen(item.isKitchen);
  }, [item]);

  useEffect(() => {
    setEnableBadge(item.badge);
  }, [item]);

  if (!item.title || !item.price || !item.category) return null;

  return (
    <Box sx={{ maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <Typography
          sx={{ fontWeight: "bold", margin: "20px", fontSize: "40px" }}
        >
          EDIT
        </Typography>
        <TextField
          sx={{ margin: "5px" }}
          label="Title"
          type="text"
          name="title"
          defaultValue={item.title}
        />
        <TextField
          sx={{ margin: "5px" }}
          label="Image URL"
          type="text"
          name="imageUrl"
          defaultValue={item.imageUrl}
        />
        <TextField
          sx={{ margin: "5px" }}
          label="Price"
          type="text"
          name="price"
          defaultValue={item.price}
        />
        <TextField
          sx={{ margin: "5px" }}
          label="Category"
          type="text"
          name="category"
          defaultValue={item.category}
        />
        <TextField
          sx={{ margin: "5px" }}
          label="Subcategory"
          type="text"
          name="subcategory"
          defaultValue={item.subcategory}
        />
        <Box>
          <Typography
            sx={{ textAlign: "start", margin: "5px 10px", width: "50%" }}
          >
            Kitchen
            <Switch
              checked={enableKitchen}
              onChange={() => setEnableKitchen(!enableKitchen)}
              sx={enableKitchen ? { color: "blue" } : { color: "lightgray" }}
            />
          </Typography>
          {enableKitchen && (
            <Box>
              <IconButton
                onClick={() => setOrderPurchase(1)}
                sx={getOrderPurchaseStyles(1)}
              >
                <LooksOneIcon fontSize="large" />
              </IconButton>
              <IconButton
                onClick={() => setOrderPurchase(2)}
                sx={getOrderPurchaseStyles(2)}
              >
                <LooksTwoIcon fontSize="large" />
              </IconButton>
              <IconButton
                onClick={() => setOrderPurchase(3)}
                sx={getOrderPurchaseStyles(3)}
              >
                <Looks3Icon fontSize="large" />
              </IconButton>
            </Box>
          )}
        </Box>
        <TextField
          sx={{ margin: "5px" }}
          label="Description"
          type="text"
          placeholder="Description"
          name="description"
          defaultValue={item.description}
          multiline
          rows={3}
        />
        <Typography
          sx={{ textAlign: "start", margin: "5px 10px", width: "50%" }}
        >
          Set Badge
          <Switch
            checked={enableBadge}
            onChange={() => setEnableBadge(!enableBadge)}
            sx={enableBadge ? { color: "blue" } : { color: "lightgray" }}
          />
        </Typography>
        <Box>
          <Button
            type="submit"
            variant="outlined"
            sx={{ maxWidth: "100px", margin: "10px 0 100px 0" }}
          >
            Edit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default function Edit() {
  return <EditItem />;
}

Edit.getLayout = function getLayout(page) {
  return <Middleware>{page}</Middleware>;
};
