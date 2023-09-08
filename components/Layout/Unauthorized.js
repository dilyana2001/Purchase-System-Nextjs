import Head from 'next/head';
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
    code: {
      borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
      display: 'inline-block',
      fontSize: '76px',
      fontWeight: 500,
      margin: '0 0 20px 0',
      padding: '10px 10px 23px 10px',
      verticalAlign: 'top',
    },
    message: {
      fontSize: '20px',
      fontWeight: 'normal',
      lineHeight: 'inherit',
      margin: '0px',
      padding: '0px',
    },
  },
};

const Unauthorized = () => {
  return (
    <Grid container>
      <Head>
        <title>Unauthorized</title>
      </Head>
      <Container sx={styles.container} maxWidth="xl">
        <Grid sx={styles.grid.container}>
          <Typography
            variant="h1"
            sx={styles.typography.code}
          >
            401
          </Typography>
          <Grid sx={styles.grid.message}>
            <Typography
              variant="h2"
              sx={styles.typography.message}
            >
              Unauthorized
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
};

export default Unauthorized;
