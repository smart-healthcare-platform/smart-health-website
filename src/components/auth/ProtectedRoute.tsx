"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react"; 

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { selectIsLoggedIn } from "@/redux/selectors/authSelectors";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsModalOpen(true);
    }
  }, [isLoggedIn]);

  const handleRedirectToLogin = () => {
    setIsModalOpen(false);
    router.push("/login");
  };

  if (!isLoggedIn) {
    return (
      <Dialog open={isModalOpen}>
        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="text-yellow-500" />
              Yêu cầu đăng nhập
            </DialogTitle>
            <DialogDescription>
              Bạn cần đăng nhập để có thể truy cập vào trang này. 
              Vui lòng đăng nhập để tiếp tục.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleRedirectToLogin} className="w-full">
              Đi đến trang đăng nhập
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return <>{children}</>;
}
