import {
	autoUpdate,
	flip,
	offset,
	shift,
	useFloating,
} from '@floating-ui/react-dom'
import { ReactNode, useId, useState } from 'react'
import { styled } from 'styled-components'

import { useOnKeyDown } from '@/hooks/useOnKeyDown'

export const Tooltip = ({
	children,
	tooltip,
	className,
}: {
	children: ReactNode
	tooltip: ReactNode
	className?: string
}) => {
	const [isOpen, setIsOpen] = useState(false)

	const { x, y, strategy, refs } = useFloating<HTMLButtonElement>({
		open: isOpen,
		placement: 'top',
		// Make sure the tooltip stays on the screen
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(5),
			flip({
				fallbackAxisSideDirection: 'start',
			}),
			shift(),
		],
	})

	useOnKeyDown('Escape', () => {
		setIsOpen(false)
	})

	const id = useId()

	return (
		<>
			<StyledButtonAsText
				className={className}
				ref={refs.setReference}
				onMouseEnter={() => setIsOpen(true)}
				onMouseLeave={() => setIsOpen(false)}
				onFocus={() => setIsOpen(true)}
				onBlur={() => setIsOpen(false)}
				aria-describedby={id}
			>
				{children}
			</StyledButtonAsText>
			{isOpen && (
				<StyledTooltip
					className={className}
					id={id}
					ref={refs.setFloating}
					role="tooltip"
					style={{
						position: strategy,
						top: y ?? 0,
						left: x ?? 0,
						width: 'max-content',
					}}
				>
					{tooltip}
				</StyledTooltip>
			)}
		</>
	)
}

const StyledTooltip = styled.span`
	max-width: 20rem;

	opacity: 1 !important;
	font-family: ${({ theme }) => theme.fonts.main};
	font-size: ${({ theme }) => theme.fontSizes.min};
	line-height: ${({ theme }) => theme.lineHeights.sm};
	background: ${({ theme }) => theme.colors.extended.grey[800]};
	padding: ${({ theme }) => `${theme.spacings.xs} ${theme.spacings.sm}`};
	border: 1px solid
		${({ theme }) =>
			theme.darkMode ? theme.colors.extended.dark[500] : 'transparent'};
	color: ${({ theme }) => theme.colors.extended.grey[100]};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	z-index: 100;
	pointer-events: none;
	* {
		color: ${({ theme }) => theme.colors.extended.grey[100]};
	}
`

const StyledButtonAsText = styled.button`
	background: none;
	border: none;
	cursor: unset;
	padding: 0;
	font-size: inherit;
	color: inherit;
`
