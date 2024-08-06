import Image from "next/image"

import { cn } from "@/ui-base/lib/util/utils"

interface TestimonialProps {
  data: {
    authorName: string
    testimonialMessage: string
    testimonialTimestamp: string
    testimonialAvatar: {
      url: string
    }
  }
  isSender?: boolean
  autorClassName?: string
  messageClassName?: string
  timestampClassName?: string
  className?: string
}

const Testimonial = ({
  data,
  isSender = false,
  className = "",
  autorClassName = "",
  messageClassName = "",
  timestampClassName = "",
}: TestimonialProps) => {
  return (
    <div
      className={cn(
        "!inline-flex items-start gap-2.5 text-sm",
        {
          "flex-row-reverse": isSender,
        },
        className
      )}
    >
      <div className="flex flex-1 flex-col gap-1">
        <div
          className={cn(
            "flex gap-2 self-end whitespace-nowrap pl-5 pr-0 leading-[150%]",
            {
              "self-start pl-0 pr-5": isSender,
            }
          )}
        >
          <span
            className={cn(
              "grow font-semibold leading-[21px] sm:text-body3",
              autorClassName
            )}
          >
            {data?.authorName}
          </span>
          <span
            className={cn(
              "font-400 leading-[21px] sm:text-body3",
              timestampClassName
            )}
          >
            {data?.testimonialTimestamp}
          </span>
        </div>
        <div
          className={cn(
            "justify-center rounded-[20px] rounded-tr-none bg-my-white2 p-4 text-[12px] font-400 leading-[18px] text-my-black-33 sm:text-body3 sm:leading-[21px]",
            {
              "bg-[#9479FA] text-white rounded-[20px] rounded-tl-none sm:!text-[16px] sm:leading-[24px]":
                isSender,
            },
            messageClassName
          )}
          dangerouslySetInnerHTML={{
            __html: data?.testimonialMessage,
          }}
        />
      </div>
      <Image
        src={data?.testimonialAvatar?.url}
        alt={`Avatar of ${data?.authorName}`}
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded-full"
      />
    </div>
  )
}

export default Testimonial
