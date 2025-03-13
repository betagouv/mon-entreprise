import { useSwitch } from '@react-aria/switch'
import { useToggleState } from '@react-stately/toggle'
import { ReactNode, useRef } from 'react'
import { css, styled } from 'styled-components'

import { FocusStyle, SROnly } from '@/design-system/global-style'
import { generateUuid } from '@/utils'

import { Body } from '../typography/paragraphs'

const HiddenInput = styled.input`
	${SROnly}
`

type Size = 'XL' | 'MD' | 'XS'

const sizeDico = {
	XS: '2rem',
	MD: '3rem',
	XL: '4rem',
} as { [K in Size]: string }

const StyledSpan = styled.span<{ checked: boolean }>`
	position: relative;
	left: ${({ checked }) =>
		checked ? 'calc(100% - 2 * (var(--switch-size) / 5))' : '0'};
	transition:
		left 0.15s ease-in-out,
		box-shadow 0.15s ease-in-out;
	padding: calc(var(--switch-size) / 5);
	border-radius: inherit;
	box-shadow:
		0px 3px 1px 0px #0000000f,
		0px 3px 8px 0px #00000026;
	background-color: #ffffff;
	color: inherit;
`
interface StyledSwitchProps {
	checked: boolean
	disabled: boolean
	$size: Size
	$light: boolean
}

const StyledSwitch = styled.span<StyledSwitchProps>`
	--switch-size: ${({ $size }) => sizeDico[$size]};
	display: inline-flex;
	transition: all 0.15s ease-in-out;
	background-color: ${({ theme, checked }) =>
		checked
			? theme.colors.bases.primary[700]
			: theme.colors.extended.grey[600]};
	color: inherit;
	font-family: ${({ theme }) => theme.fonts.main};
	padding: 0.2rem;
	margin: 0 ${({ theme }) => theme.spacings.xxs};
	border-radius: var(--switch-size);
	width: calc(var(--switch-size) + ${({ $light }) => ($light ? 4 : 0)}px);
	${({ $light }) =>
		$light
			? css`
					border: 2px #ffffffbf solid !important;
			  `
			: ''}

	${({ disabled, theme }) =>
		disabled
			? css`
					background-color: ${theme.colors.extended.grey[300]};
					color: ${theme.colors.extended.grey[500]};
			  `
			: ''}
`

const LabelBody = styled(Body)`
	display: inline-flex;
	align-items: center;
	border-radius: ${({ theme }) => theme.box.borderRadius};
	cursor: pointer;

	&:hover,
	&:focus-within {
		${FocusStyle}
	}
`

const Text = styled.span`
	${({ theme }) => css`
		margin: 0 ${theme.spacings.xxs};
	`}
`

const SrOnlyText = styled.span`
	${SROnly}
`

type AriaSwitchProps = Parameters<typeof useSwitch>[0]

type SwitchProps = AriaSwitchProps & {
	size?: Size
	light?: boolean
	srOnlyLabel?: boolean
	children: ReactNode
}

export const Switch = (props: SwitchProps) => {
	const {
		size = 'MD',
		light = false,
		srOnlyLabel = false,
		children,
		...ariaProps
	} = props
	const state = useToggleState(ariaProps)
	const ref = useRef<HTMLInputElement>(null)
	const { inputProps } = useSwitch(ariaProps, state, ref)

	const { isDisabled = false } = ariaProps
	const { isSelected } = state

	const uuid = generateUuid()

	return (
		<LabelBody as="label" htmlFor={uuid}>
			<StyledSwitch
				$light={light}
				$size={size}
				checked={isSelected}
				disabled={isDisabled}
			>
				<HiddenInput
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...inputProps}
					id={uuid}
					type="checkbox"
					role="switch"
					tabIndex={0}
					ref={ref}
				/>
				<StyledSpan aria-hidden checked={isSelected} />
			</StyledSwitch>

			{srOnlyLabel ? (
				<SrOnlyText>{children}</SrOnlyText>
			) : (
				<Text>{children}</Text>
			)}
		</LabelBody>
	)
}
