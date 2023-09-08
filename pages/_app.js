import { AppWrapper } from "context/AppContext";
import Layout from "components/Layout";
import "styles/index.css";

export default function MyApp({ Component, ...pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <AppWrapper>
        <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
    </AppWrapper>
  );
}