import { useRef } from "react";
import { Card } from "@/component/ui/card";
import { Button } from "@/component/ui/button";
import { Badge } from "@/component/ui/badge";

import { Printer, Download, ShieldCheck, AlertTriangle } from "lucide-react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const monthNames = [
  "",
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function ReportCard({ result }) {

  const reportRef = useRef(null);

  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {

    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, { scale: 2 });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p","mm","a4");

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData,"PNG",0,10,width,height);

    pdf.save(`${result.medicineName}_prediction_report.pdf`);
  };

  const isSafe = result.riskLevel === "SAFE";

  return (

    <Card className="p-6 shadow-lg border-0 bg-card">

      <div ref={reportRef} className="space-y-6">

        {/* Header */}
        <div className="text-center gradient-header rounded-xl p-5">

          <h2 className="text-xl font-bold text-primary-foreground">
            📋 Medicine Stock Prediction Report
          </h2>

          <p className="text-sm text-primary-foreground/70 mt-1">
            Generated on {new Date().toLocaleDateString("en-IN")}
          </p>

        </div>

        {/* Details */}
        <div className="grid gap-4">

          <InfoRow label="Medicine Name" value={result.medicineName} />

          <InfoRow
            label="Month & Year"
            value={`${monthNames[result.month]} ${result.year}`}
          />

          <InfoRow
            label="Stock Available"
            value={result.stock.toLocaleString("en-IN")}
          />

          <InfoRow
            label="Predicted Sales"
            value={result.predictedSales.toLocaleString("en-IN")}
            highlight
          />

          <InfoRow
            label="Remaining Stock"
            value={result.remainingStock.toLocaleString("en-IN")}
          />

          <InfoRow
            label="Expiry Days Remaining"
            value={`${result.expiryDays} days`}
          />

          {/* Risk Level */}
          <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-secondary">

            <span className="text-sm font-medium text-muted-foreground">
              Risk Level
            </span>

            <Badge
              className={
                isSafe
                  ? "bg-safe text-safe-foreground hover:bg-safe/90"
                  : "bg-risk text-risk-foreground hover:bg-risk/90"
              }
            >
              {isSafe ? (
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
              )}

              {result.riskLevel}

            </Badge>

          </div>

          {/* Loss Estimate */}
          <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-secondary">

            <span className="text-sm font-medium text-muted-foreground">
              Loss Estimate
            </span>

            <span
              className={`text-lg font-bold text-mono ${
                result.lossEstimate > 0 ? "text-danger" : "text-safe"
              }`}
            >
              ₹{result.lossEstimate.toLocaleString("en-IN")}
            </span>

          </div>

        </div>

      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">

        <Button
          variant="outline"
          className="flex-1"
          onClick={handlePrint}
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Report
        </Button>

        <Button
          className="flex-1 gradient-primary text-primary-foreground"
          onClick={handleDownloadPDF}
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>

      </div>

    </Card>
  );
}


function InfoRow({ label, value, highlight }) {

  return (

    <div className="flex justify-between items-center py-2 px-4 rounded-lg bg-secondary/50">

      <span className="text-sm font-medium text-muted-foreground">
        {label}
      </span>

      <span
        className={`font-semibold text-card-foreground ${
          highlight ? "text-accent text-mono" : ""
        }`}
      >
        {value}
      </span>

    </div>

  );
}