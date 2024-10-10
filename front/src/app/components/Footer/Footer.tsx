import React from "react";
import { Container, Grid, Typography, IconButton, Link } from "@mui/material";
import { Facebook, Phone, Mail, LocationOn } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled components
const FooterContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.common.white,
  padding: "20px 0",
  [theme.breakpoints.down("sm")]: {
    padding: "10px 0",
  },
}));

const FooterSection = styled(Grid)(({ theme }) => ({
  marginBottom: "10px",
  textAlign: "center", // Center text for all items
  [theme.breakpoints.down("sm")]: {
    marginBottom: "5px",
  },
}));

const FooterIcon = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
  margin: "0 8px",
  padding: "8px", // Add padding for better touch targets
  [theme.breakpoints.down("sm")]: {
    margin: "0 4px",
  },
}));

const Footer: React.FC = () => {
  return (
    <FooterContainer maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <FooterSection container direction="column" alignItems="center">
            <img
              src="/path-to-your-logo/logo.jpg" // Replace with the path to your logo
              alt="Logo"
              style={{ width: "100px", height: "auto", marginBottom: "10px" }}
            />
            <Typography variant="h6" gutterBottom>
              Makram Chouiref
            </Typography>
            <Typography variant="body1">
              À côté de café Alquds devant le marché des dattes, 4214 Jemna-Kébili
            </Typography>
            <Typography variant="body1">Code TVA : 1679384/F</Typography>
            <Typography variant="body1">BON DE LIVRAISON N° BL-000185</Typography>
          </FooterSection>
        </Grid>
        <Grid item xs={12} md={4}>
          <FooterSection container direction="column" alignItems="center">
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <FooterIcon aria-label="phone">
              <Phone />
              <Typography variant="body1" sx={{ ml: 1 }}>
                +216 27 197 304
              </Typography>
            </FooterIcon>
            <FooterIcon aria-label="email">
              <Mail />
              <Typography variant="body1" sx={{ ml: 1 }}>
                <Link href="mailto:chouiref055@gmail.com" color="inherit">
                  chouiref055@gmail.com
                </Link>
              </Typography>
            </FooterIcon>
            <FooterIcon aria-label="location">
              <LocationOn />
              <Typography variant="body1" sx={{ ml: 1 }}>
                À côté de café Alquds devant le marché des dattes, 4214 Jemna-Kébili
              </Typography>
            </FooterIcon>
            <FooterIcon aria-label="facebook">
              <Facebook />
              <Link
                href="https://www.facebook.com/Makram.chouiref"
                color="inherit"
                sx={{ ml: 1 }}
              >
                Facebook
              </Link>
            </FooterIcon>
          </FooterSection>
        </Grid>
        <Grid item xs={12} md={4}>
          <FooterSection container direction="column" alignItems="center">
            <Typography variant="h6" gutterBottom>
              Informations
            </Typography>
            <Typography variant="body1">
              Système Goutte à Goutte Domaine AG
            </Typography>
            <Typography variant="body1">+216 294 897 41</Typography>
            <Typography variant="body1">Code TVA : 1679384/F</Typography>
          </FooterSection>
        </Grid>
      </Grid>
    </FooterContainer>
  );
};

export default Footer;
