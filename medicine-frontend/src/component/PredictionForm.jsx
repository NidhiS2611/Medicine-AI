import { useState } from "react";

export default function PredictionForm({ onPredict }) {

const [medicine,setMedicine] = useState("");
const [month,setMonth] = useState("");
const [year,setYear] = useState("");
const [stock,setStock] = useState("");
const [expiry,setExpiry] = useState("");
const [price,setPrice] = useState("");

const handleSubmit = async (e) => {
e.preventDefault();

const response = await fetch("https://medicine-ai-ozai.onrender.com/predict",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
medicine,
month,
year,
stock,
expiry,
price
})
});

const data = await response.json();

onPredict(data);
};

return(

<form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">

<div className="flex items-center gap-3 mb-6">

<div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center text-white">
⚗️
</div>

<div>
<h2 className="font-semibold text-lg">Prediction Input</h2>
<p className="text-sm text-gray-500">
Enter medicine details to predict sales
</p>
</div>

</div>


<div className="space-y-4">

{/* Medicine Name */}

<div>

<label className="text-sm font-medium text-gray-700">
Medicine Name
</label>

<input
type="text"
placeholder="e.g. Paracetamol"
value={medicine}
onChange={(e)=>setMedicine(e.target.value)}
className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
/>

</div>


{/* Month + Year */}

<div className="grid grid-cols-2 gap-4">

<div>

<label className="text-sm font-medium text-gray-700">
Month
</label>

<input
type="number"
placeholder="1 - 12"
value={month}
onChange={(e)=>setMonth(e.target.value)}
className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
/>

</div>

<div>

<label className="text-sm font-medium text-gray-700">
Year
</label>

<input
type="number"
placeholder="2026"
value={year}
onChange={(e)=>setYear(e.target.value)}
className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
/>

</div>

</div>


{/* Stock */}

<div>

<label className="text-sm font-medium text-gray-700">
Stock Available
</label>

<input
type="text"
inputMode="numeric"
placeholder="e.g. 4230"
value={stock}
onChange={(e)=>setStock(e.target.value)}
className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
/>

</div>


{/* Expiry */}

<div>

<label className="text-sm font-medium text-gray-700">
Expiry Days Remaining
</label>

<input
type="text"
inputMode="numeric"
placeholder="e.g. 120"
value={expiry}
onChange={(e)=>setExpiry(e.target.value)}
className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
/>

</div>


{/* Unit Price */}

<div>

<label className="text-sm font-medium text-gray-700">
Unit Price (₹)
</label>

<input
type="text"
inputMode="numeric"
placeholder="e.g. 45"
value={price}
onChange={(e)=>setPrice(e.target.value)}
className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
/>

</div>


<button
type="submit"
className="w-full mt-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition"
>

🔮 Predict Sales

</button>

</div>

</form>

)
}