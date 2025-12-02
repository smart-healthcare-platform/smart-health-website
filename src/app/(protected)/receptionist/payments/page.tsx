"use client";

import { useEffect } from "react";

export default function PaymentsPage() {
  useEffect(() => {
    // Redirect to check-in page (main page with integrated payment features)
    window.location.href = "/receptionist/check-in";
  }, []);

  return null;
}
