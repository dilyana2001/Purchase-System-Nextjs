import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
  } from "react";
  import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    PDFViewer,
} from '@react-pdf/renderer';
  import moment from "moment";
  import isEmpty from "lodash/isEmpty";
  import useNotify from 'hooks/useNotify';
  import api from "utils/api";
  import enums from "utils/enums";
  
  const styles = StyleSheet.create({
    typography: {
      my: '15px',
    },
    page: {
      flexDirection: 'row',
    },
    item: {
      whiteSpace: 'break-spaces',
      my: '5px',
      flexDirection: 'row',
    },
    comment: {
      whiteSpace: 'break-spaces',
      m: '5px',
      fontSize: '10pt',
    },
    view: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
  });
  
  function KitchenBar({ number }) {
    const [items, setItems] = useState([]);
    const notify = useNotify();
  
    const stackItems = useMemo(() => {
      const notPurchased = items.filter((item) => !item.purchased);
      const result = notPurchased.reduce((x, y) => {
        (x[y.title] = x[y.title] || []).push(y);
        return x;
      }, {});
  
    return result;
    }, [items]);
  
    const getMenuItems = useCallback((kitchen = false, order = 0) => (
      Object.entries(stackItems)
        .filter((item) => item[1][0].isKitchen === kitchen)
        .filter((item) => item[1][0].orderPurchase === order)
        .map(([title, valueItems]) => (
          <View key={title} sx={styles.view}>
            <Text sx={styles.item}>
              {valueItems.length} x {title}{' '}
            </Text>
          {kitchen && (
            <View sx={styles.view}>
              {valueItems.map((item) => (
                <Text
                  key={item.comment}
                  sx={styles.comment}
                >
                  {item.comment && `1 - ${item.comment}`} 
                </Text>
              ))}
          </View>)}
        </View>
      ))
    ), [stackItems]);
  
    const getPurchaseByTable = useCallback(async () => {
      if (isEmpty(number)) return;
      try {
        const token = localStorage.getItem(enums.config.storage.token);
        const response = await api.get(`/api/user/purchases/table/${number}`, {}, {}, token);
        setItems(response.data)
      } catch (err) {
        notify('Fetching failed!', { type: 'error' });
      }
    }, [notify, number]);
  
    const onClick = useCallback(() => {
      try {
        window.print();
        const token = localStorage.getItem(enums.config.storage.token);
        items.filter((el) => !el.purchased).map(async (item) => {
          if (isEmpty(item._id)) return;
          await api.update(`/api/user/purchases/${item._id}`, { ...item, purchased: true }, {}, token);
        });
        notify('Successfully purchased!', { type: 'success' });
      } catch (err) {
        notify('Purchased failed!', { type: 'error' });
      }
    }, [items, notify]);
  
    useEffect(() => {
      getPurchaseByTable();
    }, [getPurchaseByTable]);
  
    return (
      <PDFViewer>
        <Document onClick={onClick}>
          <Page sx={styles.page} size="A5">
            <View sx={styles.view}>
              <Text sx={styles.typography}>
                {moment().format('hh:mm:ss')}
              </Text>
              {/* <Divider sx={{ background: config.color.black }} /> */}
              {getMenuItems(true, 1)}
              {/* <Divider sx={{ background: config.color.black }} /> */}
              {getMenuItems(true, 2)}
              {/* <Divider sx={{ background: config.color.black }} /> */}
              {getMenuItems(true, 3)}
            </View>
          </Page>
          <Page sx={styles.page} size="A5">
            <View sx={{ mt: '10px', ...styles.view }}>
              <Text sx={styles.typography}>
                {moment().format('hh:mm:ss')}
              </Text>
              {getMenuItems()}
              {/* <Divider sx={{ background: config.color.black }} /> */}
            </View>
          </Page>
        </Document>
      </PDFViewer>
    );
  };

  export default KitchenBar;