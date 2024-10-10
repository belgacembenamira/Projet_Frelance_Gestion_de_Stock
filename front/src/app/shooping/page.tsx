"use client"
import React, { useCallback, useReducer, useState, ChangeEvent } from "react";
import { Grid, Container, IconButton, Badge, Typography } from "@mui/material";
import { useRouter } from "next/router";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { useProducts } from "../hooks/useProducts";
import { Product } from "../types/Product";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Define actions for cart reducer
type CartAction =
    | { type: "ADD_TO_CART"; productId: number; quantity: number }
    | { type: "REMOVE_FROM_CART"; productId: number }
    | { type: "SET_QUANTITY"; productId: number; quantity: number };

// Define the cart state interface
interface CartState {
    [productId: number]: number; // Maps productId to quantity
}

// Reducer function to manage cart state
const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case "ADD_TO_CART":
            return {
                ...state,
                [action.productId]: (state[action.productId] || 0) + action.quantity,
            };
        case "REMOVE_FROM_CART":
            const { [action.productId]: _, ...rest } = state;
            return rest;
        case "SET_QUANTITY":
            return {
                ...state,
                [action.productId]: Math.max(action.quantity, 0), // Prevent negative quantities
            };
        default:
            return state;
    }
};

const Page: React.FC = () => {
    const { products } = useProducts();
    const [cart, dispatch] = useReducer(cartReducer, {});
    const [searchQuery, setSearchQuery] = useState<string>("");
    const navigate = "test";

    // Handle adding products to the cart
    const handleAddToCart = useCallback((product: Product, quantity: number) => {
        if (quantity > 0) {
            dispatch({ type: "ADD_TO_CART", productId: product.id, quantity });
        }
    }, []);

    // Handle setting product quantity in the cart
    const handleSetQuantity = useCallback((product: Product, quantity: number) => {
        dispatch({ type: "SET_QUANTITY", productId: product.id, quantity });
    }, []);

    // Handle checkout process
    const handleCheckout = useCallback(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
        // navigate("/achats");
    }, [cart, navigate]);

    // Handle search input changes
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    // Filter products based on the search query
    const filteredProducts = products.filter(
        (product) => product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate total items in the cart
    const getTotalItems = () => Object.values(cart).reduce((total, qty) => total + qty, 0);

    // Handle delivery button click
    const handleDeliveryClick = useCallback(() => {
        // navigate("/achats");
    }, [navigate]);

    return (
        <Container style={{ paddingBottom: "60px" }}>
            <Typography
                variant="h4"
                style={{ color: "#1976d2", marginBottom: "20px", fontWeight: 600 }}
            >
                Boutique
            </Typography>
            <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
            <Grid container spacing={4}>
                {filteredProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <ProductCard
                            product={product}
                            cartQuantity={cart[product.id] || 0}
                            onAddToCart={handleAddToCart}
                            onSetQuantity={handleSetQuantity}
                        />
                    </Grid>
                ))}
            </Grid>
            <IconButton
                color="primary"
                onClick={handleCheckout}
                disabled={getTotalItems() === 0}
                style={{
                    position: "fixed",
                    bottom: "40px",
                    right: "40px",
                    backgroundColor: "#ff5722",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                    zIndex: 1000,
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Badge
                    badgeContent={getTotalItems()}
                    color="error"
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    style={{ transform: "scale(1.2)" }}
                    onClick={handleDeliveryClick}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "#1976d2",
                            borderRadius: "8px",
                            padding: "10px",
                            color: "#ffffff",
                            cursor: "pointer",
                        }}
                    >
                        <Typography
                            variant="body1"
                            style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                marginRight: "16px",
                            }}
                        >
                            Bon de livraison
                        </Typography>
                        <ArrowForwardIcon
                            style={{
                                color: "#ffffff",
                                fontSize: "36px",
                                marginLeft: "15px",
                            }}
                        />
                    </div>
                </Badge>
            </IconButton>
        </Container>
    );
};

export default Page;
