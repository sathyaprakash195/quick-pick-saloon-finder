"use client";
import { getAppointmentsOfSalonOwner } from "@/actions/appointments";
import { getSalonsByOwnerId } from "@/actions/salons";
import PageTitle from "@/components/page-title";
import Spinner from "@/components/spinner";
import { IAppointment, ISalon } from "@/interfaces";
import { IUsersStore, usersGlobalStore } from "@/store/users-store";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Info from "@/components/info";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function SalonOwnerAppointmentsPage() {
  const [appointments, setAppointments] = React.useState<IAppointment[]>([]);
  const [salons = [], setSalons] = React.useState<ISalon[]>([]);
  const [date = "", setDate] = React.useState<string>("");
  const [selectedSalon = "", setSelectedSalon] = React.useState<string>("");
  const [loading = true, setLoading] = React.useState<boolean>(true);
  const [filtersCleared = false, setFiltersCleared] = React.useState<boolean>(
    false
  );
  const { user } = usersGlobalStore() as IUsersStore;
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response: any = await getAppointmentsOfSalonOwner({
        salonIds: selectedSalon ? [selectedSalon] : salons.map((s) => s.id),
        date,
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      setAppointments(response.data);
      setFiltersCleared(false);
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const fetchSalons = async () => {
    try {
      setLoading(true);
      const response: any = await getSalonsByOwnerId(user.id);
      if (!response.success) {
        throw new Error(response.message);
      }
      setSalons(response.data);
    } catch (error) {
      toast.error("Failed to fetch salons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (salons.length > 0) {
      fetchAppointments();
    }
  }, [salons]);

  useEffect(() => {
    if (filtersCleared) {
      fetchAppointments();
    }
  }, [filtersCleared]);

  useEffect(() => {
    fetchSalons();
  }, []);

  const columns = [
    "Salon Name",
    "Customer",
    "Date",
    "Start Time",
    "End Time",
    "Status",
    "Actions",
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Appointments" />

      <div className="grid grid-cols-4 gap-5 items-end">
        <div className="flex gap-1 flex-col">
          <h1 className="text-sm">Select Salon</h1>
          <select
            value={selectedSalon}
            onChange={(e) => setSelectedSalon(e.target.value)}
            className="w-full p-[10px] border border-gray-500 rounded-lg text-sm"
          >
            <option value="">All</option>
            {salons.map((salon) => (
              <option key={salon.id} value={salon.id}
               className="text-sm"
              >
                {salon.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-sm">Select Date</h1>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <Button
            onClick={() => {
              setDate("");
              setSelectedSalon("");
              setFiltersCleared(true);
            }}
            variant={'outline'}
          >
            Clear Filters
          </Button>
          <Button onClick={fetchAppointments}>Apply Filter</Button>
        </div>
      </div>

      {loading && <Spinner />}

      {!loading && appointments.length === 0 && (
        <Info message="No appointments found" />
      )}

      {!loading && appointments.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              {columns.map((column, index) => (
                <TableHead key={index} className="font-bold">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment, index) => (
              <TableRow key={index}>
                <TableCell>{appointment.salon.name}</TableCell>
                <TableCell>{appointment.user.name}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.start_time}</TableCell>
                <TableCell>{appointment.end_time}</TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell>
                  <button className="text-red-800 underline capitalize cursor-pointer">
                    Cancel
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default SalonOwnerAppointmentsPage;
