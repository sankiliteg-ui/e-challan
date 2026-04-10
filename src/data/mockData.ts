export interface Challan {
  id: string;
  challanNumber: string;
  vehicleNumber: string;
  ownerName: string;
  violationType: string;
  location: string;
  date: string;
  time: string;
  fineAmount: number;
  status: "pending" | "paid" | "disputed" | "overdue";
  officerName: string;
  officerBadge: string;
  dueDate: string;
  state?: string;
  photo?: string;
}

export const violationTypes = [
  "Over Speeding",
  "Red Light Violation",
  "No Helmet",
  "No Seat Belt",
  "Drunk Driving",
  "Wrong Side Driving",
  "No Parking",
  "Using Mobile Phone",
  "Without License",
  "Document Missing",
  "Overloading",
  "Lane Violation",
];

export const mockChallans: Challan[] = [
  {
    id: "1",
    challanNumber: "DL-2024-00145823",
    vehicleNumber: "DL 01 AB 1234",
    ownerName: "Rajesh Kumar",
    violationType: "Over Speeding",
    location: "NH-48, Near Toll Plaza, Gurugram",
    date: "2024-12-15",
    time: "14:30",
    fineAmount: 2000,
    status: "pending",
    officerName: "SI Anil Sharma",
    officerBadge: "DTP-4521",
    dueDate: "2025-01-15",
  },
  {
    id: "2",
    challanNumber: "DL-2024-00145824",
    vehicleNumber: "DL 01 AB 1234",
    ownerName: "Rajesh Kumar",
    violationType: "No Seat Belt",
    location: "Ring Road, ITO Junction, Delhi",
    date: "2024-11-20",
    time: "09:15",
    fineAmount: 1000,
    status: "paid",
    officerName: "ASI Priya Singh",
    officerBadge: "DTP-3287",
    dueDate: "2024-12-20",
  },
  {
    id: "3",
    challanNumber: "MH-2024-00298341",
    vehicleNumber: "MH 02 CD 5678",
    ownerName: "Amit Patel",
    violationType: "Red Light Violation",
    location: "Western Express Highway, Andheri, Mumbai",
    date: "2024-12-10",
    time: "18:45",
    fineAmount: 5000,
    status: "overdue",
    officerName: "Inspector Suresh Jadhav",
    officerBadge: "MTP-1129",
    dueDate: "2025-01-10",
  },
  {
    id: "4",
    challanNumber: "KA-2024-00112233",
    vehicleNumber: "KA 05 EF 9012",
    ownerName: "Sneha Reddy",
    violationType: "Using Mobile Phone",
    location: "MG Road, Near Brigade Junction, Bengaluru",
    date: "2024-12-18",
    time: "11:00",
    fineAmount: 5000,
    status: "pending",
    officerName: "SI Ramesh Gowda",
    officerBadge: "BTP-7845",
    dueDate: "2025-01-18",
  },
  {
    id: "5",
    challanNumber: "UP-2024-00334455",
    vehicleNumber: "UP 32 GH 3456",
    ownerName: "Priya Verma",
    violationType: "No Helmet",
    location: "Lucknow-Kanpur Highway, Unnao",
    date: "2024-12-05",
    time: "16:20",
    fineAmount: 1000,
    status: "disputed",
    officerName: "Constable Vikram Yadav",
    officerBadge: "UPP-5563",
    dueDate: "2025-01-05",
  },
  {
    id: "6",
    challanNumber: "TN-2024-00556677",
    vehicleNumber: "TN 09 IJ 7890",
    ownerName: "Karthik Subramanian",
    violationType: "Drunk Driving",
    location: "Anna Salai, Guindy, Chennai",
    date: "2024-12-22",
    time: "23:30",
    fineAmount: 10000,
    status: "pending",
    officerName: "Inspector Lakshmi Narayanan",
    officerBadge: "CTP-2201",
    dueDate: "2025-01-22",
  },
];

export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh", "Puducherry",
];
