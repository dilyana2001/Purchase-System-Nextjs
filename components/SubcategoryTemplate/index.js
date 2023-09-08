import Link from "next/link";
import Button from "@mui/material/Button";
import config from "styles/config";

const styles = {
 button: {
    padding: '3px',
    background: config.color.darkGray,
    m: '5px',
    '&:hover': {
      background: config.color.darkerGray,
    },
  },
};

const SubcategoryTemplate = ({ title, entrypoint }) => {
  return (
    <Link href={entrypoint}>
      <Button
        variant="contained"
        sx={styles.button}
      >
        {title}
      </Button>
    </Link>
  );
};

export default SubcategoryTemplate;
