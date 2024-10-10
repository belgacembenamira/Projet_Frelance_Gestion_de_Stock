"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useCommandes } from "../hooks/useCommandes";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
} from "@mui/material";
import Swal from "sweetalert2";

import { Commande } from "../types/Commande";
import CommandeRow from "../components/CommandeRow";
import CommandeDialog from "../components/CommandeDialog";
import SearchFilters from "../components/SearchFilters";

// Memoizing the page component to avoid unnecessary re-renders
const Page: React.FC = React.memo(() => {
    const { commandes = [], removeCommande } = useCommandes(); // Fetch commandes from custom hook
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState<Commande | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchName, setSearchName] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [printType, setPrintType] = useState<string | null>(null);
    const [afficherRemisesTableau, setAfficherRemisesTableau] = useState(false);
    const [afficherPaiementInfo, setAfficherPaiementInfo] = useState(false);

    const handleToggleRemises = () => setAfficherRemisesTableau((prev) => !prev);
    const handleTogglePaiementInfo = () => setAfficherPaiementInfo((prev) => !prev);

    // Memoized delete handler
    // Memoized delete handler
    const handleDelete = useCallback(
        async (id: number) => {
            const result = await Swal.fire({
                title: "Êtes-vous sûr?",
                text: "Cela supprimera définitivement la commande.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Oui, supprimer!",
                cancelButtonText: "Non, annuler!",
            });
            if (result.isConfirmed) {
                await removeCommande(id);
            }
        },
        [removeCommande]
    );

    // Memoized view details handler
    const handleViewDetails = useCallback((commande: Commande) => {
        const generateDetailsHtml = (commande: Commande) => {
            const productsHtml = commande.products
                .map((productCommande) => {
                    const product = productCommande.product;
                    const price = product.price || 0;
                    const discount = parseFloat(productCommande.discount?.toString() || "0");
                    const priceAfterDiscount = price - price * (discount / 100);
                    const totalPrice = priceAfterDiscount * productCommande.quantity;

                    return `
                <tr>
                  <td>${product.description}</td>
                  <td>${product.reference}</td>
                  <td>${productCommande.quantity}</td>
                  <td>${price}</td>
                  <td>${discount} %</td>
                  <td>${totalPrice}</td>
                </tr>
            `;
                })
                .join("");

            return `
            <div>
                <h3>Détails de la commande</h3>
                <p><strong>ID de la commande:</strong> ${commande.id}</p>
                <p><strong>Date:</strong> ${new Date(commande.date).toLocaleString()}</p>
               <p><strong>Montant avant remise:</strong> ${commande.amountBeforeDiscount ? commande.amountBeforeDiscount : "0.00"}</p>
<p><strong>Montant après remise:</strong> ${commande.amountAfterDiscount ? commande.amountAfterDiscount : "0.00"}</p>
<p><strong>Montant payé:</strong> ${commande.amountPaid ? commande.amountPaid : "0.00"}</p>


                <h4>Produits:</h4>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #ddd; padding: 8px;">Produit</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Référence</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Quantité</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Prix unitaire</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Remise</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Prix total après remise</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productsHtml}
                    </tbody>
                </table>
            </div>
        `;
        };

        Swal.fire({
            title: `Détails de la commande ID: ${commande.id ?? "N/A"}`,
            html: generateDetailsHtml(commande),
            showCloseButton: true,
            width: "80%",
        });
    }, []);


    // Memoized edit handler
    const handleEdit = useCallback((commande: Commande) => {
        setFormData(commande);
        setOpenDialog(true);
    }, []);

    // Filter and paginate commandes
    const filteredCommandes = useMemo(() => {
        return commandes.filter((commande) => {
            const clientNameMatch = commande.client?.name?.toLowerCase().includes(searchName.toLowerCase()) ?? false;
            const dateMatch = new Date(commande.date).toLocaleDateString().includes(searchDate);
            return clientNameMatch && (searchDate === "" || dateMatch);
        });
    }, [commandes, searchName, searchDate]);

    const paginatedCommandes = useMemo(
        () => filteredCommandes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [filteredCommandes, page, rowsPerPage]
    );

    return (
        <>
            {/* Search Filters */}
            <SearchFilters
                searchName={searchName}
                setSearchName={setSearchName}
                searchDate={searchDate}
                setSearchDate={setSearchDate}
            />
            {/* Boutons pour afficher/masquer les remises et les infos de paiement */}
            <div>
                <button onClick={handleToggleRemises}>
                    {afficherRemisesTableau ? "Masquer Remises" : "Afficher Remises"}
                </button>
                <button onClick={handleTogglePaiementInfo}>
                    {afficherPaiementInfo ? "Masquer Infos de Paiement" : "Afficher Infos de Paiement"}
                </button>
            </div>

            {/* Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Client</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedCommandes.map((commande) => (
                            <CommandeRow
                                key={commande.id}
                                commande={commande}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                handleViewDetails={handleViewDetails}
                                printType={printType ?? ""}
                                setPrintType={setPrintType}
                                afficherRemisesTableau={afficherRemisesTableau}
                                afficherPaiementInfo={afficherPaiementInfo}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredCommandes.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
            />

            {/* Commande Dialog */}
            <CommandeDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                formData={formData}
            />
        </>
    );
});

export default Page;
