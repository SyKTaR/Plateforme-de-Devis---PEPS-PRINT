import jsPDF from 'jspdf';
import { Quote, DatabaseData } from '../App';

// Extend jsPDF type for autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function generateQuotePDF(quote: Quote, data: DatabaseData) {
  try {
    // Validate input
    if (!quote || !quote.configuration) {
      throw new Error('Invalid quote data');
    }
    
    const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text("PEP'S PRINT", 20, 20);
  
  doc.setFontSize(10);
  doc.text('Devis', 20, 30);
  
  // Quote info
  doc.setFontSize(12);
  doc.text(`N° ${quote.id}`, 150, 20);
  doc.setFontSize(10);
  doc.text(`Date: ${new Date(quote.date).toLocaleDateString('fr-FR')}`, 150, 26);
  doc.text(`Statut: ${quote.status}`, 150, 32);
  
  // Client info
  doc.setFontSize(12);
  doc.text('Client:', 20, 45);
  doc.setFontSize(10);
  doc.text(quote.client, 20, 51);
  
  // Product details
  let yPos = 65;
  doc.setFontSize(12);
  doc.text('Détails du produit', 20, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  const config = quote.configuration;
  
  const productName = config.productType === 'Autre' ? config.customProduct : config.productType;
  const formatName = config.format === 'Personnalisé' ? config.customFormat : config.format;
  
  if (productName) {
    doc.text(`Produit: ${productName}`, 20, yPos);
    yPos += 6;
  }
  if (formatName) {
    doc.text(`Format: ${formatName}`, 20, yPos);
    yPos += 6;
  }
  
  if (config.paper) {
    const paper = data.papers.find(p => p.id === config.paper);
    if (paper) {
      doc.text(`Papier: ${paper.name} - ${paper.grammage}g`, 20, yPos);
      yPos += 6;
    }
  }
  
  if (config.printType) {
    doc.text(`Impression: ${config.printType}`, 20, yPos);
    yPos += 6;
  }
  if (quote.quantity) {
    doc.text(`Quantité: ${quote.quantity}`, 20, yPos);
    yPos += 6;
  }
  
  if (config.finishes && config.finishes.length > 0) {
    const finishNames = config.finishes
      .map(fId => data.finishes.find(f => f.id === fId)?.name)
      .filter(Boolean)
      .join(', ');
    doc.text(`Finitions: ${finishNames}`, 20, yPos);
    yPos += 6;
  }
  
  if (config.express) {
    doc.setTextColor(255, 100, 0);
    doc.text('Livraison EXPRESS (+20%)', 20, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 6;
  }
  
  // Pricing table
  yPos += 10;
  
  const priceTTC = quote.priceHT * 1.2;
  const tva = priceTTC - quote.priceHT;
  
  // Draw pricing table manually
  doc.setFillColor(30, 30, 30);
  doc.rect(20, yPos, 170, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('Description', 25, yPos + 7);
  doc.text('Montant', 150, yPos + 7);
  
  doc.setTextColor(0, 0, 0);
  yPos += 10;
  
  // Pricing rows
  const rows = [
    ['Prix HT', `${quote.priceHT.toFixed(2)} €`],
    ['TVA (20%)', `${tva.toFixed(2)} €`],
    ['Prix TTC', `${priceTTC.toFixed(2)} €`],
  ];
  
  rows.forEach((row, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(20, yPos, 170, 8, 'F');
    }
    doc.text(row[0], 25, yPos + 6);
    doc.text(row[1], 150, yPos + 6);
    yPos += 8;
  });
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("PEP'S PRINT - Imprimerie professionnelle", 105, pageHeight - 15, { align: 'center' });
  doc.text('Ce devis est valable 30 jours', 105, pageHeight - 10, { align: 'center' });
  
  // Save
  const sanitizedClient = quote.client.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Devis_${quote.id}_${sanitizedClient}.pdf`;
  doc.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
