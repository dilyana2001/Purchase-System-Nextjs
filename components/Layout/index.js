import Head from "next/head";
import Box from "@mui/material/Box";
import Header from "components/Header";
import Footer from "components/Footer";
import Notification from 'components/Layout/Notification';
import { useRouter } from "next/router";

 const styles = {
    main: {
      site: {
        paddingTop: "70px",
        paddingBottom: "10px",
        minHeight: "100vh",
      },
      print: {
        paddingTop: "10px",
        paddingBottom: "10px"
      }, 
    },
    box: {
      body: {
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'repeat',
        backgroundSize: 'cover'
      },
    },
  };

const Layout = ({ children }) => {
  const router = useRouter();

  return (
    <Box>
      <Head>
        <title>Purchase system</title>
        <meta name="description" content="Purchase system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        {router.pathname.startsWith("/print") ? (
          <Box>
            <main style={styles.main.print}>
              {children}
            </main>
          </Box>
        ) : (
          <Box
            sx={styles.box.body}>
            <Header />
              <main style={styles.main.site}>
                {children}
              </main>
              <Notification />
            <Footer />
          </Box>
        )}
    </Box>
  );
};

export default Layout;
