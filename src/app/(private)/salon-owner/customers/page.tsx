"use client";
import { getUniqueCustomersOfAnOwner } from "@/actions/appointments";
import PageTitle from "@/components/page-title";
import { IUsersStore, usersGlobalStore } from "@/store/users-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import Spinner from "@/components/spinner";
import Info from "@/components/info";
import { IUser } from "@/interfaces";

function CustomersPage() {
  const [customers, setCustomers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { user }: IUsersStore = usersGlobalStore() as IUsersStore;

  const getData = async () => {
    try {
      setLoading(true);
      const response: any = await getUniqueCustomersOfAnOwner(user?.id!);
      if (response.success) {
        setCustomers(response.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if(user) {
      getData();
    }
  }, [user]);

  const columns = ["Id", "Name", "Email"];
  return (
    <div>
      <PageTitle title="Customers" />

      {loading && <Spinner />}

      {!loading && customers.length === 0 && (
        <Info message="No customers found" />
      )}

      {!loading && customers.length > 0 && (
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
            {customers.map((customer: IUser, index) => (
              <TableRow key={index}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default CustomersPage;
