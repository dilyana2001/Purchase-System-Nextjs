import Middleware from "components/Layout/Middleware";
import EditCategoryPage from "components/EditCategoryPage";

export default function Layout() {
  return <EditCategoryPage />;
}

Layout.getLayout = function getLayout(page) {
  return <Middleware>{page}</Middleware>;
};

