import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/joy/Typography";
import Middleware from "components/Layout/Middleware";
import api from "utils/api";
import enums from "utils/enums";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import IconButton from "@mui/material/IconButton";
import config from "styles/config";
import useNotify from 'hooks/useNotify';

const CreateItem = () => {
  const [enableKitchen, setEnableKitchen] = useState(false);
  const [enableBadge, setEnableBadge] = useState(false);
  const [orderPurchase, setOrderPurchase] = useState(1);
  const router = useRouter();
  const notify = useNotify();

  const getOrderPurchaseStyles = useCallback(
    (num) => {
      if (num === orderPurchase) return { color: config.color.warning };
      return { color: config.color.green };
    },
    [orderPurchase]
  );

  const onSubmit = (e) => {
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
    const token = localStorage.getItem(enums.config.storage.token);
    api
      .create("/api/admin/create", data, {}, token)
      .then((response) => {
        router.push(
          response.data ? `/admin/item/${response.data._id}` : "/admin/create"
        );
        notify('Successfully created!', { type: 'success' });
      })
        .catch((err) => notify('Creation failed!', { type: 'error' }));
  };

  return (
    <Box sx={{ maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <Typography
          sx={{ fontWeight: "bold", margin: "20px", fontSize: "40px" }}
        >
          ADD
        </Typography>
        <TextField
          sx={{ margin: "5px" }}
          label="Title"
          type="text"
          name="title"
        />
        <TextField
          sx={{ margin: "5px" }}
          label="Image URL"
          type="text"
          name="imageUrl"
        />
        <TextField
          sx={{ margin: "5px" }}
          label="Price"
          type="number"
          name="price"
        />
        <TextField
          sx={{ margin: "5px" }}
          label="Category"
          type="text"
          name="category"
        />
        <TextField
          sx={{ margin: "5px" }}
          label="Subcategory"
          type="text"
          name="subcategory"
        />
        <Box sx={{ dispaly: "flex" }}>
          <Typography sx={{ textAlign: "start", margin: "5px 10px" }}>
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
          label="Description:"
          type="text"
          placeholder="Description"
          name="description"
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
            Add
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default function Create() {
  return <CreateItem />;
}

Create.getLayout = function getLayout(page) {
  return <Middleware>{page}</Middleware>;
};
