export interface ProductionSeries {
  labels: string[];
  maize: number[];
  beans: number[];
  potatoes: number[];
}

export const ANALYTICS_DATA: { all: ProductionSeries; recent: ProductionSeries } = {
  all: {
    labels: ["2019", "2020", "2021", "2022", "2023", "2024", "2025"],
    maize: [200, 230, 280, 310, 355, 356, 420],
    beans: [90, 100, 120, 145, 155, 171, 185],
    potatoes: [150, 180, 200, 250, 280, 326, 310],
  },
  recent: {
    labels: ["2022", "2023", "2024", "2025"],
    maize: [310, 355, 356, 420],
    beans: [145, 155, 171, 185],
    potatoes: [250, 280, 326, 310],
  },
};

export const CROP_PRICES = { maize: 3800, beans: 2600, potatoes: 1800 } as const;
export type Crop = keyof typeof CROP_PRICES | "all";
export type YearRange = "all" | "recent";

export const MONTHLY_2025: Record<Exclude<Crop, "all">, number[]> = {
  maize: [0, 0, 20, 60, 120, 180, 240, 300, 360, 420, 420, 420],
  beans: [0, 0, 30, 70, 110, 140, 160, 175, 185, 185, 185, 185],
  potatoes: [0, 20, 50, 100, 170, 220, 270, 300, 310, 310, 310, 310],
};

export const CROP_COLORS: Record<Exclude<Crop, "all">, string> = {
  maize: "#2d7a4f",
  beans: "#d4a96a",
  potatoes: "#8b5e3c",
};
