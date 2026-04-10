import { supabase } from "@/integrations/supabase/client";
import type { Challan } from "@/data/mockData";

export interface ChallanRow {
  id: string;
  challan_number: string;
  vehicle_number: string;
  owner_name: string;
  violation_type: string;
  location: string;
  challan_date: string;
  challan_time: string;
  fine_amount: number;
  status: "pending" | "paid" | "disputed" | "overdue";
  officer_name: string;
  officer_badge: string;
  due_date: string;
  state?: string;
  created_at?: string;
  updated_at?: string;
}

// Convert database row to Challan interface
export const rowToChallan = (row: ChallanRow): Challan => ({
  id: row.id,
  challanNumber: row.challan_number,
  vehicleNumber: row.vehicle_number,
  ownerName: row.owner_name,
  violationType: row.violation_type,
  location: row.location,
  date: row.challan_date,
  time: row.challan_time,
  fineAmount: row.fine_amount,
  status: row.status,
  officerName: row.officer_name,
  officerBadge: row.officer_badge,
  dueDate: row.due_date,
  state: row.state,
});

// Fetch all challans
export const fetchAllChallans = async (): Promise<Challan[]> => {
  try {
    const { data, error } = await supabase
      .from("challans")
      .select("*")
      .order("challan_date", { ascending: false });

    if (error) throw error;
    return data?.map(rowToChallan) || [];
  } catch (error) {
    console.error("Error fetching challans:", error);
    return [];
  }
};

// Search challans by vehicle number
export const searchChallansByVehicle = async (vehicleNumber: string): Promise<Challan[]> => {
  try {
    const { data, error } = await supabase
      .from("challans")
      .select("*")
      .ilike("vehicle_number", `%${vehicleNumber}%`)
      .order("challan_date", { ascending: false });

    if (error) throw error;
    return data?.map(rowToChallan) || [];
  } catch (error) {
    console.error("Error searching challans:", error);
    return [];
  }
};

// Search challans by challan number
export const searchChallansByNumber = async (challanNumber: string): Promise<Challan[]> => {
  try {
    const { data, error } = await supabase
      .from("challans")
      .select("*")
      .ilike("challan_number", `%${challanNumber}%`)
      .order("challan_date", { ascending: false });

    if (error) throw error;
    return data?.map(rowToChallan) || [];
  } catch (error) {
    console.error("Error searching challans:", error);
    return [];
  }
};

// Search challans by owner name
export const searchChallansByOwner = async (ownerName: string): Promise<Challan[]> => {
  try {
    const { data, error } = await supabase
      .from("challans")
      .select("*")
      .ilike("owner_name", `%${ownerName}%`)
      .order("challan_date", { ascending: false });

    if (error) throw error;
    return data?.map(rowToChallan) || [];
  } catch (error) {
    console.error("Error searching challans:", error);
    return [];
  }
};

// Fetch pending and overdue challans
export const fetchPendingChallans = async (): Promise<Challan[]> => {
  try {
    const { data, error } = await supabase
      .from("challans")
      .select("*")
      .in("status", ["pending", "overdue"])
      .order("challan_date", { ascending: false });

    if (error) throw error;
    return data?.map(rowToChallan) || [];
  } catch (error) {
    console.error("Error fetching pending challans:", error);
    return [];
  }
};

// Insert a new challan
export const insertChallan = async (challan: Omit<ChallanRow, "id" | "created_at" | "updated_at">): Promise<boolean> => {
  try {
    const { error } = await supabase.from("challans").insert([challan]);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error inserting challan:", error);
    return false;
  }
};

// Batch insert challans
export const batchInsertChallans = async (
  challans: Omit<ChallanRow, "id" | "created_at" | "updated_at">[]
): Promise<boolean> => {
  try {
    const { error } = await supabase.from("challans").insert(challans);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error batch inserting challans:", error);
    return false;
  }
};
