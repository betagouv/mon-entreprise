import { HTMLAttributes } from 'react'

export const CarretDown = (props: HTMLAttributes<SVGElement>) => (
	<svg
		{...props}
		width="14"
		height="8"
		viewBox="0 0 14 8"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
		role="img"
		aria-hidden
	>
		<path d="M7.70701 7.29289L13.2928 1.70711C13.9228 1.07714 13.4766 0 12.5857 0H1.41412C0.523211 0 0.0770421 1.07714 0.707007 1.70711L6.2928 7.29289C6.68332 7.68342 7.31648 7.68342 7.70701 7.29289Z" />
	</svg>
)
