import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import isEmpty from "lodash/isEmpty";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import ItemTemplate from "components/ItemTemplate";
import CategoryTemplate from "components/CategoryTemplate";
import SubcategoryTemplate from "components/SubcategoryTemplate";
import { useAppContext } from "context/AppContext";
import api from "utils/api";
import enums from "utils/enums";
import useNotify from 'hooks/useNotify';
import resources from "fixtures/resources"; 

const styles = {
  box: {
    wrapper: {
      display: "flex",
      p: "5px 10px",
      justifyContent: {
        xs: "space-evenly",
        sm: "center",
      },
    },
    imageCategory: {
      mx: "10px",
      cursor: "pointer",
    },
    items: {
      mt: "20px",
      textAlign: "-webkit-center",
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly'
    },
    categories: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
    },
  },
}

const CategoryPage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [uniqueSubcategories, setUniqueSubcategories] = useState([]);
  const [extendCategories, setExtendCategories] = useState(true);

  const { searchItems, onSearchOff } = useAppContext();
  const router = useRouter();
  const { query: { type, category, subcategory } } = router;
  const notify = useNotify();

  const getAllData = useCallback(async () => {
    try {
      const token = localStorage.getItem(enums.config.storage.token);
      const response = await api.get("/api", {}, {}, token);
      setItems(response.data);
    } catch (err) {
      notify('Fetching failed!', { type: 'error' });
    }
  }, [notify]);

  const filterCategoriesByOrder = useCallback((item) => {
    switch (type) {
      case "drink":
        return item.orderPurchase === 0 && !item.isKitchen;
      case "first":
        return item.orderPurchase === 1 && item.isKitchen;
      case "second":
        return item.orderPurchase === 2 && item.isKitchen;
      case "third":
        return item.orderPurchase === 3 && item.isKitchen;
      default:
        return item;
    }
  }, [type]);

  const filterItemsByOrder = useCallback(() => {
    switch (type) {
      case "drink":
        return setFilteredItems(
          items.filter((item) => item.orderPurchase === 0 && !item.isKitchen)
        );
      case "first":
        return setFilteredItems(
          items.filter((item) => item.orderPurchase === 1 && item.isKitchen)
        );
      case "second":
        return setFilteredItems(
          items.filter((item) => item.orderPurchase === 2 && item.isKitchen)
        );
      case "third":
        return setFilteredItems(
          items.filter((item) => item.orderPurchase === 3 && item.isKitchen)
        );
      default:
        return setFilteredItems(items.filter((item) => item.badge));
    }
  }, [items, type]);

  const getCategoryItems = useCallback(() => {
    if (isEmpty(category)) return;
    setFilteredItems(items.filter((item) => item.category === category));
  }, [category, items]);

  const getAllCategories = useCallback(() => {
    const filteredCategories = [];
    items.length &&
      items
        .sort((a, b) => a.isKitchen - b.isKitchen)
        .sort((a, b) => a.orderPurchase - b.orderPurchase)
        .filter((item) => filterCategoriesByOrder(item))
        .map((item) => filteredCategories.push(item.category));
    const result = filteredCategories.filter((value, index, self) => self.indexOf(value) === index);
    setUniqueCategories(result);
  }, [filterCategoriesByOrder, items]);

  const getSubItems = useCallback(() => {
    if (isEmpty(subcategory)) return;
    setFilteredItems(items.filter((x) => x.subcategory === subcategory));
  }, [items, subcategory]);

  const getAllSub = useCallback(() => {
    const filteredCategories = [];
    items.length &&
      items
        .filter((item) => item.category === category)
        .map((item) => filteredCategories.push(item.subcategory));
    const result = filteredCategories
      .filter((item) => item !== category)
      .filter((value, index, self) => self.indexOf(value) === index);
    setUniqueSubcategories(result);
  }, [category, items]);

  useEffect(() => {
    getAllData();
  }, [getAllData]);

  useEffect(() => {
    filterItemsByOrder();
  }, [filterItemsByOrder]);

  useEffect(() => {
    getCategoryItems();
  }, [getCategoryItems]);

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  useEffect(() => {
    getSubItems();
  }, [getSubItems]);

  useEffect(() => {
    getAllSub();
  }, [getAllSub]);

  return (
    <Container maxWidth="lg">
      <Box
        sx={styles.box.wrapper}
      >
        {resources.menuCategories.map((imageCategory) => (
          <Box
            sx={styles.box.imageCategory}
            key={imageCategory.source}
            onClick={onSearchOff}
          >
            <Link href={imageCategory.href}>
              <Image
                style={{ borderRadius: '16px' }}
                src={imageCategory.source}
                alt={imageCategory.source}
                width={75}
                height={75}
                objectFit="cover"
                priority
              />
            </Link>
          </Box>
        ))}
      </Box>
    {!isEmpty(type) && (
      <Box sx={{ textAlign: 'end' }}>
          <IconButton
            onClick={() => setExtendCategories(!extendCategories)}
          >
            {extendCategories ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </Box>
      )}
      {extendCategories && !isEmpty(type) && !searchItems.length && (
        <Box>
          <Box
            sx={styles.box.categories}
          >
            {uniqueCategories?.map((item) => (
                <CategoryTemplate
                  key={item}
                  title={item}
                  entrypoint={`/menu/${type}/${item}`}
                />
              ))}
          </Box>
          <Box sx={styles.box.categories}>
          {uniqueSubcategories?.map((item) => (
              <SubcategoryTemplate
                key={item}
                title={item}
                entrypoint={`/menu/${type}/${category}/${item}`}
              />
            ))}
          </Box>
        </Box>
      )}
      <Box sx={styles.box.items}>
        {searchItems?.map((item) => <ItemTemplate key={item._id} item={item} />)}
        {!searchItems?.length &&
          (!!filteredItems.length || !!items.length) &&
          !!filteredItems.length &&
          filteredItems.map((item) => <ItemTemplate key={item._id} item={item} />)}
        {!filteredItems.length &&
          !!items.length &&
          items.map((item) => <ItemTemplate key={item._id} item={item} />)}
      </Box>
    </Container>
  );
};

export default CategoryPage;
