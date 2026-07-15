const BASE_URL =import.meta.env.VITE_API_URL ?? "";

const isBrowser = typeof window !== "undefined";

// ─── Session helpers ───────────────────────────────────────────────────────────
export const getToken  = () => isBrowser ? localStorage.getItem("nasms_token")    : null;
export const getUser   = () => isBrowser ? localStorage.getItem("nasms_username")  : null;
export const getRole   = () => isBrowser ? localStorage.getItem("nasms_role")      : null;
export const getEmail  = () => isBrowser ? localStorage.getItem("nasms_email")     : null;

export const setToken  = (t: string) => { if (isBrowser) localStorage.setItem("nasms_token",    t); };
export const setUser   = (u: string) => { if (isBrowser) localStorage.setItem("nasms_username",  u); };
export const setRole   = (r: string) => { if (isBrowser) localStorage.setItem("nasms_role",      r); };
export const setEmail  = (e: string) => { if (isBrowser) localStorage.setItem("nasms_email",     e); };

export const removeToken = () => { if (isBrowser) localStorage.removeItem("nasms_token"); };

export const clearSession = () => {
  if (!isBrowser) return;
  ["nasms_token","nasms_username","nasms_role","nasms_email"].forEach(k => localStorage.removeItem(k));
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface LoginResponse  { token: string; username: string; role?: string; }
export interface RegisterPayload {
  fullName: string; nationalId: string; phone: string; email: string;
  farmSize: number; titleDeed: string; county: string; farmType: string; password: string;
}
export interface LoanProduct {
  id: number; name: string; amount: string; desc: string;
  status: "Open" | "Under Review" | "Closed";
  interest: string; duration: string; collateral: string; processing: string;
  loanCode?: string;
}
export interface Application {
  id: number; loanName: string; amount: number;
  applied: string; status: string; due: string;
}
export interface ApplyPayload   { loanProductId: string; loanName: string; amount: number; purpose: string; }
export interface WaitlistPayload{ loanProductId: number; loanName: string; }
export interface Farmer {
  id: number; fullName: string; name: string; email: string; phoneNumber: string;
  nationalId: number; farmSize: number; county: string; subCounty?: string;
  ward?: string; farmType: string; titleNumber: string; registeredDate: string;
}
export interface LoanAdmin {
  id: number; amount: number; interestRate: number; durationMonths: number;
  status: string; issuedDate: string; dueDate: string; totalPayment: number;
  remainingBalance: number;
  farmer?: Farmer;
  loanPackage?: { loanCode: string; description: string; };
}
export interface Season {
  id: number; seasonName: string; startDate: string; endDate: string;
  closed: boolean; budget: number; active?: boolean;
}
export interface LoanPackage {
  loanCode: string; amount: number; interestRate: number; durationMonths: number;
  monthlyPenalty: number; description: string; farmingSeason?: Season;
}
export interface WeatherData {
  main: { temp: number; feels_like: number; humidity: number; pressure: number; };
  weather: { description: string; icon: string; main: string; }[];
  wind: { speed: number; };
  name: string;
  rain?: { "1h"?: number; "3h"?: number; };
  clouds?: { all: number; };
  visibility?: number;
  sys?: { country: string; sunrise: number; sunset: number; };
}
export interface MarketListing {
  id?: number; productName: string; productCode: string;
  quantity: number; price: number; sellerId?: number; sellerName?: string;
}
export interface Document { id: number; name: string; type: string; url: string; status: string; uploadedAt: string; }
export type DocumentType = "national_id"|"title_deed"|"bank_statement"|"farm_records"|"crop_photos"|"business_plan"|"reference_letter"|"other";
export interface ApplyPayloadOld { loanProductId: number; loanName: string; amount: number; purpose: string; }

// ─── Core fetch ───────────────────────────────────────────────────────────────
export const apiCall = async <T = unknown>(
  endpoint: string, method = "GET", body: unknown = null
): Promise<T | null> => {
  const headers: Record<string,string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const config: RequestInit = { method, headers };
  if (body) config.body = JSON.stringify(body);
  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  if (response.status === 401) {
    clearSession();
    if (isBrowser) window.dispatchEvent(new Event("nasms:logout"));
    throw new Error("Session expired. Please log in again.");
  }
  if (!response.ok) {
    const err = await response.text().catch(() => "");
    throw new Error(err || `Request failed (${response.status})`);
  }
  const ct = response.headers.get("Content-Type") ?? "";
  if (response.status === 204 || !ct.includes("application/json")) return null;
  return response.json() as Promise<T>;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const login = (emailAddress: string, password: string) =>
  apiCall<LoginResponse>("/api/auth/login", "POST", { emailAddress, password });

export const register = (payload: RegisterPayload) =>
  apiCall("/api/auth/register/farmer", "POST", payload);

export const registerUser = (payload: { userName: string; emailAddress: string; password: string; role: string }) =>
  apiCall("/api/auth/register", "POST", payload);

// ─── Farmers ──────────────────────────────────────────────────────────────────
export const getFarmerProfile    = () => apiCall<Farmer>("/api/farmers/profile");
export const getAllFarmers        = () => apiCall<Farmer[]>("/api/farmers/");
export const getFarmerById       = (id: number) => apiCall<Farmer>(`/api/farmers/${id}`);
export const updateFarmer        = (id: number, data: Partial<Farmer>) => apiCall<Farmer>(`/api/farmers/${id}`, "PUT", data);
export const deleteFarmer        = (id: number) => apiCall(`/api/farmers/${id}`, "DELETE");

// ─── Notifications ────────────────────────────────────────────────────────────
export const getNotifications = () => apiCall<any[]>("/api/notifications");

// ─── Loans (farmer) ───────────────────────────────────────────────────────────
export const getLoans            = () => apiCall<LoanPackage[]>("/api/loan-package");
export const getMyApplications   = () => apiCall<Application[]>("/api/loans/applications/me");
export const applyForLoan        = (payload: ApplyPayload) => apiCall<Application>("/api/loans/apply", "POST", payload);
export const joinLoanWaitlist    = (payload: WaitlistPayload) => apiCall<void>("/api/loans/waitlist", "POST", payload);

// ─── Loans (admin) ────────────────────────────────────────────────────────────
export const getAllLoans          = () => apiCall<LoanAdmin[]>("/api/loans");
export const getLoanById         = (id: number) => apiCall<LoanAdmin>(`/api/loans/${id}`);
export const approveLoan         = (id: number) => apiCall<LoanAdmin>(`/api/loans/${id}/status`, "PUT", { status: "APPROVED" });
export const rejectLoan          = (id: number) => apiCall<LoanAdmin>(`/api/loans/${id}/status`, "PUT", { status: "REJECTED" });
export const deleteLoan          = (id: number) => apiCall(`/api/loans/${id}`, "DELETE");

// ─── Loan Packages (admin) ────────────────────────────────────────────────────
export const getAllLoanPackages   = () => apiCall<LoanPackage[]>("/api/loan-package");
export const createLoanPackage   = (data: Partial<LoanPackage>) => apiCall<LoanPackage>("/api/loan-package", "POST", data);
export const updateLoanPackage   = (code: string, data: Partial<LoanPackage>) => apiCall<LoanPackage>(`/api/loan-package/${code}`, "PUT", data);
export const deleteLoanPackage   = (code: string) => apiCall(`/api/loan-package/${code}`, "DELETE");

// ─── Seasons ──────────────────────────────────────────────────────────────────
export const getAllSeasons        = () => apiCall<Season[]>("/api/seasons");
export const createSeason        = (data: Partial<Season>) => apiCall<Season>("/api/seasons", "POST", data);
export const updateSeason        = (id: number, data: Partial<Season>) => apiCall<Season>(`/api/seasons/${id}`, "PUT", data);
export const deleteSeason        = (id: number) => apiCall(`/api/seasons/${id}`, "DELETE");

// ─── Market ───────────────────────────────────────────────────────────────────
export const getMarketListings   = () => apiCall<MarketListing[]>("/api/market-list/");
export const createMarketListing = (data: Partial<MarketListing>) => apiCall<MarketListing>("/api/market-list", "POST", data);
export const getTransactions     = () => apiCall<any[]>("/api/market/transactions/");

// ─── Weather ──────────────────────────────────────────────────────────────────
export const getWeather = (city: string) => apiCall<WeatherData>(`/api/weather?city=${encodeURIComponent(city)}`);

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const sendMessage   = (sender: string, receiver: string, content: string) =>
  apiCall("/api/chat/send", "POST", { sender, receiver, content });
export const getMessages   = (user1: string, user2: string) =>
  apiCall(`/api/chat/conversation?userA=${user1}&userB=${user2}`);

// ─── Analytics ────────────────────────────────────────────────────────────────
export const getSeasonAnalytics = (seasonId: number) =>
  apiCall(`/api/admin/analytics/season/${seasonId}`);
export const getAnalyticsGraph  = () =>
  apiCall("/api/admin/analytics/graph");
