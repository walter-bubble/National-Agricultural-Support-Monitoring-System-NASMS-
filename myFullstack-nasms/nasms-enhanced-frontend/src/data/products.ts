export type Availability = "in" | "limited" | "out";

export interface Product {
  id: number;
  icon: string;
  name: string;
  category: "seed" | "fertilizer" | "pesticide" | "equipment";
  cat: string;
  desc: string;
  avail: Availability;
}

export const PRODUCTS: Product[] = [
  { id: 1, icon: "🌽", name: "Certified Maize Seed (DH04)", category: "seed", cat: "Seeds", desc: "High-yield drought-tolerant variety. 10 kg bag, treated for storage pests.", avail: "in" },
  { id: 2, icon: "🧴", name: "DAP Fertilizer 50 kg", category: "fertilizer", cat: "Fertilizer", desc: "Di-Ammonium Phosphate. Government-subsidised at 40% off market price.", avail: "in" },
  { id: 3, icon: "🪲", name: "Actellic Super Insecticide 500ml", category: "pesticide", cat: "Pesticide", desc: "Broad-spectrum insecticide for stored grain and standing crops.", avail: "limited" },
  { id: 4, icon: "🌿", name: "Certified Bean Seeds (KK8)", category: "seed", cat: "Seeds", desc: "Early maturing variety with resistance to bean stem maggot. 2 kg packet.", avail: "in" },
  { id: 5, icon: "⚗️", name: "CAN Fertilizer 50 kg", category: "fertilizer", cat: "Fertilizer", desc: "Calcium Ammonium Nitrate for top-dressing. Suitable for all crop types.", avail: "in" },
  { id: 6, icon: "🚜", name: "Hand-Operated Maize Sheller", category: "equipment", cat: "Equipment", desc: "Durable cast-iron sheller, processes up to 200 kg/hour.", avail: "out" },
  { id: 7, icon: "🌾", name: "Wheat Seed BW1 (10 kg)", category: "seed", cat: "Seeds", desc: "Bread wheat variety adapted for medium-altitude areas.", avail: "in" },
  { id: 8, icon: "🧪", name: "Mancozeb Fungicide 1 kg", category: "pesticide", cat: "Pesticide", desc: "Protective fungicide for late blight and downy mildew on vegetables.", avail: "in" },
  { id: 9, icon: "🌱", name: "Hybrid Sorghum Seed 5 kg", category: "seed", cat: "Seeds", desc: "Drought-tolerant sorghum for ASAL regions. High yield potential.", avail: "in" },
  { id: 10, icon: "💧", name: "Drip Irrigation Kit (0.5 ac)", category: "equipment", cat: "Equipment", desc: "Complete drip kit for half-acre greenhouse or open-field crops.", avail: "limited" },
];
