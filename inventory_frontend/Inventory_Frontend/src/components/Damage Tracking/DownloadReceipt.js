"use client";
import { jsPDF } from "jspdf";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

export default function DownloadReceipt({ row }) {
  const handleDownloadPDF = () => {
    if (!row) {
      alert("No data available for this row!");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Damage Receipt", 14, 20);

    doc.setFontSize(12);
    let y = 30;

    Object.entries(row)
      .filter(([key]) => key !== "action") // skip action button field
      .forEach(([key, value]) => {
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
        doc.text(`${formattedKey}: ${value ?? "-"}`, 14, y);
        y += 10;
      });

    doc.setFontSize(10);
    doc.text(
      "Generated on: " + new Date().toLocaleDateString(),
      14,
      y + 10
    );

    doc.save(`${row.entryid ?? "Receipt"}_Damage_Receipt.pdf`);
  };

  return (
    <Button className="Btn" size="small" onClick={handleDownloadPDF}>
      <DownloadIcon fontSize="small" />
    </Button>
  );
}




/*"use client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

export default function DownloadReceipt({ row }) {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Damage Receipt", 14, 20);

    
    const tableColumn = ["Field", "Value"];
    const tableRows = Object.entries(row)
      .filter(([key]) => key !== "action") 
      .map(([key, value]) => [key.charAt(0).toUpperCase() + key.slice(1), value]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 10 },
    });

    doc.setFontSize(10);
    doc.text(
      "Generated on: " + new Date().toLocaleDateString(),
      14,
      doc.internal.pageSize.height - 10
    );

    doc.save(`${row.entryid}_Damage_Receipt.pdf`);
  };

  return (
    <Button className="Btn" size="small" onClick={handleDownloadPDF}>
      <DownloadIcon fontSize="small" /> 
    </Button>
  );
}*/