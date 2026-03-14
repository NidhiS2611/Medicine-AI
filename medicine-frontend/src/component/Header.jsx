import { Pill } from "lucide-react";

export default function Header() {
  return (
    <header className="gradient-header">

      <div className="w-full px-6 py-6 ">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <Pill className="w-6 h-6 text-primary-foreground" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">
              Medicine Inventory Prediction System
            </h1>

            <p className="text-sm text-primary-foreground/60">
              Predict sales • Manage expiry risk • Prevent losses
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}