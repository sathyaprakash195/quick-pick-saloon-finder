"use client";
import { getAppointmentsByUser } from "@/actions/appointments";
import { IAppointment } from "@/interfaces";
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
import PageTitle from "@/components/page-title";
import Spinner from "@/components/spinner";
import Info from "@/components/info";

function UserAppointmentsPage() {
  const [appointments, setAppointments] = React.useState<IAppointment[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const { user } = usersGlobalStore() as IUsersStore;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await getAppointmentsByUser(user.id);
      if (!response.success) {
        throw new Error(response.message);
      }
      setAppointments(response.data);
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    "Salon Name",
    "Date",
    "Start Time",
    "End Time",
    "Status",
    "Actions",
  ];

  return (
    <div>
      <PageTitle title="My Appointments" />

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

export default UserAppointmentsPage;
