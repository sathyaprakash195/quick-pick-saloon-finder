"use client";
import { getReviewsByOwnerId } from "@/actions/reviews";
import Info from "@/components/info";
import PageTitle from "@/components/page-title";
import Spinner from "@/components/spinner";
import { IReview } from "@/interfaces";
import { IUsersStore, usersGlobalStore } from "@/store/users-store";
import dayjs from "dayjs";
import React from "react";
import toast from "react-hot-toast";

function SalonOwnerReviews() {
  const [reviews, setReviews] = React.useState<IReview[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const { user } = usersGlobalStore() as IUsersStore;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await getReviewsByOwnerId(user.id);
      if (!response.success) {
        throw new Error(response.message);
      }
      setReviews(response.data);
    } catch (error) {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const renderProperty = (label: string, value: any) => {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="font-bold text-sm">{value}</span>
      </div>
    );
  };

  React.useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div>
      <PageTitle title="My Reviews" />
      {loading && <Spinner />}

      {!loading && reviews.length === 0 && <Info message="No reviews found" />}

      {!loading && reviews.length > 0 && (
        <div className="flex flex-col gap-7">
          {reviews.map((review) => (
            <div
              className="border border-gray-400 p-5 rounded grid grid-cols-3 gap-5"
              key={review.id}
            >
              {renderProperty("Salon", review.salon.name)}
              {renderProperty("Rating", review.rating)}
              {renderProperty("Comment", review.comment)}
              {renderProperty(
                "Date",
                dayjs(review.created_at).format("DD MMM YYYY")
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SalonOwnerReviews;
