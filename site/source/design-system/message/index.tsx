import React, { CSSProperties, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { css, styled } from 'styled-components'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Palette } from '@/types/styled'

import { CloseButton } from '../buttons'
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
	dismissible?: boolean
	onDismiss?: () => void
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
	dismissible = false,
	onDismiss,
}: MessageProps) {
	const { t } = useTranslation()
	const [showMessage, setShowMessage] = useState(true)

	if (!showMessage) {
		return
	}

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

	const handleDismiss = () => {
		setShowMessage(false)
		onDismiss?.()
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
				<Wrapper role={role} $withCloseButton={dismissible}>
					{children}
					{dismissible && (
						<HideButton
							onPress={handleDismiss}
							aria-label={t('messages.masquer-message', 'Cacher le message')}
							color={getButtonColor(type)}
							$mini={mini}
						/>
					)}
				</Wrapper>
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

const HideButton = styled(CloseButton)<{ $mini: boolean }>`
	position: absolute;
	top: ${({ theme, $mini }) => theme.spacings[$mini ? 'sm' : 'md']};
	right: ${({ theme, $mini }) => theme.spacings[$mini ? 'sm' : 'md']};
`

const Wrapper = styled.div<{ $withCloseButton: boolean }>`
	flex: 1;
	padding-right: ${({ theme, $withCloseButton }) =>
		$withCloseButton && theme.spacings.xl};
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

const getButtonColor = (type: ComponentType) => {
	if (type === 'info') {
		return 'tertiary'
	}

	return type
}
