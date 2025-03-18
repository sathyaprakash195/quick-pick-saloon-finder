"use server";

import supabase from "@/config/supabase-client-config";

export const submitNewReview = async (
  review: any,
  newAverage = 0,
  newTotalReviews = 0
) => {
  try {
    const { data, error } = await supabase.from("reviews").insert([review]);
    if (error) throw error;

    await supabase
      .from("appointments")
      .update({ is_review_given: true })
      .eq("id", review.appointment_id);

    await supabase
      .from("salons")
      .update({
        average_rating: newAverage,
        total_reviews: newTotalReviews,
      })
      .eq("id", review.salon_id);

    return {
      success: true,
      message: "Review submitted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getReviewsBySalonId = async (salonId: string) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("* , user_profiles(name)")
      .eq("salon_id", salonId);
    if (error) throw error;
    return {
      success: true,
      data: data.map((review: any) => {
        return {
          ...review,
          user: review.user_profiles[0],
        };
      }),
    };
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
};

export const getReviewsByUserId = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("* , salons(name)")
      .eq("user_id", userId);
    if (error) throw error;

    console.log(data);
    return {
      success: true,
      data: data.map((review: any) => {
        return {
          ...review,
          salon: review.salons,
        };
      }),
    };
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
};

export const getReviewsByOwnerId = async (ownerId: string) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("* , user_profiles(name) , salons(name)")
      .eq("owner_id", ownerId);
    if (error) throw error;
    return {
      success: true,
      data: data.map((review: any) => {
        return {
          ...review,
          user: review.user_profiles[0],
          salon: review.salons[0],
        };
      }),
    };
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
};
