import Error from "components/Layout/Error";
import errors from 'utils/errors';

export default function ErrorPage() {
  return <Error statusCode={404} title={errors[404]} />;
}
