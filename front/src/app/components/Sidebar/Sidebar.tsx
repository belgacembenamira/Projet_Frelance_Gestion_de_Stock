import React, { useState, useCallback, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Inventory,
  Person,
  Receipt,
  Home,
  Menu as MenuIcon,
  Description,
  LocalShipping, // New icon for fournisseur
  AddCircle, // New icon for addfournisseur
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.png";

const drawerWidth = 240; // Default drawer width

// Create a styled component with dynamic width
const StyledDrawer = styled(Drawer)<{ drawerWidth: number }>(({ theme, drawerWidth }) => ({
  [theme.breakpoints.up("md")]: {
    width: drawerWidth,
    flexShrink: 0,
  },
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

const Logo = styled(Image)({
  width: "100%",
  height: "auto",
  margin: "16px 0",
});

const Sidebar: React.FC = React.memo(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adjustedDrawerWidth, setAdjustedDrawerWidth] = useState(drawerWidth);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prevState) => !prevState);
  }, []);

  useEffect(() => {
    // Update the drawer width based on the screen size
    const updateDrawerWidth = () => {
      if (window.innerWidth < 600) {
        setAdjustedDrawerWidth(window.innerWidth * 0.7); // 70% width on small screens
      } else {
        setAdjustedDrawerWidth(drawerWidth); // Default width
      }
    };

    // Add event listener for resize
    window.addEventListener("resize", updateDrawerWidth);
    updateDrawerWidth(); // Initial call

    return () => {
      window.removeEventListener("resize", updateDrawerWidth);
    };
  }, []);

  // Add new navigation items for Fournisseur and Add Fournisseur
  const navigationItems = [
    { text: "Bon de Livraison", icon: <Home />, href: "/" },
    { text: "Liste Clients", icon: <Person />, href: "/ListeClient" },
    { text: "Facture", icon: <Receipt />, href: "/ListeCommande" },
    { text: "Stock", icon: <Inventory />, href: "/stock" },
    { text: "Bon de reception", icon: <LocalShipping />, href: "/fourniseur" },  // Fournisseur route
    { text: "Ajouter Fournisseur", icon: <AddCircle />, href: "/addfourniseur" },  // Add Fournisseur route
  ];

  const devisItems = [
    { text: "Devis Commande", icon: <Description />, href: "/devisCommande" },
    { text: "Devis Tableau", icon: <Receipt />, href: "/devisTableau" },
  ];

  const drawerContent = (
    <>
      <div style={{ padding: "16px" }}>
        <Link href="/" passHref>
          <Button style={{ padding: 0 }}>
            <Logo src={logo} alt="Logo" />
          </Button>
        </Link>
      </div>
      <Divider />
      <List>
        {navigationItems.map(({ text, icon, href }) => (
          <ListItem
            button
            component={Link}
            href={href}
            key={text}
            aria-label={text}
            onClick={isMobile ? handleDrawerToggle : undefined}
          >
            <ListItemIcon style={{ color: theme.palette.common.white }}>
              {icon}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
        <Divider style={{ backgroundColor: theme.palette.common.white }} />
        <ListItem>
          <ListItemText
            primary="Devis"
            style={{ color: theme.palette.common.white, paddingLeft: "16px" }}
          />
        </ListItem>
        {devisItems.map(({ text, icon, href }) => (
          <ListItem
            button
            component={Link}
            href={href}
            key={text}
            aria-label={text}
            onClick={isMobile ? handleDrawerToggle : undefined}
          >
            <ListItemIcon style={{ color: theme.palette.common.white }}>
              {icon}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Nom de l'Application
            </Typography>
          </Toolbar>
        </AppBar>
      )}
      <nav aria-label="sidebar navigation">
        <StyledDrawer
          drawerWidth={adjustedDrawerWidth} // Pass the adjusted width
          variant={isMobile ? "temporary" : "permanent"}
          anchor="left"
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawerContent}
        </StyledDrawer>
      </nav>
    </>
  );
});

export default Sidebar;
