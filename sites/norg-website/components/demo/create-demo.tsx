"use client"

import { useState } from "react"
import { useAlert } from "@/hooks/useAlert"
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons"
import { TooltipArrow } from "@radix-ui/react-tooltip"

import { Button } from "@/ui-base/components/ui/button"
import { Input } from "@/ui-base/components/ui/input"
import { Label } from "@/ui-base/components/ui/label"
import { Progress } from "@/ui-base/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui-base/components/ui/tooltip"
import { fakeProgress } from "@/ui-base/lib/util/fakeDemoAPI"
import {
  CloudIcon,
  CodeIcon,
  GlobeIcon,
  SlidersVerticalIcon,
  SmileIcon,
  UserIcon,
} from "../Icon"

const icons = {
  account: <UserIcon className="h-8 w-8 text-primary" />,
  crawl: <GlobeIcon className="h-8 w-8 text-primary" />,
  topics: <SlidersVerticalIcon className="h-8 w-8 text-primary" />,
  prompt: <CodeIcon className="h-8 w-8 text-primary" />,
  avatar: <SmileIcon className="h-8 w-8 text-primary" />,
  deploy: <CloudIcon className="h-8 w-8 text-primary" />,
  link: <UserIcon className="h-8 w-8 text-primary" />,
}

function DemoCreateComponent() {
  const [started, setStarted] = useState(false)
  const [domain, setDomain] = useState("")
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  const alert = useAlert()

  const [status, setStatus] = useState({
    account: { progress: 0, status: "pending", message: "" },
    crawl: { progress: 0, status: "pending", message: "" },
    topics: { progress: 0, status: "pending", message: "" },
    prompt: { progress: 0, status: "pending", message: "" },
    avatar: { progress: 0, status: "pending", message: "" },
    deploy: { progress: 0, status: "pending", message: "" },
    link: { url: "", progress: 0, status: "pending", message: "" },
  })

  function mockGenerate() {
    if (!domain) {
      alert.error("Please enter a domain")
      setDomain("")
      return
    }
    // validate domain format
    const domainRegex =
      /^(https?:\/\/)?([\w\d]+\.)?[\w\d]+\.[\w\d]+(\/[\w\d]+)*\/?$/
    if (!domainRegex.test(domain)) {
      alert.error("Please enter a valid domain")
      setDomain("")
      return
    }

    setStatus({
      account: { progress: 0, status: "pending", message: "" },
      crawl: { progress: 0, status: "pending", message: "" },
      topics: { progress: 0, status: "pending", message: "" },
      prompt: { progress: 0, status: "pending", message: "" },
      avatar: { progress: 0, status: "pending", message: "" },
      deploy: { progress: 0, status: "pending", message: "" },
      link: { url: "", progress: 0, status: "pending", message: "" },
    })
    setEmail("")
    setEmailSent(false)
    setStarted(true)
    fakeProgress("account", setStatus)
  }

  const wasSuccessful =
    Object.values(status)?.length &&
    Object.values(status).every((task) => task.status === "success")

  const currentProgress =
    Object.values(status).reduce((acc, task) => acc + task.progress, 0) /
    Object.keys(status).length

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 md:px-6 md:py-16">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Generate Your AI Assistant
          </h2>
          <p className="text-muted-foreground mx-auto max-w-[600px] md:text-xl">
            Enter your domain and we&apos;ll create a custom AI assistant for
            you.
          </p>
        </div>
        <div className="bg-background space-y-8 rounded-lg p-6 sm:p-8">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="domain">Your Domain</Label>
              <Input
                id="domain"
                type="text"
                placeholder="Enter your domain"
                className="mt-1"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>

            <Button
              size="lg"
              variant="default"
              color="primary"
              onClick={mockGenerate}
            >
              Generate
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {started &&
              Object.keys(status).map((key) => {
                if (!status[key]) return null
                if (key === "link") return null
                return (
                  <TooltipProvider key={key}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`relative flex flex-col items-center justify-center space-y-2 rounded-lg border border-white/10 p-4 transition-all duration-500`}
                        >
                          <div className="flex items-center justify-center">
                            {icons[key]}
                            {status[key].error ? (
                              <CrossCircledIcon className="absolute -right-4 -top-4 z-10 h-8 w-8 text-red-500" />
                            ) : status[key].progress === 100 ? (
                              <CheckCircledIcon className="absolute -right-4 -top-4 z-10 h-8 w-8 text-green-500" />
                            ) : null}
                          </div>
                          {status[key].progress ? (
                            <Progress
                              value={status[key].progress}
                              className="absolute inset-x-0 bottom-0 h-1 bg-white"
                              indicatorClassName={
                                status[key].error
                                  ? "bg-red-500"
                                  : "bg-green-500"
                              }
                            />
                          ) : null}
                          <p className="text-sm font-medium">
                            {status[key].message}
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="TooltipContent" sideOffset={5}>
                        Tooltip Content will go here
                        {Object.keys(status[key]).map((_key) => {
                          return (
                            <p>
                              {_key} : {status[key]?.[_key]}
                            </p>
                          )
                        })}
                        <TooltipArrow className="TooltipArrow" />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
          </div>
          {started ? (
            <div className="flex items-center gap-4">
              <Progress
                value={currentProgress}
                className="flex-1"
                indicatorClassName="bg-primary"
              />
              <span className="text-sm font-medium">
                {Math.round(currentProgress)}% Complete
              </span>
            </div>
          ) : null}
          {started && !wasSuccessful ? (
            <>
              <p className="text-sm font-medium text-primary">
                The process may take up to 30 minutes. We will send you an email
                with the link once it&apos;s done.
              </p>
              {emailSent ? (
                <p className="text-sm font-medium text-primary">
                  We&apos;ll sent you an email with the link. Please check your
                  inbox.
                </p>
              ) : (
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Label htmlFor="email">Your Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="mt-1"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    size="lg"
                    variant="default"
                    color="neutral"
                    onClick={() => {
                      setEmailSent(true)
                    }}
                  >
                    Get Link
                  </Button>
                </div>
              )}
            </>
          ) : null}

          {wasSuccessful ? (
            <div className="flex items-center gap-4">
              <p>Your Link is ready:</p>
              <a
                href={status.link.url}
                className="rounded-md bg-white/10 p-1 px-4 text-my-lighterIndigo"
              >
                {status.link.url}
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default DemoCreateComponent
