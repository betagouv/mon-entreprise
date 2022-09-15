export function SearchIcon({ ...props }) {
	return (
		<svg
			width={24}
			height={24}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M10.25 6a4.25 4.25 0 100 8.5 4.25 4.25 0 000-8.5zM4 10.25a6.25 6.25 0 1112.5 0 6.25 6.25 0 01-12.5 0z"
				fill="#212529"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M18.293 19.707l-5.056-5.056 1.414-1.414 5.056 5.056a1 1 0 01-1.414 1.414z"
				fill="#212529"
			/>
		</svg>
	)
}
