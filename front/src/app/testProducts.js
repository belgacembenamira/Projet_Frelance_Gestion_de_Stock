const axios = require("axios");

const BASE_URL = "http://localhost:5000/products";

const createProduct = async (index) => {
  const product = {
    reference: `P-00${index}`,
    description: `Product description for item ${index}`,
    quantity: Math.floor(Math.random() * 100), // Random quantity between 0 and 99
    price: (Math.random() * 100).toFixed(2), // Random price between 0 and 100
    supplierPrice: (Math.random() * 100).toFixed(2), // Random supplier price
  };

  try {
    const response = await axios.post(BASE_URL, product);
    console.log(`Created Product ${index}:`, response.data);
  } catch (error) {
    console.error(`Error creating product ${index}:`, error.response.data);
  }
};

const testProducts = async () => {
  for (let i = 1; i <= 150; i++) {
    await createProduct(i);
  }

  // Additional testing: Get All Products
  try {
    const response = await axios.get(BASE_URL);
    console.log("All Products:", response.data);
  } catch (error) {
    console.error("Error fetching all products:", error.response.data);
  }
};

testProducts();
