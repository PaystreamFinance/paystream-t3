import { LucideProps } from "lucide-react";

export const Icons = {
  info: (props: LucideProps) => (
    <svg
      {...props}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.8334 7.00033C12.8334 10.222 10.2217 12.8337 7.00008 12.8337C3.77842 12.8337 1.16675 10.222 1.16675 7.00033C1.16675 3.77866 3.77842 1.16699 7.00008 1.16699C10.2217 1.16699 12.8334 3.77866 12.8334 7.00033ZM6.41675 5.25033V4.08366H7.58341V5.25033H6.41675ZM6.41675 9.91699V6.41699H7.58341V9.91699H6.41675Z"
        fill="currentColor"
      />
    </svg>
  ),
  clock: (props: LucideProps) => (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 8V12L15 15M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  success: (props: LucideProps) => (
    <svg
      {...props}
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="25" cy="25" r="25" fill="#0AA658" />
      <path
        d="M17.5 25.5L22 30L32.5 20"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  arrowUpRight: (props: LucideProps) => (
    <svg
      {...props}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.25 12.75L12 6ZM12 6L6 6.00001ZM12 6V12Z"
        fill="currentColor"
      />
      <path
        d="M5.25 12.75L12 6M12 6L6 6.00001M12 6V12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  check: (props: LucideProps) => (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.75 11.9999L10.58 14.8299L16.25 9.16992"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  mail: (props: LucideProps) => (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1_3545)">
        <path
          d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
          fill="#9CE0FF"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_3545">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  twitter: (props: LucideProps) => (
    <svg
      {...props}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 3L9.8553 7.73684M3.50004 15L7.92109 9.94737M9.8553 7.73684L6.97829 3.67517C6.80317 3.42795 6.71562 3.30434 6.60245 3.21503C6.50225 3.13594 6.38783 3.07678 6.26537 3.04072C6.12708 3 5.9756 3 5.67265 3H4.54707C4.04686 3 3.79675 3 3.66191 3.10382C3.5445 3.19422 3.47323 3.33203 3.46733 3.48009C3.46055 3.65014 3.60512 3.85423 3.89425 4.26241L7.92109 9.94737M9.8553 7.73684L14.1058 13.7376C14.395 14.1458 14.5395 14.3499 14.5327 14.5199C14.5268 14.668 14.4556 14.8058 14.3382 14.8962C14.2033 15 13.9532 15 13.453 15H12.3274C12.0245 15 11.873 15 11.7347 14.9593C11.6123 14.9232 11.4978 14.8641 11.3976 14.785C11.2845 14.6957 11.1969 14.572 11.0218 14.3248L7.92109 9.94737"
        stroke="#9CE0FF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};
