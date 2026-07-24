type IconProps = {
  className?: string;
  size?: number;
};

const defaults = { size: 18 };

function Svg({ className, size, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      width={size ?? defaults.size}
      height={size ?? defaults.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconHome(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19v-8.5Z" />
      <path d="M9.5 20.5V13a2.5 2.5 0 0 1 5 0v7.5" />
    </Svg>
  );
}

export function IconCompanies(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 20.5V6.5l8-3 8 3v14" />
      <path d="M9 20.5v-7h6v7" />
      <path d="M9 10.5h6" />
    </Svg>
  );
}

export function IconQueue(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 6.5h12M8 12h12M8 17.5h12" />
      <path d="M4 6.5h.01M4 12h.01M4 17.5h.01" />
    </Svg>
  );
}

export function IconBrief(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 4.5h10v15H7z" />
      <path d="M9 8.5h6M9 12h6M9 15.5h4" />
    </Svg>
  );
}

export function IconSubmit(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function IconFeedback(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 6.5h14v9H9.5L5 19.5V6.5Z" />
    </Svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16.5 16.5 4 4" />
    </Svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 7h14M5 12h14M5 17h14" />
    </Svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m7 7 10 10M17 7 7 17" />
    </Svg>
  );
}

export function IconGlobe(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5a13 13 0 0 1 0 17M12 3.5a13 13 0 0 0 0 17" />
    </Svg>
  );
}

export function IconCareers(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 9.5V19a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19V9.5" />
      <path d="M8 9.5V7a4 4 0 0 1 8 0v2.5" />
    </Svg>
  );
}

export function IconEdit(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 18.5h3.5L18.5 8.5 15 5 5.5 14.5z" />
      <path d="M13.5 6.5 17.5 10.5" />
    </Svg>
  );
}

export function IconLinkedIn(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6.5 10v8.5M6.5 7v.01" />
      <path d="M10.5 18.5v-5a2.5 2.5 0 0 1 5 0v5" />
      <path d="M4.5 4.5h15v15h-15z" />
    </Svg>
  );
}

export function IconTwitter(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 7.5 17.5 16.5M17.5 7.5 6 16.5" />
    </Svg>
  );
}

export function IconLink(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M10.5 13.5a3.5 3.5 0 0 0 5 0l2-2a3.5 3.5 0 0 0-5-5l-1 1" />
      <path d="M13.5 10.5a3.5 3.5 0 0 0-5 0l-2 2a3.5 3.5 0 0 0 5 5l1-1" />
    </Svg>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8.5 11.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M4.5 18.5v-.5a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v.5" />
      <path d="M16.5 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M14.5 18.5v-.5a3.5 3.5 0 0 1 3-3.5" />
    </Svg>
  );
}

export function IconInfo(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 10.5v5.5M12 8v.01" />
    </Svg>
  );
}

export function IconTag(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12.5V6.5h6l8.5 8.5-6 6L5 12.5Z" />
      <circle cx="9.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconPackage(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 8.5 12 4.5l7.5 4v8L12 21l-7.5-4.5v-8Z" />
      <path d="M12 4.5v16.5M4.5 8.5 12 12.5l7.5-4" />
    </Svg>
  );
}

export function IconLayers(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 5 4.5 8.5 12 12l7.5-3.5L12 5Z" />
      <path d="m4.5 12 7.5 3.5L19.5 12" />
      <path d="m4.5 15.5 7.5 17 12 18.5l4.5-1.5 3-1.5" />
    </Svg>
  );
}

export function IconMapPin(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </Svg>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 12h12M6 12l4-4M6 12l4 4" />
    </Svg>
  );
}
