"use client";
import React, { useState } from "react";
import {
  Button,
  TextField,
  Container,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSuppliers } from "../hooks/useSuppliers";
import { Supplier } from "../types/Supplier";

// Composant pour ajouter un fournisseur
const FormulaireFournisseur: React.FC<{
  nouveauFournisseur: Supplier;
  gererChangement: (e: React.ChangeEvent<HTMLInputElement>) => void;
  gererAjoutFournisseur: () => Promise<void>;
  chargement: boolean;
}> = ({ nouveauFournisseur, gererChangement, gererAjoutFournisseur, chargement }) => {
  return (
    <div>
      <h2>Ajouter un Fournisseur</h2>
      <TextField
        label="Nom légal"
        name="name"
        value={nouveauFournisseur.name}
        onChange={gererChangement}
        fullWidth
        required
      />
      <TextField
        label="Matricule Fiscal"
        name="matriculeFiscal"
        value={nouveauFournisseur.matriculeFiscal || ""}
        onChange={gererChangement}
        fullWidth
      />
      {/* <TextField
        label="Code TVA"
        name="codeTVA"
        value={nouveauFournisseur.codeTVA || ""}
        onChange={gererChangement}
        fullWidth
      /> */}
      <TextField
        label="Code Categorie"
        name="codeCategorie"
        value={nouveauFournisseur.codeCategorie || ""}
        onChange={gererChangement}
        fullWidth
      />
      <TextField
        label="Téléphone de contact"
        name="contactPhone"
        value={nouveauFournisseur.contactPhone || ""}
        onChange={gererChangement}
        fullWidth
      />
      <TextField
        label="N° Établissement Secondaire"
        name="nEtabSecondaire"
        value={nouveauFournisseur.nEtabSecondaire || ""}
        onChange={gererChangement}
        fullWidth
      />
      <TextField
        label="Adresse (Rue)"
        name="rue"
        value={nouveauFournisseur.rue || ""}
        onChange={gererChangement}
        fullWidth
      />
      <TextField
        label="Email"
        name="email"
        value={nouveauFournisseur.email}
        onChange={gererChangement}
        fullWidth
        required
      />
      <Button
        variant="contained"
        color="primary"
        onClick={gererAjoutFournisseur}
        disabled={chargement}
      >
        {chargement ? <CircularProgress size={24} /> : "Ajouter le Fournisseur"}
      </Button>
    </div>
  );
};

// Composant pour lister les fournisseurs
const ListeFournisseurs: React.FC<{
  fournisseurs: Supplier[];
  gererSuppressionFournisseur: (id: number) => Promise<void>;
}> = ({ fournisseurs, gererSuppressionFournisseur }) => {
  return (
    <List>
      {fournisseurs.map(
        (fournisseur) =>
          fournisseur.id !== undefined && (
            <ListItem key={fournisseur.id}>
              <ListItemText
                primary={fournisseur.name}
                secondary={fournisseur.email}
              />
              <IconButton
                onClick={() =>
                  fournisseur.id !== undefined &&
                  gererSuppressionFournisseur(fournisseur.id)
                }
                edge="end"
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          )
      )}
    </List>
  );
};

// Composant principal
const Fournisseurs = () => {
  const { suppliers: fournisseurs, loading: chargement, error: erreur, addSupplier: ajouterFournisseur, deleteSupplier: supprimerFournisseur } =
    useSuppliers();
  const [nouveauFournisseur, setNouveauFournisseur] = useState<Supplier>({
    name: "",
    matriculeFiscal: "",
    codeTVA: "",
    codeCategorie: "",
    nEtabSecondaire: "",
    rue: "",
    email: "",
  });

  const [erreurFormulaire, setErreurFormulaire] = useState("");
  const [messageSucces, setMessageSucces] = useState("");

  // Validation du formulaire
  const validerFormulaire = (): boolean => {
    const motifEmail =
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (!nouveauFournisseur.name || !nouveauFournisseur.email) {
      setErreurFormulaire("Les champs obligatoires doivent être remplis");
      return false;
    }

    if (!motifEmail.test(nouveauFournisseur.email)) {
      setErreurFormulaire("Format d'email invalide");
      return false;
    }

    setErreurFormulaire("");
    return true;
  };

  // Gestion des changements dans le formulaire
  const gererChangement = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNouveauFournisseur((prev) => ({ ...prev, [name]: value }));
  };

  // Ajout d'un nouveau fournisseur
  const gererAjoutFournisseur = async () => {
    if (!validerFormulaire()) return;

    try {
      await ajouterFournisseur(nouveauFournisseur);
      setNouveauFournisseur({
        name: "",
        matriculeFiscal: "",
        codeTVA: "",
        codeCategorie: "",
        nEtabSecondaire: "",
        rue: "",
        email: "",
        contactPhone: "",
      });
      setMessageSucces("Fournisseur ajouté avec succès !");
      setTimeout(() => setMessageSucces(""), 3000);
    } catch (error) {
      console.error("Échec de l'ajout du fournisseur:", error);
      setErreurFormulaire("Échec de l'ajout du fournisseur, veuillez réessayer");
    }
  };

  // Suppression d'un fournisseur
  const gererSuppressionFournisseur = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?")) {
      try {
        await supprimerFournisseur(id);
        setMessageSucces("Fournisseur supprimé avec succès !");
        setTimeout(() => setMessageSucces(""), 3000);
      } catch (error) {
        console.error("Échec de la suppression du fournisseur:", error);
        setErreurFormulaire("Échec de la suppression du fournisseur, veuillez réessayer");
      }
    }
  };

  return (
    <Container>
      <h1>Fournisseurs</h1>
      {chargement && <CircularProgress />}
      {erreur && <Alert severity="error">{erreur.message}</Alert>}
      {erreurFormulaire && <Alert severity="error">{erreurFormulaire}</Alert>}
      {messageSucces && <Alert severity="success">{messageSucces}</Alert>}

      <FormulaireFournisseur
        nouveauFournisseur={nouveauFournisseur}
        gererChangement={gererChangement}
        gererAjoutFournisseur={gererAjoutFournisseur}
        chargement={chargement}
      />

      <h2>Liste des Fournisseurs</h2>
      <ListeFournisseurs
        fournisseurs={fournisseurs || []}
        gererSuppressionFournisseur={gererSuppressionFournisseur}
      />
    </Container>
  );
};

export default Fournisseurs;
