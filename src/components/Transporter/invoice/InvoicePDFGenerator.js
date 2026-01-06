// utils/pdf/InvoicePDFGenerator.js
import jsPDF from "jspdf";
import "jspdf-autotable";
// import logo from "../../assets/logo.png"; 

class InvoicePDFGenerator {
  generateInvoice(invoice) {
    const doc = new jsPDF();
    
    // Company Header
    doc.setFontSize(24);
    doc.setTextColor(41, 128, 185);
    doc.text("FleetSync Pro", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Intelligent Fleet Management", 105, 28, { align: "center" });
    
    // Invoice Header
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("INVOICE", 105, 45, { align: "center" });
    
    doc.setFontSize(10);
    doc.text(`Invoice #: ${invoice.id}`, 20, 55);
    doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 20, 60);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 20, 65);
    
    // Status
    const statusColor = invoice.status === "paid" ? [46, 204, 113] : 
                       invoice.status === "overdue" ? [231, 76, 60] : 
                       [241, 196, 15];
    
    doc.setTextColor(...statusColor);
    doc.text(`Status: ${invoice.status.toUpperCase()}`, 180, 55, { align: "right" });
    
    // Customer Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text("BILL TO:", 20, 80);
    doc.setFontSize(10);
    doc.text(invoice.customer, 20, 87);
    
    // Invoice Details Table
    const tableData = [
      ['Description', 'Vehicle', 'Driver', 'Route', 'Amount'],
      [
        `Trip ${invoice.trip}`,
        invoice.vehicle,
        invoice.driver,
        invoice.route,
        invoice.amount
      ]
    ];
    
    doc.autoTable({
      startY: 100,
      head: [tableData[0]],
      body: [tableData[1]],
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40 },
        4: { cellWidth: 30 }
      }
    });
    
    // Summary
    const finalY = doc.autoTable.previous.finalY + 20;
    
    doc.setFontSize(12);
    doc.text("Payment Summary:", 20, finalY);
    
    doc.setFontSize(10);
    doc.text("Subtotal:", 150, finalY);
    doc.text(invoice.amount, 180, finalY, { align: "right" });
    
    doc.text("Tax (18%):", 150, finalY + 7);
    const tax = (parseFloat(invoice.amount.replace('$', '')) * 0.18).toFixed(2);
    doc.text(`$${tax}`, 180, finalY + 7, { align: "right" });
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text("Total:", 150, finalY + 17);
    const total = (parseFloat(invoice.amount.replace('$', '')) + parseFloat(tax)).toFixed(2);
    doc.text(`$${total}`, 180, finalY + 17, { align: "right" });
    
    // Payment Method
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(`Payment Method: ${invoice.paymentMethod}`, 20, finalY + 40);
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for your business!", 105, pageHeight - 30, { align: "center" });
    doc.text("Questions? Contact us at: support@fleetsyncpro.com", 105, pageHeight - 25, { align: "center" });
    doc.text(`Invoice generated on: ${new Date().toLocaleDateString()}`, 105, pageHeight - 20, { align: "center" });
    
    // Save PDF
    doc.save(`invoice-${invoice.id}.pdf`);
  }

  generateBulkInvoices(invoices) {
    invoices.forEach((invoice, index) => {
      if (index > 0) {
        // Add new page for each invoice
        this.doc.addPage();
      }
      this.generateInvoice(invoice);
    });
  }
}

export default InvoicePDFGenerator;