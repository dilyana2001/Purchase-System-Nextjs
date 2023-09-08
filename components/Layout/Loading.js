import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const styles = {
  container: {
    alignItems: 'center',
    display: 'flex',
    height: 'calc(66vh - 64px)',
    justifyContent: 'center',
    padding: {
      xs: '0px',
      sm: '24px',
    },
  },
  grid: {
    container: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
      justifyContent: 'center',
      textAlign: 'center',
    },
    message: {
      display: 'inline-block',
      height: '49px',
      lineHeight: '49px',
      textAlign: 'left',
      verticalAlign: 'middle',
    },
  },
  typography: {
    message: {
      fontSize: '20px',
      fontWeight: 'normal',
      lineHeight: 'inherit',
      margin: '0px',
      padding: '0px',
    },
  },
};

const Loading = () => {

  return (
    <Grid container>
      <Container sx={styles.container} maxWidth="xl">
        <Grid sx={styles.grid.container}>
          <Grid sx={styles.grid.message}>
            <Typography
              variant="h2"
              sx={styles.typography.message}
            >
              Loading...
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
};

export default Loading;
