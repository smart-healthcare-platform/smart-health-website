"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import {
  selectUser,
  selectIsLoggedIn,
  selectIsInitialized,
} from "@/redux/selectors/authSelectors";
import Loading from "../ui/loading";
import LoginRequiredDialog from "../ui/require-login-dialog";

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
  const pathname = usePathname();

  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [status, setStatus] = useState<"checking" | "allowed" | "denied">(
    "checking"
  );

  useEffect(() => {
    if (!isInitialized) return;

    if (!isLoggedIn) {
      setShowLoginDialog(true);
      setStatus("denied");
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      setStatus("denied");
      router.replace("/unauthorized");
      return;
    }

    setStatus("allowed");
  }, [isInitialized, isLoggedIn, user, allowedRoles, router]);

  if (!isInitialized || status === "checking") {
    return <Loading fullScreen />;
  }

  if (showLoginDialog) {
    return (
      <LoginRequiredDialog
        open={true}
        redirectPath={pathname}
        onClose={() => {
          setShowLoginDialog(false);
          router.push("/");
        }}
        onConfirm={() => {
          router.push(`/login?redirect=${pathname}`);
        }}
      />
    );
  }


  if (status === "denied") return null;

  return <>{children}</>;
}
