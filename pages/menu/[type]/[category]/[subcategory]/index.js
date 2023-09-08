import CategoryPage from "components/CategoryPage";
import Middleware from "components/Layout/Middleware";

export default function Layout() {
  return <CategoryPage />;
}

Layout.getLayout = function getLayout(page) {
  return <Middleware>{page}</Middleware>;
};