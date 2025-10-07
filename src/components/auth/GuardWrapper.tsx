"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  selectUser,
  selectIsLoggedIn,
  selectIsInitialized,
} from "@/redux/selectors/authSelectors";
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
  const isInitialized = useSelector(selectIsInitialized);
  const router = useRouter();

  const [status, setStatus] = useState<"checking" | "allowed" | "denied">(
    "checking"
  );

  useEffect(() => {
    console.log("Redux: ", isInitialized)
    console.log("Is loggin: ", isLoggedIn)
    if (!isInitialized) return;

    if (!isLoggedIn) {
      setStatus("denied");
      router.replace("/login");
    } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      setStatus("denied");
      router.replace("/unauthorized");
    } else {
      setStatus("allowed");
    }
  }, [isInitialized, isLoggedIn, user, allowedRoles, router]);

  if (!isInitialized || status === "checking") {
    return <Loading fullScreen />;
  }

  if (status === "denied") return null;

  return <>{children}</>;
}
