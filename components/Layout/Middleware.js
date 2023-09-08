import React, { Fragment } from "react";
import { useAppContext } from "context/AppContext";
import Unauthorized from "components/Layout/Unauthorized";
import { useRouter } from "next/router";

export default function Middleware({ children }) {
  const { isAdmin, isAuthenticated } = useAppContext();
  const router = useRouter();

  if (!isAuthenticated) {
    return <Unauthorized />;
  }

  if (!isAdmin && router.pathname.startsWith("/admin")) {
    return <Unauthorized />;
  }

  return <Fragment>{children}</Fragment>;
}
