import React from 'react'
import styled, { ThemeProvider, css } from 'styled-components'

import { Palette, SmallPalette } from '@/types/styled'

import { ErrorIcon, InfoIcon, ReturnIcon, SuccessIcon } from '../icons'
import { Body } from '../typography/paragraphs'

export type MessageType = 'primary' | 'secondary' | 'info' | 'error' | 'success'
type MessageProps = {
	children: React.ReactNode
	icon?: boolean
	border?: boolean
	type?: MessageType
	light?: boolean
	className?: string
	role?: string
}

export function Message({
	type = 'primary',
	icon = false,
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
				light={light}
				aria-atomic
			>
				{icon && (
					<StyledIconWrapper type={type}>
						{type === 'success' ? (
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
		fill: ${({ theme, type }) =>
			type === 'success'
				? theme.colors.extended.success[600]
				: type === 'error'
				? theme.colors.extended.error[600]
				: type === 'info'
				? theme.colors.extended.info[600]
				: type === 'secondary'
				? theme.colors.bases.secondary[700]
				: theme.colors.bases.primary[700]};
	}
`

type StyledMessageProps = Pick<MessageProps, 'border' | 'light'> & {
	messageType: NonNullable<MessageProps['type']>
}

const StyledMessage = styled.div<StyledMessageProps>`
	display: flex;
	position: relative;
	align-items: baseline;
	${({ theme, messageType, border, light }) => {
		const colorSpace: Palette | SmallPalette =
			messageType === 'secondary' || messageType === 'primary'
				? theme.colors.bases[messageType]
				: theme.colors.extended[messageType]

		return css`
			padding: 0px ${theme.spacings.lg};
			background-color: ${light ? 'rgba(255,255,255,0.75)' : colorSpace[100]};
			border: 2px solid ${colorSpace[border ? 500 : 100]};
			border-radius: ${theme.box.borderRadius};
			margin-bottom: ${theme.spacings.md};

			&& h3,
			&& h4,
			&& h5,
			&& h6 {
				color: ${(colorSpace as Palette)[700] ?? colorSpace[600]};
				background-color: inherit;
			}
		`
	}}
`

const Wrapper = styled.div`
	flex: 1;
`

Message.Wrapper = Wrapper
