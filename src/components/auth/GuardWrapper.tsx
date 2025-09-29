"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectUser, selectIsLoggedIn } from "@/redux/selectors/authSelectors";
import Loading from "../ui/loading";

interface GuardWrapperProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function GuardWrapper({
  children,
  allowedRoles,
}: GuardWrapperProps) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "denied" | "allowed">(
    "checking"
  );

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
      setStatus("denied");
    } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace("/unauthorized");
      setStatus("denied");
    } else {
      setStatus("allowed");
    }
  }, [isLoggedIn, user, allowedRoles, router]);

  if (status === "checking") {
    return <Loading fullScreen />; 
  }

  if (status === "denied") {
    return null; 
  }

  return <>{children}</>;
}
