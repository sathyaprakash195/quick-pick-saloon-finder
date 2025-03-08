"use server";

import supabase from "@/config/supabase-client-config";

export const getDashboardData = async (userId: string, role: string) => {
  try {
    let qry = supabase.from("appointments").select("* , salons(*)");

    if (role === "user") {
      qry = qry.eq("user_id", userId);
    } else if (role === "salon-owner") {
      qry = qry.eq("salons.owner_id", userId);
    }
    const { data, error } = await qry;
    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    const dashboardData = {
      totalBookings: data.length,
      cancelledBookings: data.filter(
        (booking: any) => booking.status === "cancelled"
      ).length,
      completedBookings: data.filter(
        (booking: any) => booking.status === "completed"
      ).length,
      upcomingBookings: data.filter(
        (booking: any) => booking.status === "booked"
      ).length,
    };

    return {
      success: true,
      data: dashboardData,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
