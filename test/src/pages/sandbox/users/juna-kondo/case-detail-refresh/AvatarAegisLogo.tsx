import { forwardRef, type SVGProps } from "react";

/**
 * Avatar-Aegis logo (24×24). For use as Logo source in Slack message card.
 */
export const AvatarAegisLogo = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => (
  <svg
    ref={ref}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    {...props}
  >
    <title>Aegis logo</title>
    <g clipPath="url(#avatar-aegis-clip0)">
      <g clipPath="url(#avatar-aegis-clip1)">
        <path d="M22.659 17.5386L13.0664 12L16.2639 10.1546L19.4615 12V8.30664L22.659 6.4613V17.5386Z" fill="#8C8C8C" />
        <path
          d="M12.5332 24V12.9227L15.7307 14.768V18.4613L18.9283 16.6133L22.1258 18.4613L12.5332 24Z"
          fill="#191919"
        />
        <path
          d="M1.875 18.4613L11.4676 12.9227V16.6133L8.27007 18.4613L11.4676 20.3067V24L1.875 18.4613Z"
          fill="#8C8C8C"
        />
        <path
          d="M22.1258 5.53867L12.5332 11.0773V7.384L15.7307 5.53867L12.5332 3.69333V0L22.1258 5.53867Z"
          fill="#191919"
        />
        <path d="M1.3418 6.4613L10.9344 12L7.73687 13.8453L4.53933 12V15.6906L1.3418 17.5386V6.4613Z" fill="#191919" />
        <path d="M11.4676 0V11.0773L8.27007 9.22933V5.53867L5.07254 7.384L1.875 5.53867L11.4676 0Z" fill="#8C8C8C" />
      </g>
    </g>
    <defs>
      <clipPath id="avatar-aegis-clip0">
        <rect width="21.32" height="24" fill="white" transform="translate(1.33984)" />
      </clipPath>
      <clipPath id="avatar-aegis-clip1">
        <rect width="21.3169" height="24" fill="white" transform="translate(1.3418)" />
      </clipPath>
    </defs>
  </svg>
));
AvatarAegisLogo.displayName = "AvatarAegisLogo";
