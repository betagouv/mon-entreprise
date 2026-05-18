import React, { CSSProperties } from 'react'
import { css, styled } from 'styled-components'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Palette } from '@/types/styled'

import { Emoji } from '../emoji'
import { ReturnIcon } from '../icons'
import { getColorPalette } from '../theme'
import { ComponentType } from '../types'
import { StyledLink } from '../typography/link'
import { Body, SmallBody } from '../typography/paragraphs'
import { getIconFromType } from '../utils'

type MessageProps = {
	children: React.ReactNode
	icon?: boolean | React.ReactElement<typeof Emoji>
	border?: boolean
	type?: ComponentType
	mini?: boolean
	light?: boolean
	className?: string
	style?: CSSProperties
	role?: string
}

export function Message({
	type = 'primary',
	icon = false,
	mini = false,
	border = true,
	light = false,
	children,
	className,
	style,
	role = undefined,
}: MessageProps) {
	if (
		typeof children === 'string' ||
		(Array.isArray(children) &&
			children.length === 1 &&
			typeof children[0] === 'string')
	) {
		children = mini ? (
			<SmallBody>{children}</SmallBody>
		) : (
			<Body>{children}</Body>
		)
	}

	return (
		<ForceThemeProvider forceTheme="light">
			<StyledMessage
				className={className}
				style={style}
				$type={type}
				$border={border}
				$mini={mini}
				$light={light}
				aria-atomic
			>
				{icon && (
					<StyledIconWrapper $type={type}>
						{typeof icon !== 'boolean'
							? icon
							: getIconFromType(type) ?? <ReturnIcon />}
					</StyledIconWrapper>
				)}
				<Wrapper role={role}>{children}</Wrapper>
			</StyledMessage>
		</ForceThemeProvider>
	)
}

const StyledIconWrapper = styled.div<{
	$type: ComponentType
}>`
	display: flex;
	position: relative;
	top: ${({ theme }) => theme.spacings.xxs};
	width: ${({ theme }) => theme.spacings.xl};
	svg {
		fill: ${({ $type }) => getTextColor($type)};
	}
`

type StyledMessageProps = {
	$border: boolean
	$light: boolean
	$mini: boolean
	$type: ComponentType
}

const StyledMessage = styled.div<StyledMessageProps>`
	display: flex;
	position: relative;
	align-items: baseline;
	transition:
		color 0.3s ease,
		background-color 0.3s ease;
	${({ theme, $type, $border, $light, $mini }) => {
		return css`
			padding: ${$mini ? theme.spacings.xxs : '0px'}
				${theme.spacings[$mini ? 'md' : 'lg']};
			background-color: ${getBackgroundColor($type, $light)};
			border: ${$mini ? '1px' : '2px'} solid ${getBorderColor($type, $border)};
			border-radius: ${theme.box.borderRadius};
			margin-bottom: ${theme.spacings.md};

			&& h3,
			&& h4,
			&& h5,
			&& h6 {
				color: ${getTextColor($type)};
				background-color: inherit;
			}
			> * {
				margin: -${$mini ? theme.spacings.xs : 0} 0;
			}
			& p,
			& span,
			& li {
				color: ${({ theme }) => theme.colors.extended.grey[800]};
			}
			& ${StyledLink} {
				color: ${getTextColor($type)};
			}
		`
	}}
`

const Wrapper = styled.div`
	flex: 1;
`

Message.Wrapper = Wrapper

const getBackgroundColor = (type: ComponentType, light: boolean) => {
	const colorPalette = getColorPalette(type)

	return light ? 'rgba(255,255,255,0.75)' : colorPalette[100]
}

const getBorderColor = (type: ComponentType, border: boolean) => {
	const colorPalette = getColorPalette(type)

	return colorPalette[border ? 500 : 100]
}

const getTextColor = (type: ComponentType) => {
	const colorPalette = getColorPalette(type)

	return (colorPalette as Palette)[700] ?? colorPalette[600]
}
