import PDFDocument from 'pdfkit';

export function generateBillPdf({ tokenNumber, name, date, time, amount }) {
  const doc = new PDFDocument({ size: 'A4' });
  const chunks = [];
  doc.on('data', (d) => chunks.push(d));
  return new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.fontSize(20).text('Appointment Bill', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Token: ${tokenNumber}`);
    doc.text(`Name: ${name}`);
    doc.text(`Date: ${new Date(date).toLocaleDateString()}`);
    doc.text(`Time: ${new Date(time).toLocaleTimeString()}`);
    doc.text(`Amount: ₹${amount}`);
    doc.moveDown();
    doc.text('Thank you for your visit.');
    doc.end();
  });
}
