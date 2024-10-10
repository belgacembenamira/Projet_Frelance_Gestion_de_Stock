import React, { useState, useCallback, useMemo } from "react";
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
import { Devis } from "../types/Devis";
import { useDevis } from "../hooks/useDevis"; // Importation correcte du hook
import CommandeDialog from "./CommandeDialog"; // Composant pour la modification
import DevisRow from "./DevisRow";
import SearchFilters from "./SearchFilters"; // Composant pour les filtres de recherche
import { transformDevisToCommande } from "../services/devisApi";

const DevisTableau = () => {
    const { removeDevis, devis: devisList } = useDevis();
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState<Devis | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchName, setSearchName] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [printType, setPrintType] = useState<string | null>(null);

    const handleTransformToCommande = async (devisId: number) => {
        try {
            await transformDevisToCommande(devisId);
            Swal.fire({
                title: "Succès",
                text: "Le devis a été transformé en commande avec succès.",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error: any) {
            console.error("Failed to transform devis to commande:", error);
            Swal.fire({
                title: "Erreur",
                text: error?.response?.data?.message || error.message || "Une erreur est survenue.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const handleDelete = useCallback(async (id: number) => {
        const result = await Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Cette action supprimera définitivement le devis.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui, supprimer!",
            cancelButtonText: "Non, annuler!",
        });

        if (result.isConfirmed) {
            await removeDevis(id);
        }
    }, [removeDevis]);

    const handleViewDetails = useCallback((devis: Devis) => {
        const generateDetailsHtml = (devis: Devis) => {
            const productsHtml = devis.products
                .map((productCommande) => {
                    const product = productCommande.product;
                    const price = product.price || 0;
                    const discount = parseFloat(productCommande.discount?.toString() || "0") || 0;
                    const priceAfterDiscount = price - (price * (discount / 100));
                    const totalPrice = priceAfterDiscount * productCommande.quantity;

                    return `
                        <div>
                            <p><strong>Produit:</strong> ${product.description} (Réf: ${product.reference})</p>
                            <p><strong>Quantité:</strong> ${productCommande.quantity}</p>
                            <p><strong>Prix unitaire:</strong> ${price}</p>
                            <p><strong>Remise:</strong> ${discount}%</p>
                            <p><strong>Prix total après remise:</strong> ${totalPrice}</p>
                        </div>
                    `;
                })
                .join('');

            return `
                <div>
                    <p><strong>ID de la Devis:</strong> ${devis.id}</p>
                    <p><strong>Date:</strong> ${new Date(devis.date).toLocaleString()}</p>
                    <p><strong>Montant avant remise:</strong> ${devis.amountBeforeDiscount || 'N/A'}</p>
                    <p><strong>Montant après remise:</strong> ${devis.amountAfterDiscount || 'N/A'}</p>
                    <p><strong>Montant payé:</strong> ${devis.amountPaid || 'N/A'}</p>
                    <p><strong>Montant restant:</strong> ${devis.amountRemaining || 'N/A'}</p>
                    <p><strong>Produits:</strong></p>
                    ${productsHtml}
                </div>
            `;
        };

        Swal.fire({
            title: `Détails de la Devis ID: ${devis.id}`,
            html: generateDetailsHtml(devis),
            showCloseButton: true,
            width: '80%',
        });
    }, []);

    const handleEdit = useCallback((devis: Devis) => {
        setFormData(devis);
        setOpenDialog(true);
    }, []);

    const filteredDevis = useMemo(() => {
        return devisList.filter((devis) => {
            const clientNameMatch = devis.client?.name?.toLowerCase().includes(searchName.toLowerCase()) ?? false;
            const dateMatch = new Date(devis.date).toLocaleDateString().includes(searchDate);
            return clientNameMatch && (searchDate === "" || dateMatch);
        });
    }, [devisList, searchName, searchDate]);

    const paginatedDevis = filteredDevis.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <>
            <SearchFilters
                searchName={searchName}
                setSearchName={setSearchName}
                searchDate={searchDate}
                setSearchDate={setSearchDate}
            />

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
                        {paginatedDevis.map((devis: Devis) => (
                            <DevisRow
                                key={devis.id}
                                devis={devis} // Corrected casing
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                handleViewDetails={handleViewDetails}
                                handleTransformToCommande={handleTransformToCommande}
                                printType={printType ?? 'devis'}
                                setPrintType={setPrintType}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredDevis.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
            />

            <CommandeDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                formData={formData}
            />
        </>
    );
};

export default DevisTableau;
