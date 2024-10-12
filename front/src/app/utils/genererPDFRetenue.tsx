import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Utility function to format currency
const formatCurrency = (amount: number) => `${amount.toFixed(3)} TND`;

interface PayerInfo {
    name: string;
    address: string;
    taxId: string;
    codeTVA: string;
    categoryCode: string;
    secondaryEstablishmentNumber: string;
    contactName: string;
    contactPhone: string;
}

interface BeneficiaryInfo {
    name: string;
    address: string;
    taxId: string;
    codeTva: string;
    categoryCode: string;
    secondaryEstablishmentNumber: string;
    matriculeFiscal	:string;
}

interface InvoiceDetails {
    grossAmount: number;
    invoiceNumber: string;
    date: string;
}

export const genererPDFRetenue = async (
    payerInfo: PayerInfo,
    beneficiaryInfo: BeneficiaryInfo,
    invoiceDetails: InvoiceDetails,
    taxRate: number
) => {
    const doc = new jsPDF();

    // Header Section
    doc.setFontSize(10);
    doc.text("REPUBLIQUE TUNISIENNE", 15, 15);
    doc.text("MINISTERE DU PLAN ET DES FINANCES", 15, 20);
    doc.text("Direction Générale du Contrôle Fiscal", 15, 25);

    // Title
    doc.setFontSize(12);
    doc.text("CERTIFICAT DE RETENUE D'IMPOT SUR LE REVENU OU D'IMPOT SUR LES SOCIETES", 15, 35);

    // Payer Information
    doc.setFontSize(10);
    doc.text("A)PERSONNE OU ORGANISME PAYEUR:", 15, 45);
    doc.text(payerInfo.name, 15, 50);
    doc.text(payerInfo.address, 15, 55);

    // Table for payer identification (A)
    autoTable(doc, {
        startY: 60,
        head: [["Code TVA", "Code Catégorie", "N° Etab Secondaire"]],
        body: [
            [payerInfo.matriculeFiscal, payerInfo.categoryCode, payerInfo.secondaryEstablishmentNumber],
        ],
    });

    // Beneficiary Information
    doc.text("B)BENEFICIAIRE:", 15, 85);
    doc.text(beneficiaryInfo.name, 15, 90);
    doc.text(beneficiaryInfo.address, 15, 95);

    // Table for beneficiary identification (B)
    autoTable(doc, {
        startY: 100,
        head: [["Code TVA", "Code Catégorie", "N° Etab Secondaire"]],
        body: [
            [beneficiaryInfo.codeTva, beneficiaryInfo.categoryCode, beneficiaryInfo.secondaryEstablishmentNumber],
        ],
    });

    // Invoice and Retention Details (C)
    const grossAmount = invoiceDetails.grossAmount;
    const retention = grossAmount * taxRate;
    const netAmount = grossAmount - retention;

    autoTable(doc, {
        startY: 120,
        head: [["Retenue Effectuée sur", "Montant Brut", "Retenue 1%", "Montant à Payer"]],
        body: [["Marché", formatCurrency(grossAmount), formatCurrency(retention), formatCurrency(netAmount)]],
    });

    // Invoice and Date Details
    doc.text(`Date: ${invoiceDetails.date}`, 15, (doc as any).lastAutoTable.finalY + 15);

    // Footer
    doc.text("Je soussigné certifie exact les renseignements figurant sur le présent certificat", 15, doc.lastAutoTable.finalY + 30);
    doc.text("Cachet et Signature du Payeur", 15, (doc as any).lastAutoTable.finalY + 35);

    // Signature Line
    doc.line(15, (doc as any).lastAutoTable.finalY + 45, 195, (doc as any).lastAutoTable.finalY + 45);
    doc.text("Signature: ____________________", 15, (doc as any).lastAutoTable.finalY + 50);

    // Contact Information
    // doc.text(`Contact: ${payerInfo.contactName}`, 15, (doc as any).lastAutoTable.finalY + 60);
    // doc.text(`Tél: ${payerInfo.contactPhone}`, 15, (doc as any).lastAutoTable.finalY + 65);

    // Save the PDF
    const fileName = `Certificat_de_retenue_${Date.now()}_${payerInfo.name}.pdf`;
    doc.save(fileName);
};
