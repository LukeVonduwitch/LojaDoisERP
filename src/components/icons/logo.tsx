import type { SVGProps } from 'react';

export function VestuarioLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      aria-label="Vestuario ERP Logo"
      {...props}
    >
      <text
        x="10"
        y="35"
        fontFamily="'PT Sans', sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="hsl(var(--primary))"
      >
        Vestuario
      </text>
      <text
        x="135"
        y="35"
        fontFamily="'PT Sans', sans-serif"
        fontSize="28"
        fontWeight="normal"
        fill="hsl(var(--foreground))"
      >
        ERP
      </text>
    </svg>
  );
}
