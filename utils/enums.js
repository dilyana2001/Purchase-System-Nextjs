const config = {
  storage: {
    token: 'token',
    table: 'table',
    tables: 'tables',
  },
};

const error = {
    media: {
      upload: 'UploadMediaError',
    },
    token: {
      refresh: 'RefreshAccessTokenError',
    },
  };
  
  const session = {
    status: {
      authenticated: 'authenticated',
      loading: 'loading',
      unauthenticated: 'unauthenticated',
    },
  };
  
  const enums = {
    config,
    error,
    session,
  };
  
  export default enums;
  