import React from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import baseIcon from './baseIcon.svg'
import infoIcon from './infoIcon.svg'
import errorIcon from './errorIcon.svg'
import successIcon from './successIcon.svg'
import { Body } from '../typography/paragraphs'
import { Palette, SmallPalette } from '../styled'

type MessageType = 'primary' | 'secondary' | 'info' | 'error' | 'success'
type MessageProps = {
	children: React.ReactNode
	icon?: boolean
	border?: boolean
	type?: MessageType
	light?: boolean
}

export function Message({
	type = 'primary',
	icon = false,
	border = true,
	light = false,
	children,
}: MessageProps) {
	if (typeof children !== 'object') {
		children = <Body>{children}</Body>
	}

	return (
		<ThemeProvider theme={(theme) => ({ ...theme, darkMode: false })}>
			<StyledMessage type={type} border={border} light={light}>
				{icon &&
					(type === 'success' ? (
						<StyledIcon
							src={successIcon}
							title="succès"
							alt="icône signalant une alerte sur un succès"
						/>
					) : type === 'error' ? (
						<StyledIcon
							src={errorIcon}
							title="error"
							alt="icône signalant une alerte sur une erreur"
						/>
					) : type === 'info' ? (
						<StyledIcon
							src={infoIcon}
							title="info"
							alt="icône signalant une alerte sur une information"
						/>
					) : (
						<StyledIcon
							src={baseIcon}
							title="paragraph"
							alt="icône signalant un texte informatif"
						/>
					))}
				<div
					css={`
						flex: 1;
					`}
				>
					{children}
				</div>
			</StyledMessage>
		</ThemeProvider>
	)
}

const StyledMessage = styled.div<
	Pick<MessageProps, 'border' | 'light'> & {
		type: NonNullable<MessageProps['type']>
	}
>`
	display: flex;
	position: relative;
	align-items: baseline;
	${({ theme, type, border, light }) => {
		const colorSpace: Palette | SmallPalette =
			type === 'secondary' || type === 'primary'
				? theme.colors.bases[type]
				: theme.colors.extended[type]

		return css`
			padding: ${theme.spacings.xs} ${theme.spacings.lg};
			background-color: ${light ? 'rgba(255,255,255,0.75)' : colorSpace[100]};
			border: 2px solid ${colorSpace[border ? 500 : 100]};
			border-radius: ${theme.box.borderRadius};
			margin-bottom: ${theme.spacings.md};

			h3,
			h4,
			h5,
			h6 {
				color: ${(colorSpace as Palette)[700] ?? colorSpace[600]};
			}
		`
	}}
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
