import { FC, ReactNode } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

type MeetingModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  className?: string
  buttonText?: string
  handleClick?: () => void
  children?: ReactNode
  image?: string
  buttonIcon?: string
}

const MeetingModal: FC<MeetingModalProps> = ({
  buttonText,
  className,
  handleClick,
  isOpen,
  onClose,
  title,
  children,
  image,
  buttonIcon,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white">
        <div className="flex flex-col gap-6">
          {image && (
            <div className="flex justify-center">
              <Image src={image} alt="" width={72} height={72} />
            </div>
          )}
          <h1 className={cn("text-3xl font-bold leading-[42px]")}>{title}</h1>
          {children}
          <Button
            className="bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0 flex items-center gap-1"
            onClick={handleClick}
          >
            {buttonIcon && (
              <Image src={buttonIcon} alt="" height={20} width={20} />
            )}{" "}
            <span>{buttonText || "Schedule Meeting"}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default MeetingModal
