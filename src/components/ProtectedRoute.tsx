"use client"
import * as Dialog from "@radix-ui/react-dialog" // Shadcn modal base
import { useSelector } from "react-redux"
import { selectIsLoggedIn } from "@/redux/selectors/authSelectors"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) setOpen(true)
  }, [isLoggedIn])

  const handleOk = () => {
    setOpen(false)
    router.push("/login")
  }

  if (!isLoggedIn) {
    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Vui lòng đăng nhập để tiếp tục
          </Dialog.Title>
          <Button onClick={handleOk} className="bg-emerald-500 w-full">
            OK
          </Button>
        </Dialog.Content>
      </Dialog.Root>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
