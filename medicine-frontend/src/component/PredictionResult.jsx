import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, ShieldCheck, AlertTriangle, FileText } from "lucide-react";

const monthNames = [
  "", "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function PredictionResult({ result }) {

  const reportRef = useRef(null);
  const [downloading,setDownloading] = useState(false);

  // 🔴 FIX 1 — result undefined ho to UI crash na ho
  if(!result){
    return(
      <div className="p-6 bg-white rounded-xl shadow text-center text-gray-400">
        Enter medicine details to see prediction report
      </div>
    )
  }

  const handleDownloadPDF = async () => {

    if(!reportRef.current) return;

    setDownloading(true);

    try{

      const el = reportRef.current;

      el.style.display="block";

      const canvas = await html2canvas(el,{
        scale:2,
        backgroundColor:"#ffffff"
      });

      el.style.display="none";

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p","mm","a4");

      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData,"PNG",0,0,width,height);

      pdf.save(`${result.medicineName}_prediction_report.pdf`);

    }
    finally{
      setDownloading(false);
    }

  };

  const isSafe = result.riskLevel === "SAFE";

  return (

    <div className="space-y-4">

      {/* Summary Card */}

      <div className="p-6 shadow-lg border-0 bg-white rounded-xl space-y-5">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white"/>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Prediction Summary
            </h3>

            <p className="text-xs text-gray-500">
              {monthNames[result.month]} {result.year}
            </p>
          </div>

        </div>

        <SummaryRow label="Medicine Name" value={result.medicineName} large/>

        <SummaryRow
          label="Predicted Demand"
          value={`${result.predictedSales?.toLocaleString("en-IN")} units`}
          mono
        />

        <SummaryRow
          label="Remaining Stock"
          value={`${result.remainingStock?.toLocaleString("en-IN")} units`}
          mono
        />

        {/* Risk */}

        <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-gray-100">

          <span className="text-sm font-medium text-gray-500">
            Risk Level
          </span>

          <span className={`flex items-center gap-2 px-3 py-1 text-sm rounded
          ${isSafe ? "bg-green-600 text-white" : "bg-red-600 text-white"}
          `}>

            {isSafe ? <ShieldCheck size={16}/> : <AlertTriangle size={16}/>}

            {result.riskLevel}

          </span>

        </div>

        {/* Loss */}

        <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-gray-100">

          <span className="text-sm font-medium text-gray-500">
            Estimated Loss
          </span>

          <span className={`text-xl font-bold ${result.lossEstimate>0 ? "text-red-600":"text-green-600"}`}>
            ₹{result.lossEstimate?.toLocaleString("en-IN")}
          </span>

        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white h-12 text-base font-semibold rounded-lg"
        >

          <Download className="w-5 h-5 inline mr-2"/>

          {downloading ? "Generating..." : "Download Full Report"}

        </button>

      </div>

      {/* Hidden PDF */}

<div
  ref={reportRef}
  style={{
    display: "none",
      width: "794px",
    margin: "0 auto",
    padding: "60px"
  }}
  className="bg-white text-gray-900"
>

<div style={{ padding: " 0px", fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }}>

{/* Header */}

<div style={{ borderBottom: "3px solid #0d9488", paddingBottom: "24px", marginBottom: "32px" }}>

<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>

<div>

<h1 style={{ fontSize: "24px", fontWeight: 800, color: "#111827", marginLeft:"4px" }}>
Medicine Stock Prediction Report
</h1>

<p style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px",marginRight:"4px" }}>
Medicine Inventory Prediction System
</p>

</div>

<div style={{ textAlign: "right", fontSize: "12px", color: "#6b7280" }}>

<p style={{ margin: 0 }}>
Date: <strong>
{new Date().toLocaleDateString("en-IN",{
day:"2-digit",
month:"long",
year:"numeric"
})}
</strong>
</p>

</div>

</div>

</div>

{/* Medicine Details */}

<SectionHeading title="Medicine Details"/>

<table style={{ width:"100%",borderCollapse:"collapse",marginBottom:"28px" }}>

<tbody>

<PdfRow label="Medicine Name" value={result.medicineName}/>

<PdfRow
label="Prediction Period"
value={`${monthNames[result.month]} ${result.year}`}
/>

<PdfRow
label="Unit Price"
value={`₹${result.unitPrice}`}
/>

</tbody>

</table>

{/* Inventory */}

<SectionHeading title="Inventory Analysis"/>

<table style={{ width:"100%",borderCollapse:"collapse",marginBottom:"28px" }}>

<tbody>

<PdfRow
label="Current Stock"
value={`${result.stock} units`}
/>

<PdfRow
label="Predicted Demand"
value={`${result.predictedSales} units`}
bold
/>

<PdfRow
label="Remaining Stock"
value={`${result.remainingStock} units`}
/>

<PdfRow
label="Expiry Days"
value={`${result.expiryDays} days`}
/>

</tbody>

</table>

{/* Risk */}

<SectionHeading title="Risk Assessment"/>

<table style={{ width:"100%",borderCollapse:"collapse",marginBottom:"28px" }}>

<tbody>

<PdfRow
label="Risk Level"
value={result.riskLevel}
bold
valueColor={isSafe ? "#15803d" : "#dc2626"}
/>

<PdfRow
label="Estimated Financial Loss"
value={`₹${result.lossEstimate}`}
bold
valueColor={result.lossEstimate>0 ? "#dc2626":"#15803d"}
/>

</tbody>

</table>
{result.riskLevel === "EXPIRY RISK" && (

<div style={{
marginTop:"20px",
padding:"18px",
borderRadius:"8px",
border:"2px solid #fca5a5",
background:"#fef2f2"
}}>

<p style={{
color:"#b91c1c",
fontWeight:"700",
marginBottom:"8px"
}}>
⚠ EXPIRY RISK — Stock exceeds predicted demand. Unsold inventory may expire, resulting in loss of ₹{result.lossEstimate}.
</p>

<p style={{
fontSize:"13px",
color:"#374151",
margin:0
}}>
<strong>Recommendation:</strong> Consider promotional offers or redistributing excess stock to reduce potential losses.
</p>

</div>

)}

{/* Footer */}

<div style={{ borderTop:"1px solid #e5e7eb",paddingTop:"16px",display:"flex",justifyContent:"space-between" }}>

<p style={{ fontSize:"10px",color:"#9ca3af",margin:0 }}>
System generated report
</p>

<p style={{ fontSize:"10px",color:"#9ca3af",margin:0 }}>
© {new Date().getFullYear()} Medicine Inventory System
</p>

</div>

</div>

</div>

    </div>

  );

}

function SummaryRow({label,value,mono,large}){

  return(

    <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-gray-100">

      <span className="text-sm font-medium text-gray-500">
        {label}
      </span>

      <span className={`font-semibold ${large?"text-base":"text-sm"} ${mono?"font-mono":""}`}>
        {value}
      </span>

    </div>

  );

}
function SectionHeading({title}){

return(


<h2 style={{
fontSize:"14px",
fontWeight:700,
color:"#111827",
textTransform:"uppercase",
letterSpacing:"1.5px",
marginBottom:"14px",
paddingBottom:"8px",
marginLeft:"6px",
borderBottom:"2px solid #0d9488",
width:"100%",
textAlign:"left",
display: "block",
      
}}>
{title}
</h2>

)

}
function PdfRow({label,value,bold,valueColor}){

return(

<tr>

<td style={{
padding:"12px 14px",
borderBottom:"1px solid #f3f4f6",
color:"#6b7280",
fontWeight:500,
width:"50%",
textAlign:"left",
}}>
{label}
</td>

 <td style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", fontWeight: bold ? 700 : 600, color: valueColor || "#111827", fontSize: "14px" }}>{value}</td>
    </tr>




)

}