import { cn } from "@/lib/utils"
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk"
import { FC, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, User } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import EndCallButton from "./EndCallButton"
import Loader from "./Loader"

type CallLayoutType = "grid" | "speaker-left" | "speaker-right"

const CallLayout: FC<{ layout: CallLayoutType }> = ({ layout }) => {
  switch (layout) {
    case "grid":
      return <PaginatedGridLayout />
    case "speaker-left":
      return <SpeakerLayout participantsBarPosition={"right"} />
    case "speaker-right":
      return <SpeakerLayout participantsBarPosition={"left"} />
  }
}

const MeetingRoom = () => {
  const searchParams = useSearchParams()
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left")
  const [showParticipants, setShowParticipants] = useState(false)
  const isPersonalRoom = !!searchParams.get("personal")
  const { useCallCallingState } = useCallStateHooks()

  const callingState = useCallCallingState()

  const router = useRouter()

  if (callingState !== CallingState.JOINED) return <Loader />

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout layout={layout} />
        </div>
        <div
          className={cn("h-[calc(100vh-86px)] hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      <div className="fixed bottom-0 flex flex-wrap w-full items-center justify-center gap-5">
        <CallControls
          onLeave={() => {
            router.push("/")
          }}
        />

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {["grid", "speaker-left", "speaker-right"].map((item, idx) => (
              <div className="" key={idx}>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <CallStatsButton />

        <Button onClick={() => setShowParticipants(prev => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <User size={20} className="text-white" />
          </div>
        </Button>

        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  )
}
export default MeetingRoom
