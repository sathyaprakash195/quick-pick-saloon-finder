"use client";
import { bookNewAppointment } from "@/actions/appointments";
import { getSalonById } from "@/actions/salons";
import PageTitle from "@/components/page-title";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ISalon } from "@/interfaces";
import { IUsersStore, usersGlobalStore } from "@/store/users-store";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import toast from "react-hot-toast";

function SecheduleAppointmentCheckout() {
  const [salon, setSalon] = React.useState<ISalon | null>(null);
  const [date, setDate] = React.useState<string>("");
  const [startTime, setStartTime] = React.useState<string>("");
  const { user } = usersGlobalStore() as IUsersStore;
  const [bookingAppointment, setBookingAppointment] = React.useState(false);
  const [loading = true, setLoading] = React.useState<boolean>(true);
  const router = useRouter();
  const params: any = useParams();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getSalonById(params?.id!);
      if (response.success) {
        setSalon(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch salon details");
    } finally {
      setLoading(false);
    }
  };

  const renderProperty = (label: string, value: any) => {
    return (
      <div className="flex justify-between">
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-semibold text-sm">{value}</p>
      </div>
    );
  };

  const bookAppointmentHandler = async () => {
    try {
      setBookingAppointment(true);
      const payload = {
        user_id: user?.id,
        salon_id: salon?.id,
        date,
        start_time: startTime,
        end_time: dayjs(`${date} ${startTime}`)
          .add(salon?.slot_duration || 0, "minute")
          .format("HH:mm"),
        status: "booked",
      };

      const response = await bookNewAppointment(payload);
      toast.success(response.message);
      router.push("/user/appointments");
    } catch (error) {
      toast.error("Failed to book appointment");
    } finally {
      setBookingAppointment(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const slots = useMemo(() => {
    let slotsTemp: string[] = [];
    if (salon) {
      const sampleDate = dayjs().format("YYYY-MM-DD");
      let temp = dayjs(`${sampleDate} ${salon.start_time}`);
      const endTime = dayjs(`${sampleDate} ${salon.end_time}`);

      while (temp.isBefore(endTime)) {
        slotsTemp.push(temp.format("HH:mm"));
        temp = temp.add(salon.slot_duration || 0, "minute");
      }

      const breakStartTime = dayjs(`${sampleDate} ${salon.break_start_time}`);
      const breakEndTime = dayjs(`${sampleDate} ${salon.break_end_time}`);

      slotsTemp = slotsTemp.filter(
        (slot) =>
          !(
            dayjs(`${sampleDate} ${slot}`).isAfter(breakStartTime) &&
            dayjs(`${sampleDate} ${slot}`).isBefore(breakEndTime)
          )
      );
    }
    return slotsTemp;
  }, [JSON.stringify(salon)]);

  return (
    <div className="flex flex-col">
      <PageTitle title={`Schedule Appointment for ${salon?.name}`} />

      {loading && <Spinner parentHeight={120} />}

      {salon && (
        <div className="grid grid-cols-3 gap-10 mt-7">
          <div className="flex flex-col gap-2 p-5 border border-gray-400 rounded col-span-2">
            {renderProperty("Address", salon?.address)}
            {renderProperty("City", salon?.city)}
            {renderProperty("State", salon?.state)}
            {renderProperty("Zip", salon?.zip)}
            {renderProperty(
              "Minimum Service Price",
              `$${salon?.minimum_service_price}`
            )}
            {renderProperty(
              "Maximum Service Price",
              `$${salon?.maximum_service_price}`
            )}
            {renderProperty("Offer Status", salon?.offer_status)}
          </div>

          <div className="flex flex-col gap-5 p-5 border border-gray-400 rounded">
            <div>
              <h1 className="text-sm">Select Date</h1>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={dayjs().format("YYYY-MM-DD")}
              />
            </div>

            <div>
              <h1 className="text-sm">Select Time</h1>
              <select
                className="border border-gray-300 rounded p-2  text-sm w-full"
                onChange={(e) => setStartTime(e.target.value)}
              >
                <option value="">Select Start Time</option>
                {slots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-5">
              <Button variant={"default"} onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                disabled={bookingAppointment || !date || !startTime}
                onClick={bookAppointmentHandler}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SecheduleAppointmentCheckout;
