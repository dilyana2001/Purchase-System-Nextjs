import React from "react";
import ItemTemplate from "components/ItemTemplate";
import { useAppContext } from "context/AppContext";
import Menu from "@mui/material/Menu";

function SearchResultTemplate() {
  const { itemsFromSearch: items } = useAppContext();
  
  return <Menu>{items.length && items.map((x) => <ItemTemplate key={x._id} data={x} />)}</Menu>;
}

export default SearchResultTemplate;
