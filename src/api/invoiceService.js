// services/invoiceService.js
class InvoiceService {
  // Mock data - replace with actual API calls
  async getInvoices() {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "INV-2024-001",
            customer: "ABC Logistics Ltd.",
            vehicle: "MH-12-AB-1234",
            trip: "TRP-7890",
            amount: "$2,850.00",
            date: "2024-03-15",
            dueDate: "2024-04-15",
            status: "paid",
            driver: "Rajesh Kumar",
            route: "Mumbai → Delhi",
            paymentMethod: "Bank Transfer",
            email: "billing@abclogistics.com",
          },
          // ... more invoices
        ]);
      }, 500);
    });
  }

  async getInvoiceById(id) {
    // Get single invoice
    const invoices = await this.getInvoices();
    return invoices.find((inv) => inv.id === id);
  }

  async createInvoice(invoiceData) {
    // Create new invoice
    return new Promise((resolve) => {
      setTimeout(() => {
        const newInvoice = {
          id: `INV-${Date.now()}`,
          ...invoiceData,
          status: "draft",
        };
        resolve(newInvoice);
      }, 500);
    });
  }

  async updateInvoice(id, updates) {
    // Update invoice
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, id, ...updates });
      }, 500);
    });
  }

  async deleteInvoice(id) {
    // Delete invoice
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, id });
      }, 500);
    });
  }

  async markAsPaid(id) {
    return this.updateInvoice(id, { status: "paid" });
  }
}

export default new InvoiceService();
