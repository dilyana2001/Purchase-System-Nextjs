import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import isEmpty from "lodash/isEmpty";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Middleware from "components/Layout/Middleware";
import { useAppContext } from "context/AppContext";
import api from "utils/api";
import enums from "utils/enums";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import config from "styles/config";
import IconButton from "@mui/material/IconButton";
import StarIcon from "@mui/icons-material/Star";
import CancelIcon from "@mui/icons-material/Cancel";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import Error404 from "pages/404";
import useNotify from "hooks/useNotify";

const DetailsPage = () => {
  const { isAuthenticated } = useAppContext();
  const [item, setItem] = useState({});
  const router = useRouter();
  const notify = useNotify();
  const { itemId: id } = router.query;

  const getItem = useCallback(async () => {
    if (!isAuthenticated || isEmpty(id)) return;
  
    try {
    const token = localStorage.getItem(enums.config.storage.token);
    const response = await api .get(`/api/${id}`, {}, {}, token);
    setItem(response.data);
  } catch (err) {
    notify('Fetching failed!', { type: 'error' });
  }
  }, [id, isAuthenticated, notify]);

  const deleteHandler = useCallback(async () => {
    const ifDelete = window.confirm('Are u sure?');
    if (ifDelete) {
      try {
      const token = localStorage.getItem(enums.config.storage.token);
      await api.remove(`/api/admin/delete/${id}`, {}, token);
      router.push('/admin/panel/menu');
      notify('Successfully deleted!', { type: 'success' });
      } catch (err) {
        notify('Deleting failed!', { type: 'error' });
      }
    }
  }, [id, notify, router]);

  const getOrderPurchaseIcon = useMemo(() => {
    switch (item.orderPurchase) {
      case 1:
        return <LooksOneIcon />;
      case 2:
        return <LooksTwoIcon />;
      case 3:
        return <Looks3Icon />;
      default:
        return null;
    }
  }, [item?.orderPurchase]);

  useEffect(() => {
    getItem();
  }, [getItem]);

  if (isEmpty(item)) return <Error404 />;

  return (
    <Card sx={{ maxWidth: 345, margin: '100px auto' }}>
      <CardMedia
        component="img"
        height="200"
        sx={{ objectFit: 'cover' }}
        src={item.imageUrl || '/images/template.png'}
        alt="template"
      />
      <CardContent>
        <Typography sx={{ textAlign: 'center' }}>
          {item.title} {item.price} €
        </Typography>
        <Typography>
          {item.category} {item.subcategory}
        </Typography>
        <Typography>{item.description}</Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={deleteHandler}
          sx={{ color: 'red', fontWeight: 'bold' }}
        >
          Delete
        </Button>
        <Link href={`/admin/edit/${item._id}`}>
          <Button size="small">Edit</Button>
        </Link>
        <Typography>
          Kitchen:
          {item.isKitchen ? (
            <IconButton
              sx={{ color: config.color.green, padding: '0 0 2px 5px' }}
            >
              <CheckCircleIcon fontSize="small" />
            </IconButton>
          ) : (
            <IconButton
              sx={{ color: config.color.warning, padding: '0 0 2px 5px' }}
            >
              <CancelIcon fontSize="small" />
            </IconButton>
          )}
        </Typography>
        {item.isKitchen && (
          <Typography>
            <IconButton
              sx={{ color: config.color.warning, padding: '0 0 2px 10px' }}
            >
              {getOrderPurchaseIcon}
            </IconButton>
          </Typography>
        )}
        {item.badge && (
          <Typography>
            <IconButton
              sx={{ color: config.color.golden, padding: '0 0 2px 10px' }}
            >
              <StarIcon />
            </IconButton>
          </Typography>
        )}
      </CardActions>
    </Card>
  );
};

export default function Details() {
  return <DetailsPage />;
}

Details.getLayout = function getLayout(page) {
  return <Middleware>{page}</Middleware>;
};
