import React, { useEffect, useReducer } from 'react';
import {
    Container,
    Typography,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    TextField,
    Button,
    IconButton,
    Alert,
} from '@mui/material';
import { Remove, Add, Delete } from '@mui/icons-material';
import { CommandeFournisseur } from './CommandeFournisseur';
import { Supplier } from './Supplier';
import { Product as BaseProduct } from './Product';
import { getAllSuppliers } from '../services/supplierApi';
import { createProduct } from '../services/ProductService';
import { useCreateCommandeFournisseur } from '../hooks/useCommandeFournisseur';
import Swal from 'sweetalert2';
import { genererPDF } from '../utils/genererPDF';
import { genererBonDeReception } from '../utils/genererBonDeReception';
import { genererPDFRetenue } from '../utils/genererPDFRetenue';
import { NumericFormat } from 'react-number-format';


// Helper function to generate unique ID
const generateUniqueId = () => {
    return 'PROD-' + Math.random().toString(36).substr(2, 9);
};

// Initial state for reducer
const initialState = {
    selectedProducts: [],
    suppliers: [],
};

// Reducer function to handle state
const reducer = (state: { selectedProducts: any[]; }, action: { type: any; payload: any; productId?: any; suppliers?: any; }) => {
    switch (action.type) {
        case 'ADD_PRODUCT':
            return {
                ...state,
                selectedProducts: [...state.selectedProducts, action.payload],
            };
        case 'REMOVE_PRODUCT':
            return {
                ...state,
                selectedProducts: state.selectedProducts.filter((product: { productId: any; }) => product.productId !== action.productId),
            };
        case 'INCREMENT_QUANTITY':
            return {
                ...state,
                selectedProducts: state.selectedProducts.map((product: { productId: any; quantity: number; }) =>
                    product.productId === action.productId
                        ? { ...product, quantity: product.quantity + 1 }
                        : product
                ),
            };
        case 'DECREMENT_QUANTITY':
            return {
                ...state,
                selectedProducts: state.selectedProducts.map((product: { productId: any; quantity: number; }) =>
                    product.productId === action.productId && product.quantity > 1
                        ? { ...product, quantity: product.quantity - 1 }
                        : product
                ),
            };
        case 'SET_SUPPLIERS':
            return {
                ...state,
                suppliers: action.suppliers,
            };
        default:
            return state;
    }
};

const CreateCommandeFournisseur = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [supplierId, setSupplierId] = React.useState<Supplier | null>(null);
    const [manualProduct, setManualProduct] = React.useState({
        description: '',
        price: 0,
        reference: '',
        supplierPrice: 0,
        unite: '',
        quantity: 1,
    });

    useEffect(() => {
        const fetchSuppliers = async () => {
            const suppliers = await getAllSuppliers();
            dispatch({ type: 'SET_SUPPLIERS', suppliers });
        };

        fetchSuppliers();
    }, []);

    const createCommandeFournisseurMutation = useCreateCommandeFournisseur();

    const handleManualAddProduct = () => {
        if (!manualProduct.description || manualProduct.quantity < 1) {
            Swal.fire("Erreur", "Veuillez remplir tous les champs nécessaires.", "error");
            return; // Basic validation
        }

        const newProduct = {
            productId: generateUniqueId(),
            ...manualProduct,
            totalPrice: manualProduct.supplierPrice * manualProduct.quantity,
        };
        dispatch({ type: 'ADD_PRODUCT', payload: newProduct });

        // Reset manual product input fields
        setManualProduct({
            description: '',
            price: 0,
            reference: '',
            supplierPrice: 0,
            unite: '',
            quantity: 1,
        });
    };

    const createNewCommande = () => {
        const totalHT = calculateTotalHT(state.selectedProducts);
        const totalTTC = totalHT; // Assuming no additional taxes or discounts for simplicity

        console.log("Creating new commande with selected products:", state.selectedProducts);

        return {
            id: generateUniqueNumberId(), // Add the missing id property
            supplier: supplierId,
            date: new Date(),
            amountBeforeDiscount: totalHT,
            amountAfterDiscount: totalTTC,
            amountPaid: 0,
            amountRemaining: totalTTC,
            totalAmount: totalTTC,
            products: state.selectedProducts.map((product) => ({
                productId: product.productId,
                description: product.description || "N/A",
                reference: product.reference || "N/A",
                supplierPrice: product.supplierPrice,
                price: product.price,
                quantity: product.quantity,
                totalPrice: product.supplierPrice * product.quantity,
            })),
            updatedAt: new Date(),
            commandeId: generateCommandeId(),
        };
    };

    const handleSubmit = async () => {
        try {
            // Step 1: Create a new commande object
            const newCommande = createNewCommande();
            console.log("New Commande Created:", newCommande);

            // Check if there are products to add to stock
            if (state.selectedProducts.length > 0) {
                // Step 2: Add products to the stock
                await Promise.all(
                    state.selectedProducts.map(async (product) => {
                        try {
                            await createProduct({
                                description: product.description,
                                reference: product.reference,
                                supplierPrice: product.supplierPrice,
                                quantity: product.quantity,
                                price: product.price,
                                id: +product.productId, // Convert to number
                            });


                        } catch (error) {
                            console.error(`Failed to create product ${product.productId}:`, error);
                            Swal.fire("Avertissement", `Le produit ${product.description} n'a pas pu être créé.`, "warning");
                        }
                    })
                );

                // Step 3: Create the commande fournisseur
                // await createCommandeFournisseur(newCommande); // Ensure this function is defined to handle the creation.

                // Success message for the commande creation
                Swal.fire("Succès", "La commande a été créée avec succès.", "success");
            } else {
                Swal.fire("Erreur", "Aucun produit sélectionné pour la commande.", "error");
            }
        } catch (error) {
            Swal.fire("Erreur", "Une erreur s'est produite lors du traitement de la commande.", "error");
            console.error("Failed to submit the commande:", error);
        }
    };



    const handleAppeler = () => {
        if (supplierId) {
            if (!supplierId.id || !supplierId.contactPhone) {
                Swal.fire("Erreur", "Informations du fournisseur manquantes ou incorrectes.", "error");
                return;
            }

            const supplierInfo = {
                id: supplierId.id,
                contactPhone: supplierId.contactPhone,
                name: supplierId.name,
                email: supplierId.email,
            };
            const newCommande = createNewCommande();
            console.log("Commande for PDF Generation:", newCommande);
            genererBonDeReception(newCommande, supplierInfo);
            Swal.fire("PDF généré", "Le PDF a été généré avec succès !", "success");
        } else {
            Swal.fire("Erreur", "Veuillez sélectionner un fournisseur.", "error");
        }
    };
    const handleGeneratePDFRetune = async () => {
        if (supplierId) {
            try {
                await genererPDFRetenue(
                    {
                        name: supplierId.name,
                        address: supplierId.rue ?? '',
                        taxId: supplierId.taxId ?? '10', // Provide a default or actual taxId
                        contactName: supplierId.name,
                        contactPhone: supplierId.contactPhone ?? '93287025', // Provide a default or actual contactPhone
                        codeTVA: supplierId.codeTVA ?? '', // Provide a default or actual codeTVA
                        categoryCode: supplierId.categoryCode ?? '', // Provide a default or actual categoryCode
                        secondaryEstablishmentNumber: supplierId.secondaryEstablishmentNumber ?? '', // Provide a default or actual secondaryEstablishmentNumber
                        matriculeFiscal: supplierId.matriculeFiscal ?? '', // Provide a default or actual matriculeFiscal
                    },
                    {
                        name: "makrem chourief",
                        address: "jemna kebili",
                        taxId: "1679384/F", // Provide a default or actual taxId
                        codeTva: "1679384/F", // Provide a default or actual codeTVA
                        categoryCode: "", // Provide a default or actual categoryCode
                        secondaryEstablishmentNumber: "" // Provide a default or actual secondaryEstablishmentNumber
                    },
                    {
                        grossAmount: calculateTotalHT(state.selectedProducts),
                        invoiceNumber: "VotreNuméroDeFacture", // Fill in with your invoice number
                        date: new Date().toLocaleDateString(), // Date format
                    },
                    taxRate // Pass the tax rate here
                );
                Swal.fire("Succès", "PDF de retenue généré avec succès.", "success");
            } catch (error) {
                Swal.fire("Erreur", "Une erreur s'est produite lors de la génération du PDF.", "error");
                console.error("Error generating PDF:", error);
            }
        } else {
            Swal.fire("Erreur", "Veuillez sélectionner un fournisseur.", "error");
        }
    };

    const [taxRate, setTaxRate] = React.useState<number>(0.01);

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                Créer une Bon de réception
            </Typography>
            <Divider />

            {/* Supplier Selection */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="supplier-label">Fournisseur</InputLabel>
                <Select
                    labelId="supplier-label"
                    value={supplierId ? supplierId.id : ''}
                    onChange={(e) => {
                        const selectedSupplier = state.suppliers.find((supplier: { id: number; }) => supplier.id === Number(e.target.value));
                        setSupplierId(selectedSupplier || null);
                    }}
                >
                    {state.suppliers.map((supplier: Supplier) => (
                        <MenuItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Grid container spacing={2}>
                {/* Selected Products Table */}
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Produits sélectionnés
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Référence</TableCell>
                                    <TableCell>Prix Fournisseur (TND)</TableCell>
                                    <TableCell>Quantité</TableCell>
                                    <TableCell>Prix de vente</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state.selectedProducts.map((product: { productId: React.Key | null | undefined; description: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; reference: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; supplierPrice: number; quantity: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; price: number; }) => (
                                    <TableRow key={product.productId}>
                                        <TableCell>{product.description}</TableCell>
                                        <TableCell>{product.reference}</TableCell>
                                        <TableCell>{product.supplierPrice.toFixed(2)} TND</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => dispatch({ type: 'DECREMENT_QUANTITY', productId: product.productId })}>
                                                <Remove />
                                            </IconButton>
                                            <Typography component="span" variant="body1" style={{ margin: '0 8px' }}>
                                                {product.quantity}
                                            </Typography>
                                            <IconButton onClick={() => dispatch({ type: 'INCREMENT_QUANTITY', productId: product.productId })}>
                                                <Add />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <Typography component="span" variant="body1">
                                                {product.price.toFixed(2)} TND
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => dispatch({ type: 'REMOVE_PRODUCT', productId: product.productId })}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* Manual Product Addition */}
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Ajouter un produit manuellement
                    </Typography>

                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        value={manualProduct.description}
                        onChange={(e) => setManualProduct({ ...manualProduct, description: e.target.value })}
                    />

                    <TextField
                        label="Référence"
                        variant="outlined"
                        fullWidth
                        value={manualProduct.reference}
                        onChange={(e) => setManualProduct({ ...manualProduct, reference: e.target.value })}
                    />

                    <TextField
                        label="Prix Fournisseur (TND)"
                        variant="outlined"
                        fullWidth
                        value={manualProduct.supplierPrice}
                        onChange={(e) => setManualProduct({
                            ...manualProduct,
                            supplierPrice: e.target.value ? parseFloat(e.target.value) : ''
                        })}
                    />

                    <TextField
                        label="Prix de Vente (TND)"
                        variant="outlined"
                        fullWidth
                        value={manualProduct.price.toString().replace('.', ',')} // Afficher avec une virgule
                        onChange={(e) => setManualProduct({
                            ...manualProduct,
                            price: parseFloat(e.target.value.replace(',', '.'))
                        })}
                    />

                    <TextField
                        label="Taux de Retenue (%)"
                        variant="outlined"
                        fullWidth
                        value={(taxRate * 100).toString().replace('.', ',')} // Afficher avec une virgule
                        onChange={(e) => {
                            const value = e.target.value.replace(',', '.');
                            const parsedValue = parseFloat(value) / 100;
                            if (!isNaN(parsedValue)) {
                                setTaxRate(parsedValue);
                            }
                        }}
                    />

                    <TextField
                        label="Unité"
                        variant="outlined"
                        fullWidth
                        value={manualProduct.unite}
                        onChange={(e) => setManualProduct({ ...manualProduct, unite: e.target.value })}
                    />

                    <TextField
                        label="Quantité"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={manualProduct.quantity}
                        onChange={(e) => setManualProduct({
                            ...manualProduct,
                            quantity: e.target.value ? parseInt(e.target.value, 10) : ''
                        })}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleManualAddProduct}
                        style={{ width: '200px', margin: '0 10px' }}
                    >
                        Ajouter Produit
                    </Button>
                </Grid>


                {/* Submission and Action Buttons */}
                <Grid item container spacing={2} xs={12} justifyContent="center" style={{ marginTop: '20px' }}>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSubmit}
                            style={{ width: '150px' }}
                        >
                            Enregistrer une bon de reception
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="info"
                            onClick={handleAppeler}
                            style={{ width: '150px' }}
                        >
                            Générer PDF  bon de reception
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleGeneratePDFRetune}
                            style={{ width: '150px' }}
                        >
                            Générer PDF Retenue
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CreateCommandeFournisseur;

// Helper functions
const generateUniqueNumberId = () => {
    return Math.floor(Math.random() * 1000000); // Generate a simple unique numeric ID
};

const calculateTotalHT = (products: { supplierPrice: number; quantity: number }[]) => {
    return products.reduce((total, product) => total + product.supplierPrice * product.quantity, 0);
};

const generateCommandeId = () => {
    return 'CMD-' + new Date().getTime(); // Basic commande ID generation
};
