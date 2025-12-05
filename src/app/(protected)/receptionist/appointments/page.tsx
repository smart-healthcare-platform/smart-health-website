"use client";

import { useEffect } from "react";

export default function AppointmentsPage() {
  useEffect(() => {
    // Redirect to check-in page (main page with integrated appointment features)
    window.location.href = "/receptionist/check-in";
  }, []);

  return null;
}
