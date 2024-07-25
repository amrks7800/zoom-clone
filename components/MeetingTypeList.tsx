"use client"

import { useState } from "react"
import HomeCard from "./HomeCard"
import { useRouter } from "next/navigation"
import MeetingModal from "./MeetingModal"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useUser } from "@clerk/nextjs"
import { useToast } from "./ui/use-toast"
import { Textarea } from "./ui/textarea"
import DatePicker from "react-datepicker"
import { Input } from "./ui/input"

const MeetingTypeList = () => {
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isInstantMeeting" | "isJoiningMeeting"
  >()

  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  })

  const [callDetail, setCallDetail] = useState<Call>()

  const router = useRouter()

  const { user } = useUser()

  const client = useStreamVideoClient()
  const { toast } = useToast()

  const createMeeting = async () => {
    if (!client || !user) return

    try {
      if (!values.dateTime) {
        toast({ title: "Please select a date and time" })
        return
      }

      const id = crypto.randomUUID()

      const call = client.call("default", id)

      if (!call) throw new Error("Failed to create meeting")

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString()

      const description = values.description || "Instant Meeting"

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      })

      setCallDetail(call)
      if (!values.description) {
        router.push(`/meeting/${call.id}`)
      }
      toast({
        title: "Meeting Created",
      })
    } catch (error) {
      console.error(error)
      toast({ title: "Failed to create Meeting" })
    }
  }

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState("isInstantMeeting")}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        className="bg-blue-1"
        handleClick={() => setMeetingState("isJoiningMeeting")}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        className="bg-purple-1"
        handleClick={() => setMeetingState("isScheduleMeeting")}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        className="bg-yellow-1"
        handleClick={() => router.push("/recordings")}
      />

      {!callDetail ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label
              htmlFor="desc"
              className="text-base font-normal leading-[22px] text-sky-2"
            >
              Add a description
            </label>
            <Textarea
              id="desc"
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={e => {
                setValues({ ...values, description: e.target.value })
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label
              htmlFor="datetime"
              className="text-base font-normal leading-[22px] text-sky-2"
            >
              Select date and time
            </label>
            <DatePicker
              id="datetime"
              selected={values.dateTime}
              onChange={date => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat={"MMMM d, yyyy h:mm aa"}
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
              popperClassName="bg-dark-3"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          className="text-center"
          buttonText="Copy Meeting link"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink)

            toast({ title: "Meeting link copied to clipboard" })
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
        />
      )}

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start An Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Type the Link"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="meeting link"
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={e => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  )
}
export default MeetingTypeList
