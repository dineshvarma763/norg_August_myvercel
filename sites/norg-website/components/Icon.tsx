interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const SearchIcon = (props: IconProps) => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.97 16.545a9.014 9.014 0 1 1 2.198-2.045l3.982 3.983-2.122 2.12-4.058-4.058Zm1.483-7.53a6.439 6.439 0 1 1-12.877 0 6.439 6.439 0 0 1 12.877 0Z"
      fill="#043176"
    />
  </svg>
)

export const HamburgerIcon = (props: IconProps) => (
  <svg
    width="22"
    height="16"
    viewBox="0 0 22 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22 0H0v4h22V0Zm0 6H0v4h22V6Zm0 6H0v4h22v-4Z"
      fill="currentColor"
    />
  </svg>
)

export const CloseIcon = (props: IconProps) => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15.556 0 0 15.556l2.828 2.829L18.385 2.828 15.556 0Z"
      fill="currentColor"
    />
    <path
      d="M18.384 15.556 2.829 0 0 2.828l15.556 15.557 2.829-2.829Z"
      fill="currentColor"
    />
  </svg>
)

export const ChatIcon = (props: IconProps) => (
  <svg
    width={46}
    height={46}
    viewBox="0 0 46 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx={23}
      cy={23}
      r={23}
      transform="rotate(-90 23 23)"
      fill="#FAA634"
    />
    <path
      d="M22.5 12C28.841 12 34 16.486 34 22c0 2.217-.855 4.373-2.419 6.124l2.288 2.874c.332.416-.022 1.002-.603 1.002H22.5C16.159 32 11 27.514 11 22s5.159-10 11.5-10Z"
      fill="#fff"
    />
  </svg>
)

export const BackToTop = (props: IconProps) => (
  <svg
    width={60}
    height={46}
    viewBox="0 0 60 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx={30}
      cy={23}
      r={23}
      transform="rotate(-90 30 23)"
      fill="#9479fa"
    />
    <text
      x={30}
      y={37}
      textAnchor="middle"
      fontSize={13}
      letterSpacing=".1em"
      fontWeight="bold"
      fill="#ffffff"
    >
      {"TOP"}
    </text>
    <path d="M41.642 19.821 29.822 8 18 19.821" stroke="#fff" strokeWidth={4} />
  </svg>
)

export function CloudIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  )
}

export function CodeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

export function GlobeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  )
}

export function SlidersVerticalIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="4" y1="21" y2="14" />
      <line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" />
      <line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" />
      <line x1="20" x2="20" y1="12" y2="3" />
      <line x1="2" x2="6" y1="14" y2="14" />
      <line x1="10" x2="14" y1="8" y2="8" />
      <line x1="18" x2="22" y1="16" y2="16" />
    </svg>
  )
}

export function SmileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  )
}

export function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
