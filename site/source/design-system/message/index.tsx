import React from 'react'
import styled, { ThemeProvider, css } from 'styled-components'

import { Palette, SmallPalette } from '@/types/styled'

import { Button } from '../buttons'
import { Body } from '../typography/paragraphs'
import baseIcon from './baseIcon.svg'
import errorIcon from './errorIcon.svg'
import infoIcon from './infoIcon.svg'
import successIcon from './successIcon.svg'

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
				{icon &&
					(type === 'success' ? (
						<StyledIcon src={successIcon} alt="" />
					) : type === 'error' ? (
						<StyledIcon src={errorIcon} alt="" />
					) : type === 'info' ? (
						<StyledIcon src={infoIcon} alt="" />
					) : (
						<StyledIcon src={baseIcon} alt="" />
					))}
				<Wrapper role={role}>{children}</Wrapper>
			</StyledMessage>
		</ThemeProvider>
	)
}

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
			padding: ${theme.spacings.xs} ${theme.spacings.lg};
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
			& p,
			& span,
			& li {
				color: ${({ theme }) => theme.colors.extended.grey[800]};
			}
			& a,
			& button {
				color: ${(colorSpace as Palette)[700] ?? colorSpace[600]};
			}
		`
	}}
	color: red;
`

const StyledIcon = styled.img`
	padding-right: ${({ theme }) => theme.spacings.md};
	${({ theme, title }) =>
		title !== 'paragraph'
			? css`
					margin-top: calc(${theme.spacings.md} + ${theme.spacings.xxs} / 2);
					height: calc(${theme.spacings.md} + ${theme.spacings.xxs});
			  `
			: css`
					margin-top: calc(${theme.spacings.lg});
			  `}
`

const Wrapper = styled.div`
	flex: 1;
`

Message.Wrapper = Wrapper
