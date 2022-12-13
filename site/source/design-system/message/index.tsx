import React from 'react'
import styled, { DefaultTheme, ThemeProvider, css } from 'styled-components'

import Emoji from '@/components/utils/Emoji'
import { Palette, SmallPalette } from '@/types/styled'

import { ErrorIcon, InfoIcon, ReturnIcon, SuccessIcon } from '../icons'
import { Body } from '../typography/paragraphs'

export type MessageType = 'primary' | 'secondary' | 'info' | 'error' | 'success'
type MessageProps = {
	children: React.ReactNode
	icon?: boolean | string
	border?: boolean
	type?: MessageType
	mini?: boolean
	light?: boolean
	className?: string
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
	role = undefined,
}: MessageProps) {
	if (typeof children !== 'object') {
		children = <Body>{children}</Body>
	}

	return (
		<ThemeProvider theme={(theme) => ({ ...theme, darkMode: false })}>
			<StyledMessage
				className={className}
				messageType={type}
				border={border}
				mini={mini}
				light={light}
				aria-atomic
			>
				{icon && (
					<StyledIconWrapper type={type}>
						{typeof icon === 'string' ? (
							<Emoji emoji={icon} aria-hidden />
						) : type === 'success' ? (
							<SuccessIcon />
						) : type === 'error' ? (
							<ErrorIcon />
						) : type === 'info' ? (
							<InfoIcon />
						) : (
							<ReturnIcon />
						)}
					</StyledIconWrapper>
				)}
				<Wrapper role={role}>{children}</Wrapper>
			</StyledMessage>
		</ThemeProvider>
	)
}
const StyledIconWrapper = styled.div<{
	type: MessageProps['type']
}>`
	display: flex;
	position: relative;
	top: ${({ theme }) => theme.spacings.xxs};
	width: ${({ theme }) => theme.spacings.xl};
	svg {
		fill: ${({ theme, type }) => textColorFromType(type, theme)};
	}
`

type StyledMessageProps = Pick<MessageProps, 'border' | 'light' | 'mini'> & {
	messageType: NonNullable<MessageProps['type']>
}

const StyledMessage = styled.div<StyledMessageProps>`
	display: flex;
	position: relative;
	align-items: baseline;
	${({ theme, messageType, border, light, mini }) => {
		const colorSpace: Palette | SmallPalette =
			messageType === 'secondary' || messageType === 'primary'
				? theme.colors.bases[messageType]
				: theme.colors.extended[messageType]

		return css`
			padding: 0px ${mini ? theme.spacings.md : theme.spacings.lg};
			background-color: ${light ? 'rgba(255,255,255,0.75)' : colorSpace[100]};
			border: ${mini ? '1px' : '2px'} solid ${colorSpace[border ? 500 : 100]};
			border-radius: ${theme.box.borderRadius};
			margin-bottom: ${theme.spacings.md};

			&& h3,
			&& h4,
			&& h5,
			&& h6 {
				color: ${(colorSpace as Palette)[700] ?? colorSpace[600]};
				background-color: inherit;
			}
			> * {
				margin: -${mini ? theme.spacings.xs : 0} 0;
			}
		`
	}}
`

const Wrapper = styled.div`
	flex: 1;
`

Message.Wrapper = Wrapper

export function textColorFromType(
	type: MessageProps['type'],
	theme: DefaultTheme
) {
	return type === 'success'
		? theme.colors.extended.success[600]
		: type === 'error'
		? theme.colors.extended.error[600]
		: type === 'info'
		? theme.colors.extended.info[600]
		: type === 'secondary'
		? theme.colors.bases.secondary[700]
		: theme.colors.bases.primary[700]
}
