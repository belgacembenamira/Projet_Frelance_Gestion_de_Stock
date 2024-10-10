"use client"
import React, { ChangeEvent, useState, useCallback, useMemo } from "react";
import { Container, Button, Grid, CircularProgress, Typography } from "@mui/material";
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
    const { products, setProducts } = useProducts(); // Added loading state
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentProduct, setCurrentProduct] = useState<Product>(defaultProduct);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // Handle search input changes with debouncing
    const handleSearchChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(event.target.value);
        },
        []
    );

    // Filter products based on search query
    const filteredProducts = useMemo(
        () =>
            products.filter(
                (product) =>
                    (product.reference ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (product.description ?? "").toLowerCase().includes(searchQuery.toLowerCase())
            ),
        [products, searchQuery]
    );

    // Handle product deletion
    const handleDeleteProduct = useCallback(
        async (product: Product) => {
            try {
                await deleteProduct(product.id);
                setProducts((prevProducts) => prevProducts.filter((p) => p.id !== product.id));
                Swal.fire({
                    icon: "success",
                    title: "Product Deleted",
                    text: "The product has been successfully deleted.",
                });
            } catch (error) {
                console.error("Error deleting product:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to delete the product.",
                });
            }
        },
        [setProducts]
    );

    // Handle product editing
    const handleEditProduct = useCallback((product: Product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    }, []);

    // Handle saving new or edited product
    const handleSaveProduct = useCallback(async () => {
        try {
            if (currentProduct.id) {
                const updatedProduct = await updateProduct(currentProduct.id, currentProduct);
                setProducts((prevProducts) =>
                    prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
                );
                Swal.fire({
                    icon: "success",
                    title: "Product Updated",
                    text: "The product has been successfully updated.",
                });
            } else {
                const newProduct = await createProduct(currentProduct);
                setProducts((prevProducts) => [...prevProducts, newProduct]);
                Swal.fire({
                    icon: "success",
                    title: "Product Created",
                    text: "The new product has been successfully created.",
                });
            }
            handleCloseModal();
        } catch (error) {
            console.error("Error saving product:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save the product.",
            });
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
        <Container>
            <Grid container spacing={2} mb={2}>
                <Grid item xs={12} md={8}>
                    <SearchBar
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                    />
                </Grid>
                <Grid item xs={12} md={4} container justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenModal}
                        startIcon={<AddCircleIcon />}
                    >
                        Add Product
                    </Button>
                </Grid>
            </Grid>

            <CircularProgress />

            <>
                {filteredProducts.length > 0 ? (
                    <ProductTable
                        products={filteredProducts}
                        onDeleteProduct={handleDeleteProduct}
                        onEditProduct={handleEditProduct}
                    />
                ) : (
                    <Typography variant="h6" align="center">
                        No products found.
                    </Typography>
                )}
            </>


            <ProductModal
                isOpen={isModalOpen}
                product={currentProduct}
                onClose={handleCloseModal}
                onChange={handleChangeProduct}
                onSave={handleSaveProduct}
            />
        </Container>
    );
};

export default Page;
