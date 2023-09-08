import React from "react";
import { Route, Redirect } from "react-router-dom";

function AdminProtectedRoute({
  isAuthenticated,
  isAdmin,
  component: Component,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (isAuthenticated && isAdmin) {
          return <Component />;
        } else {
          <Redirect to={{ pathname: "/", state: { from: location } }} />;
        }
      }}
    />
  );
}
export default AdminProtectedRoute;
