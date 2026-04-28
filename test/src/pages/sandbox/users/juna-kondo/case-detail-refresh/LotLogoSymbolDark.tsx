import { forwardRef, type SVGProps } from "react";

/**
 * LOT logo symbol dark (22×24). For use as LegalOn icon in Slack message card.
 */
export const LotLogoSymbolDark = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => (
  <svg
    ref={ref}
    width="22"
    height="24"
    viewBox="0 0 22 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    {...props}
  >
    <title>LOT logo</title>
    <g clipPath="url(#lot-symbol-dark-clip0)">
      <g clipPath="url(#lot-symbol-dark-clip1)">
        <path
          d="M21.3192 17.5386L11.7266 12L14.9241 10.1546L18.1216 12V8.30664L21.3192 6.4613V17.5386Z"
          fill="#8C8C8C"
        />
        <path
          d="M11.1934 23.9999V12.9226L14.3909 14.7679V18.4613L17.5884 16.6133L20.786 18.4613L11.1934 23.9999Z"
          fill="#191919"
        />
        <path
          d="M0.535156 18.4613L10.1278 12.9226V16.6133L6.93023 18.4613L10.1278 20.3066V23.9999L0.535156 18.4613Z"
          fill="#8C8C8C"
        />
        <path
          d="M20.786 5.53867L11.1934 11.0773V7.384L14.3909 5.53867L11.1934 3.69333V0L20.786 5.53867Z"
          fill="#191919"
        />
        <path
          d="M0.00195312 6.4613L9.59456 12L6.39703 13.8453L3.19949 12V15.6906L0.00195312 17.5386V6.4613Z"
          fill="#191919"
        />
        <path d="M10.1278 0V11.0773L6.93023 9.22933V5.53867L3.73269 7.384L0.535156 5.53867L10.1278 0Z" fill="#8C8C8C" />
      </g>
    </g>
    <defs>
      <clipPath id="lot-symbol-dark-clip0">
        <rect width="21.32" height="24" fill="white" />
      </clipPath>
      <clipPath id="lot-symbol-dark-clip1">
        <rect width="21.3169" height="24" fill="white" transform="translate(0.00195312)" />
      </clipPath>
    </defs>
  </svg>
));
LotLogoSymbolDark.displayName = "LotLogoSymbolDark";
