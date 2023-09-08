import Link from "next/link";
import Button from "@mui/material/Button";
import config from "styles/config";

const styles = {
 button: {
    padding: '3px',
    background: config.color.dark,
    m: '5px',
    '&:hover': {
      background: config.color.darkerGray,
    },
  },
};

const CategoryTemplate = ({ title, entrypoint }) => (
  <Link href={entrypoint}>
    <Button
      variant="contained"
      sx={styles.button}
    >
      {title}
    </Button>
  </Link>
);

export default CategoryTemplate;
