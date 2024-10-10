"use client"
import React, { useState, useMemo, useCallback } from "react";
import { Container, Button, IconButton, Modal, TextField, TableContainer, Grid, Paper } from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material"; // Add shopping cart icon
import Swal from "sweetalert2";
import ClientForm from "../components/ClientForm";
import OrderSummary from "../components/OrderSummary";
import OrderTable from "../components/OrderTable";
import PaymentForm from "../components/PaymentForm";
import PDFOptions from "../components/PDFOptions";
import { createClient } from "../services/clientApi";
import { createDevis } from "../services/devisApi";
import { getAllProducts } from "../services/ProductService";
import { Product } from "../types/Product";
import OrderTableDevis from "../components/orderTableauDevis";


const Page: React.FC = () => {
    const [articlesPanier, setArticlesPanier] = useState<Product[]>([]);
    const [quantitesPanier, setQuantitesPanier] = useState<Record<number, number>>({});
    const [remises, setRemises] = useState<Record<number, number>>({});

    const [searchTerm, setSearchTerm] = useState<string>(""); // For product search
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantityToAdd, setQuantityToAdd] = useState<number>(1); // Quantity for the modal input
    const [openModal, setOpenModal] = useState<boolean>(false); // Modal state

    const [nomClient, setNomClient] = useState<string>("");
    const [adresseClient, setAdresseClient] = useState<string>("");
    const [telephoneClient, setTelephoneClient] = useState<string>("");

    const [optionPaiement, setOptionPaiement] = useState<string>("total");
    const [montantPartiel, setMontantPartiel] = useState<number>(0);

    const [afficherRemises, setAfficherRemises] = useState<boolean>(false);
    const [afficherRemisesTableau, setAfficherRemisesTableau] = useState<boolean>(true);


    const montantTotalAvantRemise = useMemo(
        () =>
            articlesPanier.reduce(
                (total, article) => total + (article.price ?? 0) * (quantitesPanier[article.id] || 0),
                0
            ),
        [articlesPanier, quantitesPanier]
    );

    const montantTotal = useMemo(
        () =>
            articlesPanier.reduce(
                (total, article) =>
                    total +
                    (article.price ?? 0) *
                    (quantitesPanier[article.id] || 0) *
                    (1 - (remises[article.id] || 0) / 100),
                0
            ),
        [articlesPanier, quantitesPanier, remises]
    );

    // Open modal and load products
    const handleOpenModal = () => {
        setOpenModal(true);
        getAllProducts()
            .then((products) => setFilteredProducts(products))
            .catch(() => Swal.fire("Erreur", "Erreur lors du chargement des produits", "error"));
    };

    // Close modal
    const handleCloseModal = () => {
        setOpenModal(false);
        setSearchTerm("");
    };

    // Search filter
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        setFilteredProducts((prev) =>
            prev.filter((product: Product) =>
                (product.description ?? "").toLowerCase().includes(value)
            )
        );
    };

    // Add selected product to cart
    const handleAddProductToCart = () => {
        if (!selectedProduct || quantityToAdd <= 0) {
            Swal.fire("Erreur", "Sélectionnez un produit et saisissez une quantité valide", "error");
            return;
        }

        // Check if the selected quantity exceeds the stock available
        if (quantityToAdd > (selectedProduct.quantity ?? 0)) {
            Swal.fire(
                "Stock insuffisant",
                `Vous essayez d'ajouter ${quantityToAdd} unités, mais il n'y a que ${selectedProduct.quantity} unités en stock.`,
                "warning"
            );
            return;
        }

        // If the product is already in the cart, update its quantity, otherwise add it
        const isProductInCart = articlesPanier.some(article => article.id === selectedProduct.id);
        if (isProductInCart) {
            setQuantitesPanier(prevQuantities => ({
                ...prevQuantities,
                [selectedProduct.id]: Math.min(
                    (prevQuantities[selectedProduct.id] || 0) + quantityToAdd,
                    selectedProduct.quantity ?? 0
                ),
            }));
        } else {
            setArticlesPanier(prev => [...prev, selectedProduct]);
            setQuantitesPanier(prevQuantities => ({
                ...prevQuantities,
                [selectedProduct.id]: quantityToAdd,
            }));
        }

        handleCloseModal();
    };

    const nouvelleDevis = useMemo(() => ({
        date: new Date().toLocaleDateString(),
        products: articlesPanier.map((article) => ({
            id: article.id,
            reference: article.id.toString(),
            description: article.description || "",
            quantity: quantitesPanier[article.id] || 0,
            price: article.price ?? 0,
            supplierPrice: article.supplierPrice ?? 0,
            discount: remises[article.id] ?? 0,
            finalPricePerUnit: (article.price ?? 0) * (1 - (remises[article.id] ?? 0) / 100),
            priceAfterDiscount: (article.price ?? 0) * (1 - (remises[article.id] ?? 0) / 100),
            totalPrice: (article.price ?? 0) * (quantitesPanier[article.id] || 0) * (1 - (remises[article.id] ?? 0) / 100),
            remize: remises[article.id] ?? null,
        })),
        amountAfterDiscount: montantTotal,
        amountPaid: montantPartiel,
        amountRemaining: montantTotal - montantPartiel,
    }), [articlesPanier, quantitesPanier, remises, montantTotal, montantPartiel]);





    const enregistrerDevis = useCallback(async () => {
        try {
            // Créer le client
            const clientResponse = await createClient({
                name: nomClient,
                address: adresseClient,
                phone: telephoneClient,
                totalAmountToPay: montantTotal,
                amountRemaining: montantTotal - montantPartiel,
            });

            // Récupérer l'ID du client créé
            const createdClientId = clientResponse.id ?? 0;

            // Créer laDevis après la création du client
            const Devis: Devis = {

                client: {
                    id: createdClientId,
                    name: nomClient,
                    address: adresseClient,
                    phone: telephoneClient,
                }, // Utiliser client au lieu de clientId
                date: new Date().toISOString(),
                amountBeforeDiscount: montantTotalAvantRemise,
                amountAfterDiscount: montantTotal,
                amountPaid: montantPartiel,
                amountRemaining: montantTotal - montantPartiel,
                totalAmount: montantTotal,
                clientId: createdClientId,
                products: articlesPanier.map((article) => {
                    const quantity = quantitesPanier[article.id] || 0;
                    const price = article.price ?? 0;
                    const discount = remises[article.id] ?? 0; // Utiliser "discount" au lieu de "remize"

                    return {
                        id: article.id,
                        reference: article.reference,
                        description: article.description,
                        quantity: quantity,
                        price: price,
                        supplierPrice: article.supplierPrice ?? 0,
                        discount: discount,
                        totalPrice: price * quantity * (1 - discount / 100),
                        product: article, // Add the product property
                    };
                }),
            };




            // Enregistrement de laDevis dans la base de données
            console.log("Devis envoyée à la base de données ", Devis);
            await createDevis(Devis);



            // Afficher un message de succès
            Swal.fire("Succès", "Devis enregistrée avec succès", "success");
        } catch (error) {
            // Afficher un message d'erreur
            console.error("Erreur lors de l'enregistrement de laDevis:", error);
            Swal.fire("Erreur", "Erreur lors de l'enregistrement de laDevis", "error");
        }
    }, [
        nomClient,
        adresseClient,
        telephoneClient,
        articlesPanier,
        quantitesPanier,
        montantTotalAvantRemise,
        montantTotal,
        montantPartiel,
    ]);

    const genererPDF = useCallback(async () => {
        try {
            console.log("Démarrage de la génération du PDF...");

            const { jsPDF } = await import("jspdf");
            console.log("jsPDF importé avec succès.");

            const autoTable = (await import("jspdf-autotable")).default;
            console.log("jspdf-autotable importé avec succès.");

            const doc = new jsPDF();
            console.log("Instance jsPDF créée.");

            const logo = require("../../public/logo.png");
            if (logo) {
                console.log("Logo trouvé, ajout au document.");
                try {
                    const imgData = (await import("../../public/logo.png")).default;
                    doc.addImage(imgData, "JPEG", 15, 10, 40, 20);
                    console.log("Logo ajouté au PDF.");
                } catch (error) {
                    console.error("Erreur lors de l'ajout du logo :", error);
                }
            }

            // Header
            doc.setFontSize(16);
            doc.setFont("Helvetica", "bold");
            doc.text("Devis", 195, 30, { align: "right" });
            doc.line(15, 35, 195, 35);
            console.log("Entête ajoutée au PDF.");

            // Client Information
            doc.setFontSize(12);
            doc.setFont("Helvetica", "normal");
            doc.text(`CLIENT: ${nomClient}`, 15, 45);
            doc.text(`Adresse: ${adresseClient}`, 15, 50);
            doc.text(`Téléphone: ${telephoneClient}`, 15, 55);
            doc.text(`Date: ${nouvelleDevis.date}`, 160, 45);
            doc.line(15, 65, 195, 65);
            console.log("Informations du client ajoutées au PDF.");

            // Product Table
            const headers = [
                "Référence",
                "Description",
                "Quantité",
                "P.U. TTC",
                ...(afficherRemises ? ["Remise (%)"] : []),
                ...(afficherRemises ? ["P.U.TTC après remise"] : []),
                "Total TTC"
            ];

            const productData = nouvelleDevis.products.map((product) => [
                product.reference,
                product.description,
                product.quantity,
                product.price,
                ...(afficherRemises ? [`${product.discount} %`] : []),
                ...(afficherRemises ? [product.priceAfterDiscount.toFixed(2)] : []),
                product.totalPrice.toFixed(2),
            ]);

            console.log("En-têtes de tableau définis : ", headers);


            try {
                autoTable(doc, {
                    startY: 70,
                    head: [headers],
                    body: productData,
                    theme: "striped",
                });
                console.log("Tableau des produits ajouté au PDF.");
            } catch (error) {
                console.error("Erreur lors de la génération du tableau :", error);
            }

            const finalY = (doc as any).autoTableEndPosY || 80;

            // Payment Information
            if (afficherRemisesTableau) {
                const montantRemise = (montantTotalAvantRemise - montantTotal).toFixed(2);
                const montantAvecRemise = nouvelleDevis.amountAfterDiscount.toFixed(2);

                const dataPaiement = [
                    ["Montant total sans remise", `${montantTotalAvantRemise.toFixed(2)} TND`],
                    ["Montant de remise", `${montantRemise} TND`],
                    ["Montant total avec remise", `${montantAvecRemise} TND`],
                ];

                autoTable(doc, {
                    startY: finalY + 20,
                    head: [['Description', 'Montant']],
                    body: dataPaiement,
                    theme: 'striped',
                });

                const finalTableY = (doc as any).lastAutoTable.finalY;
                doc.line(15, finalTableY, 195, finalTableY);
            }


            // Footer Section
            const addFooter = (finalY: number) => {
                doc.line(15, finalY + 5, 195, finalY + 5);
                doc.setFontSize(12);
                doc.setFont("Helvetica", "bold");
                doc.text(`Net à payer : ${nouvelleDevis.amountAfterDiscount.toFixed(2)} TND`, 140, finalY + 15);
                doc.setFont("Helvetica", "normal");

                addFooterDetails(finalY + 65);
            };

            const addFooterDetails = (yPosition: number) => {
                const pageHeight = doc.internal.pageSize.height;
                if (yPosition + 50 > pageHeight) {
                    doc.addPage();
                    yPosition = 15; // Reset Y position
                }

                doc.line(15, yPosition, 195, yPosition);
                doc.setFontSize(10);
                doc.setFont("Helvetica", "normal");
                doc.text("Ce document n'est reçu qu'une seule fois.", 105, yPosition + 45, { align: "center" });

                // Left side contact info
                doc.setFont("Helvetica", "bold");
                doc.text("MAKRAM CHOUIREF", 15, yPosition + 10);
                doc.setFont("Helvetica", "normal");
                doc.text("A côté de café Alquds, devant le marché des dattes,", 15, yPosition + 15);
                doc.text("4214 Jemna-Kébili", 15, yPosition + 20);
                doc.text("+216 29489741", 15, yPosition + 25);
                doc.text("Code TVA : 1679384/F", 15, yPosition + 30);

                // Right side contact info
                doc.setFont("Helvetica", "bold");
                doc.text("INFORMATIONS DE CONTACT :", 140, yPosition + 10);
                doc.setFont("Helvetica", "normal");
                doc.text("Makram Chouiref", 140, yPosition + 15);
                doc.text("M +216 27197304", 140, yPosition + 20);
                doc.text("@ chouiref055@gmail.com", 140, yPosition + 25);
            };

            // Adding Page Numbers
            const addPageNumbers = () => {
                const pageCount = doc.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.setFontSize(10);
                    doc.setFont("Helvetica", "normal");
                    doc.text(`Page ${i} / ${pageCount}`, 195, doc.internal.pageSize.height - 10, { align: "center" });
                }
            };

            const finalYPosition = (doc as any).lastAutoTable.finalY || 0;
            addFooter(finalYPosition);
            addPageNumbers();

            // Save the PDF
            const fileName = `Devis_${nouvelleDevis.date}.pdf`;
            doc.save(fileName);
            console.log("PDF enregistré avec le nom : ", fileName);

        } catch (error) {
            console.error("Erreur lors de la génération du PDF :", error);
            Swal.fire("Erreur", "Erreur lors de la génération du PDF", "error");
        }
    }, [nouvelleDevis, nomClient, adresseClient, telephoneClient, afficherRemises, afficherRemisesTableau, montantTotalAvantRemise, montantTotal]);


    return (
        <Container>

            <ClientForm
                nomClient={nomClient}
                setNomClient={setNomClient}
                adresseClient={adresseClient}
                setAdresseClient={setAdresseClient}
                telephoneClient={telephoneClient}
                setTelephoneClient={setTelephoneClient}
            />

            <PaymentForm
                optionPaiement={optionPaiement}
                setOptionPaiement={setOptionPaiement}
                montantPartiel={montantPartiel}
                setMontantPartiel={setMontantPartiel}
            />

            <PDFOptions
                afficherRemises={afficherRemises}
                setAfficherRemises={setAfficherRemises}
                afficherRemisesTableau={afficherRemisesTableau}
                setAfficherRemisesTableau={setAfficherRemisesTableau}
            />
            <TableContainer>
                <OrderTableDevis
                    articlesPanier={articlesPanier}
                    quantitesPanier={quantitesPanier}
                    remises={remises}
                    gererChangementRemise={(id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
                        setRemises((prevRemises) => ({
                            ...prevRemises,
                            [id]: parseFloat(event.target.value),
                        }));
                    }}
                    modifierArticle={(id: number, nouvelleQuantite: number) => {
                        setQuantitesPanier((prevQuantites) => ({
                            ...prevQuantites,
                            [id]: nouvelleQuantite,
                        }));
                    }}
                    supprimerArticle={(id: number) => {
                        setArticlesPanier((prevArticles) => prevArticles.filter((article) => article.id !== id));
                    }}
                />
            </TableContainer>

            <OrderSummary montantTotalAvantRemise={montantTotalAvantRemise} montantTotal={montantTotal} />

            <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ marginTop: 4 }}>
                {/* Button to open modal */}
                <Grid item>
                    <IconButton
                        color="primary"
                        onClick={handleOpenModal}
                        sx={{
                            backgroundColor: "#3f51b5",
                            color: "#fff",
                            "&:hover": {
                                backgroundColor: "#303f9f",
                            },
                            padding: 2,
                        }}
                    >
                        <AddShoppingCart sx={{ fontSize: 30 }} />
                    </IconButton>
                </Grid>

                {/* PDF Button */}
                <Grid item>
                    <Button
                        variant="contained"
                        onClick={genererPDF}
                        sx={{
                            backgroundColor: "#4caf50",
                            color: "#fff",
                            padding: "10px 20px",
                            "&:hover": {
                                backgroundColor: "#388e3c",
                            },
                        }}
                    >
                        Générer PDF
                    </Button>
                </Grid>

                {/* Finalize Order Button */}
                <Grid item>
                    <Button
                        variant="contained"
                        onClick={enregistrerDevis}
                        sx={{
                            backgroundColor: "#f44336",
                            color: "#fff",
                            padding: "10px 20px",
                            "&:hover": {
                                backgroundColor: "#d32f2f",
                            },
                        }}
                    >
                        Finaliser Devis
                    </Button>
                </Grid>
            </Grid>


            {/* Modal for adding products */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Paper style={{ padding: 20, margin: "100px auto", width: "400px" }}>
                    <h2>Ajouter un produit</h2>

                    <TextField
                        label="Rechercher un produit"
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearch}
                        variant="outlined"
                        style={{ marginBottom: "20px" }}
                    />

                    <ul style={{ maxHeight: "150px", overflowY: "auto", padding: 0 }}>
                        {filteredProducts.map((product: Product) => (
                            <li
                                key={product.id}
                                onClick={() => setSelectedProduct(product)}
                                style={{
                                    listStyleType: "none",
                                    padding: "10px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #ddd",
                                }}
                            >
                                {product.description}
                            </li>
                        ))}
                    </ul>

                    {selectedProduct && (
                        <>
                            <p style={{ marginTop: "20px" }}>Produit sélectionné: <strong>{selectedProduct.description}</strong></p>

                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={8}>
                                    <TextField
                                        type="number"
                                        label="Quantité"
                                        fullWidth
                                        value={quantityToAdd}
                                        onChange={(e) => setQuantityToAdd(parseInt(e.target.value))}
                                        variant="outlined"
                                    />
                                </Grid>

                            </Grid>
                        </>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleAddProductToCart}
                        disabled={!selectedProduct || quantityToAdd <= 0}
                        style={{ marginTop: "20px" }}
                    >
                        Ajouter au panier
                    </Button>
                </Paper>
            </Modal>

        </Container>
    );
};

export default Page;
