import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { CommandeFournisseur } from "../types/CommandeFournisseur";

// Utility function to format currency
const formatCurrency = (amount: number) => `${amount.toFixed(2)} TND`; // Format with two decimal places

export const genererBonDeReception = async (
  commande: CommandeFournisseur,
  supplierInfo: {
    id: number;
    contactPhone: string;
    name: string;
    email: string;
  } // Supplier information
) => {
  const doc = new jsPDF();

  // Header of the receipt
  doc.setFontSize(16);
  doc.text("Bon de Réception", 15, 40);

  // Supplier Information
  doc.setFontSize(12);
  doc.text(`Fournisseur: ${supplierInfo.name || "N/A"}`, 15, 55);
  doc.text(`Téléphone: ${supplierInfo.contactPhone || "N/A"}`, 15, 60);
  doc.text(`Email: ${supplierInfo.email || "N/A"}`, 15, 65);

  doc.line(15, 80, 195, 80); // Line separating the header

  // Headers for the product table
  const headers = [
    "Référence",
    "Description",
    "Quantité",
    "Prix Fournisseur",
    "Total",
  ];

  // Data for the product table
  const productData = Array.isArray(commande.products)
    ? commande.products.map((productCommande) => {
        return [
          productCommande.reference || "N/A",
          productCommande.description || "N/A",
          productCommande.quantity || 0, // Default to 0 if quantity is null
          formatCurrency(productCommande.supplierPrice),
          formatCurrency(
            productCommande.totalPrice ||
              productCommande.supplierPrice * productCommande.quantity
          ),
        ];
      })
    : [];

  // Generate the product table
  autoTable(doc, {
    startY: 85,
    head: [headers],
    body: productData,
    theme: "striped",
  });

  // Calculate total amount
  const totalAmount = commande.products.reduce((total, productCommande) => {
    return (
      total +
      (productCommande.totalPrice ||
        productCommande.supplierPrice * productCommande.quantity)
    );
  }, 0);

  // Add total to the footer
  const finalY = (doc as any).lastAutoTable.finalY; // Ensure to access lastAutoTable safely
  const footerY = finalY + 10;

  doc.line(15, footerY, 195, footerY); // Line above footer
  doc.text(`Total: ${formatCurrency(totalAmount)}`, 15, footerY + 10);
  doc.text("Signature: ____________________", 15, footerY + 20);

  // Save the PDF
  const fileName = `Bon_de_Reception_${supplierInfo.name}_${Date.now()}.pdf`;
  doc.save(fileName);
};
