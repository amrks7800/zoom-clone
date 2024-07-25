import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk"
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { Button } from "./ui/button"

type MeetingSetupProps = {
  setIsSetupComplete: Dispatch<SetStateAction<boolean>>
}

const MeetingSetup: FC<MeetingSetupProps> = ({ setIsSetupComplete }) => {
  const [isMicCamOn, setIsMicCamOn] = useState(false)

  const call = useCall()

  if (!call)
    throw new Error("useCall must be called inside StreamCall component")

  useEffect(() => {
    if (isMicCamOn) {
      call?.camera.disable()
      call?.microphone.disable()
    } else {
      call?.camera.enable()
      call?.microphone.enable()
    }
  }, [isMicCamOn, call?.camera, call?.microphone])
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-60 items-center justify-center gap-3">
        <label
          htmlFor=""
          className="flex items-center justify-center gap-2 font-medium"
        >
          <input
            type="checkbox"
            name=""
            checked={isMicCamOn}
            onChange={e => {
              setIsMicCamOn(e.target.checked)
            }}
            id=""
          />
          Join With Mic & Camera off
        </label>

        <DeviceSettings />
      </div>

      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={() => {
          call?.join()
          setIsSetupComplete(true)
        }}
      >
        Join Meeting
      </Button>
    </div>
  )
}
export default MeetingSetup
