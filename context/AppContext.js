import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/router";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import api from "utils/api";
import enums from "utils/enums";
import useNotify from 'hooks/useNotify';

const AppContext = createContext({});

export const AppWrapper = ({ children }) => {
  const [user, setUser] = useState(null);
  const [result, setResult] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchItems, setSearchItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [numberOfTable, setNumberOfTable] = useState(0);
  const [local, setLocal] = useState({});

  const router = useRouter();
  const notify = useNotify();

  const addNotification = useCallback((notification) => setNotifications(
    (prevNotifications) => [...prevNotifications, notification],
  ), []);

  const takeNotification = useCallback(() => {
    const [notification, ...rest] = notifications;
    setNotifications(rest);

    return notification;
  }, [notifications]);

  const resetNotifications = useCallback(() => setNotifications([]), []);

  const login = useCallback((userData) => setUser(userData), []);

  const getUser = useCallback(() => {
    if (!isEmpty(local.token)) {
      const value = {
        username: local.username,
        token: local.token,
        userId: local.userId,
        isAdmin: local.isAdmin,
      }
      setUser(value);
    } 
  }, [local]);

  const onSearch = useCallback(async (query) => {
    if (!query || !query.trim()) return;
    try {
      const token = localStorage.getItem(enums.config.storage.token);
      const response = await api.get(`/api/search/${query.trim()}`, {}, {}, token);
      setSearchItems(response.data);
      setResult(!response.data.length);
    } catch (err) {
      notify('Search failed!', { type: 'error' });
    }
  }, [notify]);

  const debounceSearch = useCallback(debounce((query) => onSearch(query), 500), [onSearch]);
  
  const onChangeSearch = useCallback((event) => {
    if (event.target.value.length > 0) debounceSearch(event.target.value);
  }, [debounceSearch]);

  const onClearSearch = useCallback(() =>  setSearchItems([]), []);

  const onClean = useCallback(() => {
    if (!router.pathname.includes('/menu'))  setSearchItems([]);
  }, [router.pathname]);

  const onChangeTableNumber = useCallback((event) => {
    const { target: { value } } = event;
    if (!value.trim()) return;
    localStorage.setItem('table', value);
    setNumberOfTable(value);
  }, []);

  const onQueryTableNumber = useCallback((number) => {
    localStorage.setItem('table', number);
    setNumberOfTable(number);
  }, []);

  const onSearchOff = useCallback(() => {
    onClearSearch();
    setOpen(false);
  }, [onClearSearch]);

  const onSearchOpen = useCallback((boolean) => {setOpen(boolean)}, []);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const table = localStorage.getItem('table');
    const isAdmin = localStorage.getItem('isAdmin');
    setLocal({
      username,
      token,
      userId,
      table,
      isAdmin: isAdmin === 'true',
    });
  }, []);

  useEffect(() => {
    onClean();
  }, [onClean]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (!isEmpty(local.table)) setNumberOfTable(local.table);
  }, [local.table]);

  const value = useMemo(() => ({
    notifications,
    isAuthenticated: !!user?.username,
    username: user?.username,
    token: user?.token,
    userId: user?.userId,
    isAdmin: user?.isAdmin,
    searchItems,
    numberOfTable,
    local,
    result,
    open,
    addNotification,
    login,
    onChangeSearch,
    onClearSearch,
    resetNotifications,
    takeNotification,
    onChangeTableNumber,
    onQueryTableNumber,
    onSearchOff,
    onSearchOpen,
  }), [
    local,
    result,
    notifications,
    numberOfTable,
    searchItems,
    user?.isAdmin, 
    user?.token, 
    user?.userId, 
    user?.username,
    open,
    addNotification,
    onChangeSearch,
    onClearSearch,
    login,
    resetNotifications,
    takeNotification,
    onChangeTableNumber,
    onQueryTableNumber,
    onSearchOff,
    onSearchOpen,
  ]);

  return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  return useContext(AppContext);
}
