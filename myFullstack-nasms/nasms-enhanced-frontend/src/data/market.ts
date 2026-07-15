export interface MarketEntry {
  name: string;
  location: string;
  crops: string[];
  price: string;
  color: string;
  icon: string;
}

export const BUYERS: MarketEntry[] = [
  { name: "Naivas Supermarket Ltd.", location: "Nairobi, Kiambu", crops: ["Tomatoes", "Kales", "Potatoes"], price: "KES 65/kg (tomatoes)", color: "linear-gradient(135deg,#2d7a4f,#4caf72)", icon: "🏪" },
  { name: "Unga Group PLC", location: "Nairobi (Countrywide)", crops: ["Maize", "Wheat", "Sorghum"], price: "KES 3,800/bag (maize)", color: "linear-gradient(135deg,#8b5e3c,#d4a96a)", icon: "🌽" },
  { name: "New KCC Dairy", location: "Nakuru, Nyeri, Meru", crops: ["Raw Milk", "Butter"], price: "KES 45/litre (raw milk)", color: "linear-gradient(135deg,#1a3a5c,#4a90d9)", icon: "🥛" },
  { name: "Carrefour Kenya", location: "Nairobi, Mombasa", crops: ["Kales", "Spinach", "Capsicum", "Onions"], price: "KES 55/kg (capsicum)", color: "linear-gradient(135deg,#4a7a1e,#7aba3a)", icon: "🥬" },
  { name: "Bidco Africa", location: "Thika, Nairobi", crops: ["Sunflower", "Soybeans"], price: "KES 80/kg (sunflower)", color: "linear-gradient(135deg,#b58900,#e0b840)", icon: "🌻" },
];

export const SELLERS: MarketEntry[] = [
  { name: "Peter Njoroge Farm", location: "Nyeri County", crops: ["Tea", "Potatoes", "Pyrethrum"], price: "KES 1,800/bag (potatoes)", color: "linear-gradient(135deg,#2d7a4f,#4caf72)", icon: "👨‍🌾" },
  { name: "Amina Odhiambo Holdings", location: "Kisumu County", crops: ["Rice", "Fish", "Groundnuts"], price: "KES 120/kg bulk (rice)", color: "linear-gradient(135deg,#5c3d1e,#d4a96a)", icon: "👩‍🌾" },
  { name: "Green Acres Farm", location: "Murang'a County", crops: ["Avocado", "Passion Fruit", "Macadamia"], price: "KES 18/piece export (avocado)", color: "linear-gradient(135deg,#1a4d2e,#4caf72)", icon: "🥑" },
  { name: "Rift Valley Growers", location: "Nakuru County", crops: ["Wheat", "Barley", "Potatoes"], price: "KES 3,200/bag (wheat)", color: "linear-gradient(135deg,#8b5e3c,#c49a5a)", icon: "🌾" },
];
