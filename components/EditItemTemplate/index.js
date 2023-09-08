import React from "react";
import { useRouter } from 'next/router';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import StarIcon from "@mui/icons-material/Star";
import config from "styles/config";

const styles = {
  typography: {
    content: {
      fontSize: "14px",
      whiteSpace: "break-spaces",
    },
  },
  card: {
    wrapper: {
      width: {
        xs: '45%',
        sm: 165,
      },
      m: "7px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#ECF0F7",
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
      display: "flex",
      flexDirection: "column",
      textAlign: "start",
      p: '5px',
      pb: '1px !important',
    },
  },
  icon: {
    button: {
      color: config.color.golden,
      padding: "0 0 2px 10px",
      position: "absolute",
      zIndex: 100,
      top: -4,
      left: -14,
    },
  },
};

const EditItemTemplate = React.memo(function EditItemTemplate({ item }) {

  const router = useRouter();

  return (
    <Card
      sx={styles.card.wrapper}
      onClick={() => router.push(`/admin/item/${item._id}`)}
    >
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
    </Card>
  );
});

export default EditItemTemplate;
