import { redirect } from "next/navigation";

export default function ReceptionistPage() {
  // Redirect to check-in page as main landing page
  redirect("/receptionist/check-in");
}
