"use server";

import supabase from "@/config/supabase-client-config";

export const addNewSalon = async (data: any) => {
  try {
    const { data: salon, error } = await supabase.from("salons").insert(data);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      data: salon,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const editSalonById = async (id: string, data: any) => {
  try {
    const { data: salon, error } = await supabase
      .from("salons")
      .update(data)
      .match({ id });
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      data: salon,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getSalonsByOwnerId = async (ownerId: string) => {
  try {
    const { data: salons, error } = await supabase
      .from("salons")
      .select("*")
      .match({ owner_id: ownerId });
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      data: salons,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getSalonById = async (id: string) => {
  try {
    const { data: salons, error } = await supabase
      .from("salons")
      .select("*")
      .match({ id })
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      data: salons[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const deleteSalonById = async (id: string) => {
  try {
    const { error } = await supabase.from("salons").delete().match({ id });
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
