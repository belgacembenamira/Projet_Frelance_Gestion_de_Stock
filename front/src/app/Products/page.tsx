import React, { ChangeEvent, useState, useCallback, useMemo } from "react";
import { Container, Button, Grid } from "@mui/material";
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

const page: React.FC = () => {
  const { products, setProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentProduct, setCurrentProduct] = useState<Product>(defaultProduct);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    []
  );

  // Memoize the filtered products to avoid unnecessary recalculations
  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [products, searchQuery]
  );

  const handleDeleteProduct = useCallback(
    async (product: Product) => {
      const confirmDeletion = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      });

      if (confirmDeletion.isConfirmed) {
        try {
          await deleteProduct(product.id);
          setProducts((prevProducts) => prevProducts.filter((p) => p.id !== product.id));
          Swal.fire('Deleted!', 'The product has been successfully deleted.', 'success');
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire('Error!', 'Failed to delete the product.', 'error');
        }
      }
    },
    [setProducts]
  );

  const handleEditProduct = useCallback((product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleSaveProduct = useCallback(async () => {
    try {
      let updatedProduct: Product;
      if (currentProduct.id) {
        updatedProduct = await updateProduct(currentProduct.id, currentProduct);
        setProducts((prevProducts) =>
          prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
        Swal.fire('Updated!', 'The product has been successfully updated.', 'success');
      } else {
        updatedProduct = await createProduct(currentProduct);
        setProducts((prevProducts) => [...prevProducts, updatedProduct]);
        Swal.fire('Created!', 'The new product has been successfully created.', 'success');
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving product:", error);
      Swal.fire('Error!', 'Failed to save the product.', 'error');
    }
  }, [currentProduct, setProducts]);

  const handleOpenModal = useCallback(() => {
    setCurrentProduct(defaultProduct);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

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
    </Container>
  );
};

export default page;
