"use client";
import {
  getAppointmentsByUser,
  updateAppointmentStatus,
} from "@/actions/appointments";
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
import { appointmentStatuses } from "@/constants";

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

  const handleStatusChange = async (appointmentId: string, status: string) => {
    try {
      const response: any = await updateAppointmentStatus({
        id: appointmentId,
        status,
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      const updatedAppointments: any = appointments.map((appointment) => {
        if (appointment.id === appointmentId) {
          return {
            ...appointment,
            status,
          };
        }
        return appointment;
      });
      setAppointments(updatedAppointments);
    } catch (error) {
      toast.error("Failed to update appointment status");
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
                  <select
                    onChange={(e) =>
                      handleStatusChange(appointment.id, e.target.value)
                    }
                    value={appointment.status}
                    className="border border-gray-400 rounded px-2 py-1 text-sm"
                    disabled={appointment.status === "cancelled" || appointment.status === "completed"}
                  >
                    {appointmentStatuses.map((status, index) => (
                      <option key={index} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
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
