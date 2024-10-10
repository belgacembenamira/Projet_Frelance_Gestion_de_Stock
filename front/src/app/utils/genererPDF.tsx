import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Commande } from "../types/Commande";
import { ProductCommande } from "../types/ProductCommande";

// Utility function to format currency
const formatCurrency = (amount: number) => `${amount} TND`;

type DocumentType = 'invoice' | 'devis' | 'deliveryNote';

export const genererPDF = async (
    commande: Commande,
    type: DocumentType,
    afficherRemisesTableau: boolean, // Contrôle de l'affichage des remises
    afficherPaiementInfo: boolean // Contrôle de l'affichage des informations de paiement
) => {
    const doc = new jsPDF();

    // Load logo (ajouter le code pour charger le logo si nécessaire)

    // Header du document
    doc.setFontSize(16);
    doc.text(type === 'invoice' ? 'Facture' : type === 'devis' ? 'Devis' : 'Bon de livraison', 15, 40);

    // Informations du client
    doc.setFontSize(12);
    const { client } = commande;
    doc.text(`CLIENT: ${client?.name || 'N/A'}`, 15, 55);
    doc.text(`Adresse: ${client?.address || 'N/A'}`, 15, 60);
    doc.text(`Téléphone: ${client?.phone || 'N/A'}`, 15, 65);
    doc.text(`Date: ${new Date(commande.date).toLocaleDateString()}`, 160, 55);
    doc.line(15, 75, 195, 75);

    // En-têtes du tableau des produits
    let headers = ["Référence", "Description", "Quantité", "P.U. TTC"];
    if (afficherRemisesTableau) {
        headers.push("Remise (%)", "P.U. après Remise");
    }
    headers.push("Total TTC");

    // Données du tableau des produits
    const productData = commande.products.map((productCommande: ProductCommande) => {
        const { product, quantity, discount } = productCommande;
        const price = product.price || 0;
        const priceAfterDiscount = discount ? price * (1 - discount / 100) : price;
        const total = quantity * priceAfterDiscount;

        const row = [
            product.reference || 'N/A',
            product.description || 'N/A',
            quantity,
            formatCurrency(price),
        ];

        if (afficherRemisesTableau && discount) {
            row.push(discount.toString());
            row.push(formatCurrency(priceAfterDiscount));
        }

        row.push(formatCurrency(total));
        return row;
    });

    autoTable(doc, {
        startY: 80,
        head: [headers],
        body: productData,
        theme: "striped",
    });

    // Fonction pour calculer les totaux
    const calculateTotals = (products: ProductCommande[]) => {
        const totalWithoutDiscount = products.reduce((acc, productCommande) => {
            const price = productCommande.product.price || 0;
            return acc + (productCommande.quantity * price);
        }, 0);

        const totalDiscount = products.reduce((acc, productCommande) => {
            const price = productCommande.product.price || 0;
            const discount = productCommande.discount || 0;
            return acc + (productCommande.quantity * (price * (discount / 100)));
        }, 0);

        const totalWithDiscount = totalWithoutDiscount - totalDiscount;

        return { totalWithoutDiscount, totalDiscount, totalWithDiscount };
    };

    // Calcul des totaux
    const { totalWithoutDiscount, totalDiscount, totalWithDiscount } = calculateTotals(commande.products);

    // Footer Section (ajout des totaux)
    const finalY = (doc as any).lastAutoTable.finalY;
    const totalFooterHeaders = ["Description", "Montant"];
    const totalFooterData: string[][] = [
        ["Montant total de commande:", formatCurrency(totalWithoutDiscount)],
    ];

    if (afficherRemisesTableau && totalDiscount > 0) {
        totalFooterData.push(["Montant de remise:", formatCurrency(totalDiscount)]);
        totalFooterData.push(["Montant total avec remise:", formatCurrency(totalWithDiscount)]);
    }

    totalFooterData.push(["Net à payer:", formatCurrency(totalWithDiscount)]);

    autoTable(doc, {
        startY: finalY + 10,
        head: [totalFooterHeaders],
        body: totalFooterData,
        theme: "striped",
    });

    // Tableau des informations de paiement si `afficherPaiementInfo` est activé

    // Ajout de la signature et des informations de contact
    const footerY = (doc as any).lastAutoTable.finalY + 20;
    doc.line(15, footerY, 195, footerY);
    doc.text("Signature: ____________________", 15, footerY + 10);

    // Contact information
    const contactY = footerY + 30;
    doc.setFontSize(10);
    const contactInfo = [
        "Contact: MAKRAM CHOUIREF",
        "A côté de café Alquds, devant le marché des dattes,",
        "4214 Jemna-Kébili",
        "+216 29489741",
        "Code TVA: 1679384/F",
    ];

    contactInfo.forEach((line, index) => {
        doc.text(line, 15, contactY + index * 5);
    });

    // Pagination
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} / ${pageCount}`, 195, doc.internal.pageSize.height - 10, { align: "center" });
    }

    // Sauvegarder le PDF
    const fileName = `${type}_${commande.id}.pdf`;
    doc.save(fileName);
};
