import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Utility function to format currency
const formatCurrency = (amount: number) => `${amount} TND`;

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
    matriculeFiscal: string;
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

    // --- HEADER SECTION ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("REPUBLIQUE TUNISIENNE", 105, 15, { align: "center" });
    doc.text("MINISTERE DU PLAN ET DES FINANCES", 105, 20, { align: "center" });
    doc.text("Direction Générale du Contrôle Fiscal", 105, 25, { align: "center" });

    // --- TITLE SECTION ---
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(
        "CERTIFICAT DE RETENUE D'IMPÔT SUR LE REVENU OU D'IMPÔT SUR LES SOCIÉTÉS",
        105,
        35,
        { align: "center" }
    );

    // --- PAYER INFORMATION ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("A) PERSONNE OU ORGANISME PAYEUR", 15, 45);
    doc.line(15, 46, 195, 46); // Ligne séparatrice

    doc.setFont("helvetica", "normal");
    // Afficher les informations du bénéficiaire en gras

    // Nom, prénoms ou raison sociale
    doc.setFont("helvetica", "bold"); // Définit la police en gras
    doc.text(`Nom, prénoms ou raison sociale :`, 20, 55);
    doc.setFont("helvetica", "normal"); // Revenir à la police normale
    doc.text(beneficiaryInfo.name, 80, 55);

    // Adresse
    doc.setFont("helvetica", "bold"); // Définit la police en gras
    doc.text(`Adresse :`, 20, 60);
    doc.setFont("helvetica", "normal"); // Revenir à la police normale
    doc.text("000,RTE DOUZ,JEMNA", 80, 60);


    // --- Payer Fiscal Information ---
    doc.setFont("helvetica", "bold");
    doc.text("Matricule Fiscale :", 20, 70);
    doc.setFont("helvetica", "normal");
    doc.text("1679384FCN000", 80, 70);

    doc.setFont("helvetica", "bold");
    // doc.text("Code TVA :", 20, 75);
    // doc.setFont("helvetica", "normal");
    // doc.text("C", 80, 75);

    // doc.setFont("helvetica", "bold");
    // doc.text("Code Catégorie :", 20, 80);
    // doc.setFont("helvetica", "normal");
    // doc.text("", 80, 80);

    // doc.setFont("helvetica", "bold");
    // doc.text("N° Etab Secondaire :", 20, 85);
    // doc.setFont("helvetica", "normal");
    // doc.text("000", 80, 85);

    // --- BENEFICIARY INFORMATION ---
    doc.setFont("helvetica", "bold");
    doc.text("B) BÉNÉFICIAIRE", 15, 95);
    doc.line(15, 96, 195, 96); // Ligne séparatrice

    doc.setFont("helvetica", "normal");
    // Payer Information with Bold Text
    doc.setFont("helvetica", "bold"); // Set font to bold

    doc.text(`Dénomination de la personne ou de l'organisme payeur : ${payerInfo.name}`, 20, 105);
    doc.text(`Adresse : ${payerInfo.address}`, 20, 110);
    doc.text(`Matricule Fiscale : 1341721 G/A/M/000`, 20, 115);

    // Optionally, set font back to normal for subsequent text
    doc.setFont("helvetica", "normal");


    // --- INVOICE AND RETENTION DETAILS (C) ---
    const grossAmount = invoiceDetails.grossAmount;
    const retention = (grossAmount * taxRate).toFixed(1); // Fixer 3 chiffres après la virgule
    const netAmount = (grossAmount - retention).toFixed(1); // Fixer 3 chiffres après la virgule


    doc.setFont("helvetica", "bold");
    // doc.text("C) DÉTAILS DE LA FACTURE ET RETENUE", 15, 125);
    doc.line(15, 126, 195, 126); // Ligne séparatrice

    autoTable(doc, {
        startY: 130,
        head: [
            [
                "Description",
                "Montant Brut (TND)",
                "Retenue (1%) (TND)",
                "Montant Net (TND)",
            ],
        ],
        body: [
            [
                "Marché (1%)",
                formatCurrency(grossAmount),
                formatCurrency(retention),
                formatCurrency(netAmount),
            ],
        ],
        theme: "grid", // Pour un style de tableau clair
    });

    // --- DATE & FOOTER ---
    const lastY = (doc as any).lastAutoTable.finalY + 15;

    doc.setFont("helvetica", "normal");
    // doc.text(`Date : 20/11/2024`, 15, lastY);

    doc.text(
        "Je soussigné, certifie que les informations données ci-dessus sont exactes  ,le 28/11/2024 ",
        15,
        lastY + 10
    );

    // --- SIGNATURE LINE ---
    doc.line(15, lastY + 15, 195, lastY + 15); // Ligne pour les signatures
    doc.setFont("helvetica", "bold");
    doc.text("Cachet & Signature PAYER", 15, lastY + 25);
    doc.text("Cachet & Signature BÉNÉFICIAIRE", 150, lastY + 25);

    // --- SAVE PDF ---
    const fileName = `Certificat_de_retenue_${Date.now()}_${payerInfo.name}.pdf`;
    doc.save(fileName);
};

