import ScheduleAppointment from "@/app/(private)/user/schedule-appointment/page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function FindSalon() {
  return (
    <div>
      <div className="flex justify-between items-center bg-gray-200 p-5 px-20">
        <h1 className="text-xl font-bold cursor-pointer">
          <Link href="/" className="font-bold">Quick Pick</Link>
        </h1>

        <Button>
          <Link href="/login">Login</Link>
        </Button>
      </div>
      <div className="px-20 mt-5">
      <ScheduleAppointment
      fromPublicRoute
      />
      </div>
    </div>
  );
}

export default FindSalon;
