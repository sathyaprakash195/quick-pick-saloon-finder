"use server";

import supabase from "@/config/supabase-client-config";

export const bookNewAppointment = async (data: any) => {
  try {
    const { error } = await supabase.from("appointments").insert([data]);
    if (error) {
      throw error;
    }
    return {
      success: true,
      message: "Appointment booked successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to book appointment",
    };
  }
};

export const getAppointmentsByUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("* , salons(name)")
      .eq("user_id", userId);

    if (error) {
      throw error;
    }
    return {
      success: true,
      data: data.map((appointment: any) => ({
        ...appointment,
        salon: appointment.salons,
      })),
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch appointments",
    };
  }
};
