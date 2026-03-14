import { useState } from "react";
import Header from "./component/Header";
import PredictionForm from "./component/PredictionForm";
import PredictionResult from "./component/PredictionResult";
import "./App.css";

export default function App() {

  const [result, setResult] = useState(null);

  // Flask se jo response aayega wahi store karenge
  const handlePredict = (data) => {
    setResult(data);
  };

  return (

    <div className="min-h-screen bg-background">

      <div className="w-full mx-auto">

        <Header />

        {/* TWO COLUMN LAYOUT */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">

          <PredictionForm onPredict={handlePredict} />

          <PredictionResult result={result} />

        </div>

      </div>

    </div>

  );
}

