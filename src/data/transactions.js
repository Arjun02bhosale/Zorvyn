import { subDays, subMonths, format } from "date-fns";

const today = new Date();

export const CATEGORIES = {
  FOOD:          { label: "Food & Dining",  color: "#FF6B6B" },
  TRANSPORT:     { label: "Transport",       color: "#4ECDC4" },
  SHOPPING:      { label: "Shopping",        color: "#FFE66D" },
  UTILITIES:     { label: "Utilities",       color: "#A8E6CF" },
  HEALTH:        { label: "Health",          color: "#FF8B94" },
  ENTERTAINMENT: { label: "Entertainment",   color: "#B4A0FF" },
  SALARY:        { label: "Salary",          color: "#69D2E7" },
  FREELANCE:     { label: "Freelance",       color: "#F9A828" },
  INVESTMENT:    { label: "Investment",      color: "#C8F7C5" },
  RENT:          { label: "Rent",            color: "#FFC0A9" },
};

const rawTransactions = [
  // Month 0 (current)
  { id:  1, date: subDays(today, 1),  amount: 85000, category: "SALARY",        type: "income",  description: "Monthly Salary - TechCorp" },
  { id:  2, date: subDays(today, 2),  amount:  1240, category: "FOOD",          type: "expense", description: "Big Basket Groceries" },
  { id:  3, date: subDays(today, 3),  amount:   499, category: "ENTERTAINMENT", type: "expense", description: "Netflix Subscription" },
  { id:  4, date: subDays(today, 4),  amount: 12000, category: "RENT",          type: "expense", description: "Monthly Rent" },
  { id:  5, date: subDays(today, 5),  amount:   650, category: "TRANSPORT",     type: "expense", description: "Ola Monthly Pass" },
  { id:  6, date: subDays(today, 6),  amount:  3200, category: "SHOPPING",      type: "expense", description: "Myntra Order" },
  { id:  7, date: subDays(today, 7),  amount: 15000, category: "FREELANCE",     type: "income",  description: "UI Design Project" },
  { id:  8, date: subDays(today, 8),  amount:   890, category: "HEALTH",        type: "expense", description: "Apollo Pharmacy" },
  { id:  9, date: subDays(today, 9),  amount:   420, category: "FOOD",          type: "expense", description: "Zomato Order" },
  { id: 10, date: subDays(today, 10), amount:  2400, category: "UTILITIES",     type: "expense", description: "Electricity Bill" },
  { id: 11, date: subDays(today, 11), amount:  5000, category: "INVESTMENT",    type: "income",  description: "Mutual Fund Dividend" },
  { id: 12, date: subDays(today, 12), amount:   760, category: "FOOD",          type: "expense", description: "Swiggy Dine Out" },
  { id: 13, date: subDays(today, 13), amount:  1200, category: "HEALTH",        type: "expense", description: "Dr. Sharma Consultation" },
  { id: 14, date: subDays(today, 14), amount:   350, category: "TRANSPORT",     type: "expense", description: "Petrol Refill" },
  { id: 15, date: subDays(today, 15), amount:  4500, category: "SHOPPING",      type: "expense", description: "Amazon Electronics" },

  // Month -1
  { id: 16, date: subMonths(subDays(today, 3),  1), amount: 85000, category: "SALARY",        type: "income",  description: "Monthly Salary - TechCorp" },
  { id: 17, date: subMonths(subDays(today, 5),  1), amount:  1100, category: "FOOD",          type: "expense", description: "Reliance Fresh" },
  { id: 18, date: subMonths(subDays(today, 8),  1), amount: 12000, category: "RENT",          type: "expense", description: "Monthly Rent" },
  { id: 19, date: subMonths(subDays(today, 10), 1), amount:  8000, category: "FREELANCE",     type: "income",  description: "Content Writing" },
  { id: 20, date: subMonths(subDays(today, 12), 1), amount:  2100, category: "SHOPPING",      type: "expense", description: "Flipkart Sale" },
  { id: 21, date: subMonths(subDays(today, 15), 1), amount:   600, category: "ENTERTAINMENT", type: "expense", description: "BookMyShow" },
  { id: 22, date: subMonths(subDays(today, 18), 1), amount:   980, category: "TRANSPORT",     type: "expense", description: "Rapido Weekly" },
  { id: 23, date: subMonths(subDays(today, 20), 1), amount:  1800, category: "UTILITIES",     type: "expense", description: "Internet + Mobile" },
  { id: 24, date: subMonths(subDays(today, 22), 1), amount:  3500, category: "INVESTMENT",    type: "income",  description: "Stock Dividends" },
  { id: 25, date: subMonths(subDays(today, 25), 1), amount:   550, category: "HEALTH",        type: "expense", description: "Gym Membership" },
  { id: 26, date: subMonths(subDays(today, 27), 1), amount:  2200, category: "FOOD",          type: "expense", description: "Team Lunch" },

  // Month -2
  { id: 27, date: subMonths(subDays(today, 2),  2), amount: 85000, category: "SALARY",        type: "income",  description: "Monthly Salary - TechCorp" },
  { id: 28, date: subMonths(subDays(today, 6),  2), amount: 12000, category: "RENT",          type: "expense", description: "Monthly Rent" },
  { id: 29, date: subMonths(subDays(today, 9),  2), amount: 20000, category: "FREELANCE",     type: "income",  description: "App Development" },
  { id: 30, date: subMonths(subDays(today, 11), 2), amount:  4800, category: "SHOPPING",      type: "expense", description: "Diwali Shopping" },
  { id: 31, date: subMonths(subDays(today, 14), 2), amount:  1500, category: "FOOD",          type: "expense", description: "Restaurant Dinner" },
  { id: 32, date: subMonths(subDays(today, 16), 2), amount:  8000, category: "INVESTMENT",    type: "income",  description: "SIP Returns" },
  { id: 33, date: subMonths(subDays(today, 19), 2), amount:   900, category: "ENTERTAINMENT", type: "expense", description: "Spotify + YouTube" },
  { id: 34, date: subMonths(subDays(today, 22), 2), amount:  2600, category: "UTILITIES",     type: "expense", description: "Bills" },
  { id: 35, date: subMonths(subDays(today, 24), 2), amount:   700, category: "HEALTH",        type: "expense", description: "Medicine" },
  { id: 36, date: subMonths(subDays(today, 28), 2), amount:  1100, category: "TRANSPORT",     type: "expense", description: "Cab Rides" },

  // Month -3
  { id: 37, date: subMonths(subDays(today, 4),  3), amount: 85000, category: "SALARY",        type: "income",  description: "Monthly Salary - TechCorp" },
  { id: 38, date: subMonths(subDays(today, 7),  3), amount: 12000, category: "RENT",          type: "expense", description: "Monthly Rent" },
  { id: 39, date: subMonths(subDays(today, 10), 3), amount:  1300, category: "FOOD",          type: "expense", description: "Groceries" },
  { id: 40, date: subMonths(subDays(today, 13), 3), amount:  5000, category: "FREELANCE",     type: "income",  description: "Logo Design" },
  { id: 41, date: subMonths(subDays(today, 16), 3), amount:  3200, category: "SHOPPING",      type: "expense", description: "Clothes" },
  { id: 42, date: subMonths(subDays(today, 20), 3), amount:  1800, category: "UTILITIES",     type: "expense", description: "Electricity" },
  { id: 43, date: subMonths(subDays(today, 23), 3), amount:   400, category: "ENTERTAINMENT", type: "expense", description: "Gaming" },
  { id: 44, date: subMonths(subDays(today, 26), 3), amount:   600, category: "HEALTH",        type: "expense", description: "Vitamins" },

  // Month -4
  { id: 45, date: subMonths(subDays(today, 5),  4), amount: 85000, category: "SALARY",        type: "income",  description: "Monthly Salary - TechCorp" },
  { id: 46, date: subMonths(subDays(today, 8),  4), amount: 12000, category: "RENT",          type: "expense", description: "Monthly Rent" },
  { id: 47, date: subMonths(subDays(today, 11), 4), amount: 12000, category: "FREELANCE",     type: "income",  description: "Consulting Work" },
  { id: 48, date: subMonths(subDays(today, 14), 4), amount:  2800, category: "FOOD",          type: "expense", description: "Food & Dining" },
  { id: 49, date: subMonths(subDays(today, 17), 4), amount:  5500, category: "SHOPPING",      type: "expense", description: "Tech Gadgets" },
  { id: 50, date: subMonths(subDays(today, 20), 4), amount:  4200, category: "INVESTMENT",    type: "income",  description: "Dividends" },
  { id: 51, date: subMonths(subDays(today, 23), 4), amount:  2100, category: "UTILITIES",     type: "expense", description: "Bills" },
  { id: 52, date: subMonths(subDays(today, 26), 4), amount:   800, category: "TRANSPORT",     type: "expense", description: "Travel" },

  // Month -5
  { id: 53, date: subMonths(subDays(today, 6),  5), amount: 85000, category: "SALARY",        type: "income",  description: "Monthly Salary - TechCorp" },
  { id: 54, date: subMonths(subDays(today, 9),  5), amount: 12000, category: "RENT",          type: "expense", description: "Monthly Rent" },
  { id: 55, date: subMonths(subDays(today, 12), 5), amount:  9000, category: "FREELANCE",     type: "income",  description: "Web Project" },
  { id: 56, date: subMonths(subDays(today, 15), 5), amount:  1900, category: "FOOD",          type: "expense", description: "Groceries" },
  { id: 57, date: subMonths(subDays(today, 18), 5), amount:  1500, category: "ENTERTAINMENT", type: "expense", description: "Concert Tickets" },
  { id: 58, date: subMonths(subDays(today, 21), 5), amount:   900, category: "HEALTH",        type: "expense", description: "Dental" },
  { id: 59, date: subMonths(subDays(today, 24), 5), amount:  2300, category: "UTILITIES",     type: "expense", description: "Bills" },
  { id: 60, date: subMonths(subDays(today, 27), 5), amount:  3100, category: "SHOPPING",      type: "expense", description: "Shopping" },
];

export const transactions = rawTransactions.map((t) => ({
  ...t,
  date: format(t.date, "yyyy-MM-dd"),
  categoryData: CATEGORIES[t.category],
}));

export const INITIAL_BALANCE = 42000;
