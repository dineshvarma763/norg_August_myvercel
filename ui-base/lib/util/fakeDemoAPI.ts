export const fakeProgress = (
  task: string,
  setStatus: React.Dispatch<React.SetStateAction<any>>
) => {
  const tasks = {
    account: {
      steps: [
        { progress: 10, delay: 1000 },
        { progress: 50, delay: 2000 },
        { progress: 70, delay: 3000 },
        {
          progress: 100,
          delay: 4000,
          status: "success",
          message: "Account Created",
        },
      ],
      nextTask: "crawl",
    },
    crawl: {
      steps: [
        { progress: 10, delay: 1000},
        { progress: 50, delay: 10000 },
        { progress: 70, delay: 20000 },
        {
          progress: 100,
          delay: 30000,
          status: "success",
          message: "Website Crawled",
        },
      ],
      nextTask: "topics",
    },
    topics: {
      steps: [
        { progress: 10, delay: 1000 },
        { progress: 50, delay: 2000 },
        { progress: 70, delay: 3000 },
        {
          progress: 100,
          delay: 5000,
          status: "success",
          message: "Topics Generated",
        },
      ],
      nextTask: "prompt",
    },
    prompt: {
      steps: [
        { progress: 10, delay: 1000 },
        { progress: 50, delay: 2000 },
        { progress: 70, delay: 3000 },
        {
          progress: 100,
          delay: 5000,
          status: "success",
          message: "Prompt Created",
        },
      ],
      nextTask: "avatar",
    },
    avatar: {
      steps: [
        { progress: 10, delay: 1000 },
        { progress: 50, delay: 2000 },
        { progress: 70, delay: 3000 },
        {
          progress: 100,
          delay: 5000,
          status: "success",
          message: "Avatar Generated",
        },
      ],
      nextTask: "deploy",
    },
    deploy: {
      steps: [
        { progress: 10, delay: 1000 },
        { progress: 50, delay: 2000 },
        { progress: 70, delay: 3000 },
        {
          progress: 100,
          delay: 5000,
          status: "success",
          message: "Page Deployed",
        },
      ],
      nextTask: "link",
    },
    link: {
      steps: [
        {
          url: `https://norg.com/${Math.random().toString(36).substring(7)}`,
          progress: 100,
          delay: 1000,
          status: "success",
          message: "Link Generated",
        },
      ],
      nextTask: "",
    },
  }

  const processTask = (task: string) => {
    const { steps, nextTask } = tasks[task]
    steps.forEach((step, index) => {
      let tempStepWithoutDelay = { ...step }
      delete tempStepWithoutDelay.delay
      setTimeout(() => {
        setStatus((prev: any) => ({
          ...prev,
          [task]: {
            ...(prev[task] || {}),
            ...tempStepWithoutDelay,
          },
        }))
        if (index === steps.length - 1 && nextTask) {
          fakeProgress(nextTask, setStatus)
        }
      }, step.delay)
    })
  }

  processTask(task)
}
