"use client";
import React, { ChangeEvent, useState, useCallback, useMemo } from "react";
import { Container, Button, Grid, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import { Product } from "../types/Product";
import { useProducts } from "../hooks/useProducts";
import { createProduct, updateProduct, deleteProduct } from "../services/ProductService";
import SearchBar from "../components/SearchBar";
import ProductTable from "../components/ProductTable";
import ProductModal from "../components/ProductModal";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const defaultProduct: Product = {
    id: 0,
    reference: "",
    description: "",
    quantity: 0,
    price: 0,
    supplierPrice: 0,
    unite: undefined,
    unitPrice: 0,
    priceAfterDiscount: 0,
    totalPrice: 0,
};

const Page: React.FC = () => {
    const { products, setProducts, isLoading } = useProducts();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentProduct, setCurrentProduct] = useState<Product>(defaultProduct);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // Handle search input changes
    const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }, []);

    // Filter products based on search query
    const filteredProducts = useMemo(() => 
        products.filter(
            (product) => 
                (product.reference ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (product.description ?? "").toLowerCase().includes(searchQuery.toLowerCase())
        ), 
        [products, searchQuery]
    );

    // Handle product deletion
    const handleDeleteProduct = useCallback(async (product: Product) => {
        const result = await Swal.fire({
            title: 'Êtes-vous sûr?',
            text: "Vous ne pourrez pas revenir en arrière!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer!'
        });

        if (result.isConfirmed) {
            try {
                await deleteProduct(product.id);
                setProducts((prevProducts) => prevProducts.filter((p) => p.id !== product.id));
                Swal.fire('Supprimé!', 'Le produit a été supprimé.', 'success');
            } catch (error) {
                console.error("Erreur lors de la suppression du produit:", error);
                Swal.fire('Erreur!', 'Échec de la suppression du produit.', 'error');
            }
        }
    }, [setProducts]);

    // Handle product editing
    const handleEditProduct = useCallback((product: Product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    }, []);

    // Handle saving new or edited product
    const handleSaveProduct = useCallback(async () => {
        try {
            let updatedProduct: Product;
            if (currentProduct.id) {
                updatedProduct = await updateProduct(currentProduct.id, currentProduct);
                setProducts((prevProducts) => 
                    prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
                );
                Swal.fire('Mis à jour!', 'Le produit a été mis à jour.', 'success');
            } else {
                updatedProduct = await createProduct(currentProduct);
                setProducts((prevProducts) => [...prevProducts, updatedProduct]);
                Swal.fire('Ajouté!', 'Le produit a été ajouté.', 'success');
            }
            handleCloseModal();
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du produit:", error);
            Swal.fire('Erreur!', 'Échec de l\'enregistrement du produit.', 'error');
        }
    }, [currentProduct, setProducts]);

    // Handle opening the modal for a new product
    const handleOpenModal = useCallback(() => {
        setCurrentProduct(defaultProduct);
        setIsModalOpen(true);
    }, []);

    // Handle closing the modal
    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    // Handle product input changes
    const handleChangeProduct = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = event.target;
            setCurrentProduct((prevProduct) => ({
                ...prevProduct,
                [name]: value,
            }));
        },
        []
    );

    return (
        <Container maxWidth="lg">
            {isLoading ? (
                <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
                    <CircularProgress />
                </Grid>
            ) : (
                <>
                    <Grid container spacing={2} mb={2}>
                        <Grid item xs={12} md={8}>
                            <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
                        </Grid>
                        <Grid item xs={12} md={4} container justifyContent="flex-end">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleOpenModal}
                                startIcon={<AddCircleIcon />}
                            >
                                Ajouter un produit
                            </Button>
                        </Grid>
                    </Grid>
                    <ProductTable
                        products={filteredProducts}
                        onDeleteProduct={handleDeleteProduct}
                        onEditProduct={handleEditProduct}
                    />
                    <ProductModal
                        isOpen={isModalOpen}
                        product={currentProduct}
                        onClose={handleCloseModal}
                        onChange={handleChangeProduct}
                        onSave={handleSaveProduct}
                    />
                </>
            )}
        </Container>
    );
};

export default Page;
