import { HTMLAttributes } from 'react'
import styled from 'styled-components'

export const SvgIcon = styled.svg`
	/* width: ${({ theme }) => theme.spacings.lg};
	height: ${({ theme }) => theme.spacings.lg}; */
	fill: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.bases.primary[800]};
`

export const ChevronIcon = (props: HTMLAttributes<SVGElement>) => (
	<SvgIcon
		{...props}
		viewBox="0 0 24 24"
		width={24}
		height={24}
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden
		role="img"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M7.24744 4.34151C7.61112 3.92587 8.24288 3.88375 8.65852 4.24744L16.6585 11.2474C16.8755 11.4373 17 11.7116 17 12C17 12.2884 16.8755 12.5627 16.6585 12.7526L8.65852 19.7526C8.24288 20.1163 7.61112 20.0742 7.24744 19.6585C6.88375 19.2429 6.92587 18.6111 7.34151 18.2474L14.4814 12L7.34151 5.75259C6.92587 5.38891 6.88375 4.75715 7.24744 4.34151Z"
		/>
	</SvgIcon>
)

export const InfoIcon = (props: HTMLAttributes<SVGElement>) => (
	<SvgIcon
		{...props}
		viewBox="0 0 20 20"
		width={20}
		height={20}
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden
		role="img"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM20 10C20 15.5229 15.5228 20 10 20C4.47715 20 -4.82823e-07 15.5228 0 10C4.82823e-07 4.47715 4.47715 -4.82823e-07 10 0C15.5229 4.82823e-07 20 4.47715 20 10Z"
		/>
		<path d="M9 6.00003C9 5.44774 9.44772 5.00003 10 5.00003C10.5523 5.00003 11 5.44774 11 6.00003C11 6.55231 10.5523 7.00003 10 7.00003C9.44772 7.00003 9 6.55231 9 6.00003Z" />
		<path d="M11 14.6C11 15.1523 10.5523 15.6 10 15.6C9.44772 15.6 9 15.1523 9 14.6L9 9.4C9 8.84772 9.44772 8.4 10 8.4C10.5523 8.4 11 8.84772 11 9.4L11 14.6Z" />
	</SvgIcon>
)

export const SuccessIcon = (props: HTMLAttributes<SVGElement>) => (
	<SvgIcon
		{...props}
		viewBox="0 0 20 20"
		width={20}
		height={20}
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden
		role="img"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M15.261 6.14683C15.6494 6.53952 15.6459 7.17268 15.2532 7.56103L9.13554 13.611C8.74443 13.9978 8.11438 13.9961 7.72538 13.6072L4.643 10.5258C4.25242 10.1354 4.25232 9.50219 4.64278 9.11161C5.03324 8.72102 5.66641 8.72092 6.05699 9.11138L8.43618 11.4898L13.8468 6.13897C14.2395 5.75063 14.8727 5.75415 15.261 6.14683Z"
		/>
	</SvgIcon>
)

export const CarretDownIcon = (props: HTMLAttributes<SVGElement>) => (
	<SvgIcon
		{...props}
		width="14"
		height="8"
		viewBox="0 0 14 8"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden
		role="img"
	>
		<path d="M7.70701 7.29289L13.2928 1.70711C13.9228 1.07714 13.4766 0 12.5857 0H1.41412C0.523211 0 0.0770421 1.07714 0.707007 1.70711L6.2928 7.29289C6.68332 7.68342 7.31648 7.68342 7.70701 7.29289Z" />
	</SvgIcon>
)

export function SearchIcon({ ...props }) {
	return (
		<SvgIcon
			{...props}
			width={24}
			height={24}
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden
			role="img"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M10.25 6a4.25 4.25 0 100 8.5 4.25 4.25 0 000-8.5zM4 10.25a6.25 6.25 0 1112.5 0 6.25 6.25 0 01-12.5 0z"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M18.293 19.707l-5.056-5.056 1.414-1.414 5.056 5.056a1 1 0 01-1.414 1.414z"
			/>
		</SvgIcon>
	)
}

export const ErrorIcon = (props: HTMLAttributes<SVGElement>) => (
	<SvgIcon
		{...props}
		width="20"
		height="19"
		viewBox="0 0 20 19"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden
		role="img"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M10 0C10.3704 0 10.7105 0.204749 10.8838 0.532112L19.8838 17.5321C20.0479 17.8421 20.0376 18.2153 19.8567 18.5158C19.6758 18.8163 19.3507 19 19 19H1C0.649283 19 0.324198 18.8163 0.143295 18.5158C-0.0376073 18.2153 -0.0478841 17.8421 0.116212 17.5321L9.11621 0.532112C9.28952 0.204749 9.62959 0 10 0ZM2.66091 17H17.3391L10 3.13727L2.66091 17Z"
		/>
		<path d="M11 14.5C11 15.0579 10.5579 15.5 10 15.5C9.44214 15.5 9 15.0579 9 14.5C9 13.9421 9.44214 13.5 10 13.5C10.5579 13.5 11 13.9421 11 14.5Z" />
		<path d="M8.99999 7.5C8.99999 6.94214 9.44212 6.5 9.99998 6.5C10.5578 6.5 11 6.94214 11 7.5V11C11 11.5579 10.5576 12 9.99969 12C9.44183 12 8.99999 11.5579 8.99999 11V7.5Z" />
	</SvgIcon>
)

export const ReturnIcon = (props: HTMLAttributes<SVGElement>) => (
	<SvgIcon
		{...props}
		width="16"
		height="13"
		viewBox="0 0 16 13"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden
		role="img"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M1 0C1.55228 0 2 0.447715 2 1V6.65C2 7.20228 2.44772 7.65 3 7.65H15C15.5523 7.65 16 8.09771 16 8.65C16 9.20228 15.5523 9.65 15 9.65H3C1.34314 9.65 0 8.30685 0 6.65V1C0 0.447715 0.447715 0 1 0Z"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M11.5407 4.69739C11.9564 4.33371 12.5881 4.37582 12.9518 4.79146L15.7518 7.99146C16.0817 8.36849 16.0817 8.93144 15.7518 9.30847L12.9518 12.5085C12.5881 12.9241 11.9564 12.9662 11.5407 12.6025C11.1251 12.2389 11.083 11.6071 11.4467 11.1915L13.6705 8.64997L11.4467 6.10847C11.083 5.69283 11.1251 5.06107 11.5407 4.69739Z"
		/>
	</SvgIcon>
)

export const EditIcon = (props: HTMLAttributes<SVGElement>) => (
	<svg
		{...props}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="#1D458C"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M17.6713 4.34045C17.1223 3.79142 16.1035 3.9201 15.3957 4.62786L14.0118 6.01178L17.9882 9.98822L19.3721 8.6043C20.0799 7.89653 20.2086 6.8777 19.6595 6.32867L17.6713 4.34045ZM16.4882 11.4882L12.5118 7.51178L5.26693 14.7566C4.94924 15.0743 4.73441 15.4722 4.66412 15.8732L4.00634 19.625C3.96438 19.8643 4.13568 20.0356 4.37496 19.9937L8.12685 19.3359C8.52777 19.2656 8.92567 19.0508 9.24336 18.7331L16.4882 11.4882Z"
		/>
	</svg>
)

export const HexagonIcon = (props: HTMLAttributes<SVGElement>) => (
	<svg
		{...props}
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="#1D458C"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M8 3L12.3301 5.5V10.5L8 13L3.66987 10.5V5.5L8 3Z" />
	</svg>
)

export const TriangleIcon = (props: HTMLAttributes<SVGElement>) => (
	<svg
		{...props}
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="#1D458C"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M8 3L13.1962 12H2.80385L8 3Z" />
	</svg>
)

export const CircleIcon = (props: HTMLAttributes<SVGElement>) => (
	<svg
		{...props}
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="#1D458C"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M8 3L8.52264 3.02739L9.03956 3.10926L9.54508 3.24472L10.0337 3.43227L10.5 3.66987L10.9389 3.95492L11.3457 4.28428L11.7157 4.65435L12.0451 5.06107L12.3301 5.5L12.5677 5.96632L12.7553 6.45492L12.8907 6.96044L12.9726 7.47736L13 8L12.9726 8.52264L12.8907 9.03956L12.7553 9.54508L12.5677 10.0337L12.3301 10.5L12.0451 10.9389L11.7157 11.3457L11.3457 11.7157L10.9389 12.0451L10.5 12.3301L10.0337 12.5677L9.54508 12.7553L9.03956 12.8907L8.52264 12.9726L8 13L7.47736 12.9726L6.96044 12.8907L6.45492 12.7553L5.96632 12.5677L5.5 12.3301L5.06107 12.0451L4.65435 11.7157L4.28428 11.3457L3.95492 10.9389L3.66987 10.5L3.43227 10.0337L3.24472 9.54508L3.10926 9.03956L3.02739 8.52264L3 8L3.02739 7.47736L3.10926 6.96044L3.24472 6.45492L3.43227 5.96632L3.66987 5.5L3.95492 5.06107L4.28428 4.65435L4.65435 4.28428L5.06107 3.95492L5.5 3.66987L5.96632 3.43227L6.45492 3.24472L6.96044 3.10926L7.47736 3.02739L8 3Z" />
	</svg>
)
