import Error from 'components/Layout/Error';
import errors from 'utils/errors';

const getTitle = (statusCode) => {
  switch (statusCode) {
    case 400:
      return errors.error[400];
    case 403:
      return errors.error[403];
    case 405:
      return errors.error[405];
    case 500:
      return errors.error[500];
    default:
      return errors.error.unexpected;
  }
};

export default function ErrorPage({ statusCode }){
  const title = getTitle(statusCode);

  return (
    <Error
      statusCode={statusCode}
      title={title}
    />
  );
};

ErrorPage.getInitialProps = ({ res, err }) => {
  if (res && res.statusCode) return { statusCode: res.statusCode };
  if (err && err.statusCode) return { statusCode: err.statusCode };

  return { statusCode: 500 };
};

