import {
	autoUpdate,
	flip,
	offset,
	shift,
	useFloating,
} from '@floating-ui/react-dom'
import { CSSProperties, ReactNode, useId, useState } from 'react'
import { styled } from 'styled-components'

import { useDelayedExit } from '@/hooks/useDelayedExit'
import { useOnKeyDown } from '@/hooks/useOnKeyDown'

export const Tooltip = ({
	children,
	tooltip,
	className,
	style,
}: {
	children: ReactNode
	tooltip: ReactNode
	className?: string
	style?: CSSProperties
}) => {
	const [isHovered, setIsHovered] = useState(false)
	const [isFocused, setIsFocused] = useState(false)

	const isOpen = isHovered || isFocused
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
		setIsHovered(false)
		setIsFocused(false)
	})

	const { handleExit, handleEnter } = useDelayedExit({
		onEnter: () => setIsFocused(true),
		onExit: () => setIsFocused(false),
		delay: 1000,
	})

	const id = useId()

	return (
		<>
			<StyledButtonAsText
				className={className}
				style={style}
				ref={refs.setReference}
				onMouseEnter={handleEnter}
				onMouseLeave={handleExit}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
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
					onMouseEnter={handleEnter}
					onMouseLeave={handleExit}
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
	font-size: 80%;
	font-family: ${({ theme }) => theme.fonts.main};
	background: ${({ theme }) => theme.colors.extended.grey[800]};
	padding: ${({ theme }) => `${theme.spacings.xs} ${theme.spacings.sm}`};
	border: 1px solid
		${({ theme }) =>
			theme.darkMode ? theme.colors.extended.dark[500] : 'transparent'};
	color: ${({ theme }) => theme.colors.extended.grey[100]};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	z-index: 100;
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
