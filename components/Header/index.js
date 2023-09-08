import React, {
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import MenuBookSharpIcon from '@mui/icons-material/MenuBookSharp';
import HomeSharpIcon from '@mui/icons-material/HomeSharp';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import InputBase from "@mui/material/InputBase";
import AppBar from "@mui/material/AppBar";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Input from "@mui/material/Input";
import { styled, alpha } from "@mui/material/styles";
import { useAppContext } from "context/AppContext";
import config from "styles/config";

export const Search = styled("div")(({ theme }) => ({
  display: "flex",
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: config.color.white,
  marginLeft: 0,
  width:"60%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "min-content",
  },
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: config.color.black,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 100,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  const {
    isAuthenticated,
    username,
    onChangeSearch,
    onChangeTableNumber,
    numberOfTable,
    isAdmin,
    result,
    onSearchOff,
    onSearchOpen,
    open,
  } = useAppContext();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menu = useMemo(() => router.pathname.includes('/menu'), [router.pathname]);

  if (!isAuthenticated) return null;

  return (
    <Box>
      <AppBar position="fixed" sx={{ background: config.color.white }}>
        <Toolbar>
          <Box sx={{ display: "flex", justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: "flex" }}>
              <Typography
                onClick={handleClick}
                sx={{
                  minWidth: "auto",
                  padding: "0px 10px",
                  color: config.color.black,
                  alignSelf: "center",
                  cursor: "pointer",
                  mr: 2,
                  fontWeight: 700,
                }}
              >
                {numberOfTable}
              </Typography>
              <StyledMenu
                MenuListProps={{
                  "aria-labelledby": "demo-customized-button",
                }}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem>
                  <Input
                    onChange={onChangeTableNumber}
                    sx={{ width: "50px", margin: "5px" }}
                    type="number"
                  />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Typography onClick={() => router.push(isAdmin ? `/admin/tables/${numberOfTable}` : '/order')}>
                    Current table
                  </Typography>
                </MenuItem>
              </StyledMenu>
            </Box>
            <Box sx={{ display: "flex", mr: '50px' }}>
              {isAdmin ? (
                <IconButton
                  onClick={() => router.push('/admin/panel/menu')}
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                >
                  <AdminPanelSettingsIcon fontSize="large" sx={{ color: config.color.black }}/>
                </IconButton>
                ) : (
                <Typography sx={{ color: 'black', alignSelf: 'center' }} >{username}</Typography>
              )}
              <Link href="/">
                <IconButton sx={{ color: config.color.black }}>
                  <HomeSharpIcon fontSize="large"/>
                </IconButton>
              </Link>
              <Link href="/menu">
                <IconButton sx={{ color: config.color.black }}>
                  <MenuBookSharpIcon fontSize="large" />
                </IconButton>
              </Link>
            </Box>
            <Box sx={{ display: "flex" }}>
              {menu && (
                <IconButton
                  sx={{ color: config.color.black, position: 'fixed', right: { xs: 62, sm: 70 }, top: { xs: 5, sm: 9 } }}
                  onClick={() => onSearchOpen(true)}
                >
                  <SearchSharpIcon fontSize="large" />
                </IconButton>
              )}
              {isAdmin && (
              <IconButton color="inherit">
                <Badge badgeContent={0} sx={{ color: config.color.black }}>
                  <Link href="/admin/tables">
                    <ViewModuleIcon fontSize="large" />
                  </Link>
                </Badge>
              </IconButton>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      {open && menu && (
        <Box sx={{ pt: '70px', mb: '-70px', textAlign: '-webkit-right' }}>
          <Search>
            <StyledInputBase
              onChange={onChangeSearch}
              placeholder="Search..."
              inputProps={{ "aria-label": "search" }}
              sx={{ color: result && config.color.warning }}
            />
            <IconButton sx={{ color: config.color.black }}>
              <SearchOffIcon
                onClick={onSearchOff}
              />
            </IconButton>
          </Search>
        </Box>
      )}
    </Box>
  );
};

export default Header;
