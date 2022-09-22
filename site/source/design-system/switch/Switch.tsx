import { FocusStyle, SROnly } from '@/design-system/global-style'
import { ReactNode, useRef } from 'react'
import styled, { css } from 'styled-components'
import { useToggleState } from '@react-stately/toggle'
import { useSwitch } from '@react-aria/switch'
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

interface StyledProps {
	checked: boolean
	disabled: boolean
	size: Size
	light: boolean
}

const StyledSpan = styled.span<StyledProps>`
	position: relative;
	left: ${({ checked }) =>
		checked ? 'calc(100% - 2 * (var(--switch-size) / 5))' : '0'};
	transition: left 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
	padding: calc(var(--switch-size) / 5);
	border-radius: inherit;
	box-shadow: 0px 3px 1px 0px #0000000f, 0px 3px 8px 0px #00000026;
	background-color: #ffffff;
`

const StyledSwitch = styled.span<StyledProps>`
	--switch-size: ${({ size }) => sizeDico[size]};
	display: inline-flex;
	transition: all 0.15s ease-in-out;
	background-color: ${({ theme, checked }) =>
		checked
			? theme.colors.bases.primary[700]
			: theme.colors.extended.grey[500]};
	font-family: ${({ theme }) => theme.fonts.main};
	padding: 0.2rem;
	margin: 0 ${({ theme }) => theme.spacings.xxs};
	border-radius: var(--switch-size);
	width: calc(var(--switch-size) + ${({ light }) => (light ? 4 : 0)}px);
	${({ light }) =>
		light
			? css`
					border: 2px #ffffffbf solid;
			  `
			: ''}

	&:focus-within {
		${FocusStyle}
	}

	&:hover ${StyledSpan} {
		box-shadow: 0 0 0 0.5rem
			${({ disabled, checked, theme }) =>
				disabled
					? ''
					: checked
					? theme.colors.bases.primary[700]
					: theme.colors.extended.grey[500]}42; // 42 is alpha
	}
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
	cursor: pointer;
`

const Text = styled.span`
	margin-right: ${({ theme }) => theme.spacings.xxs};
`

type AriaSwitchProps = Parameters<typeof useSwitch>[0]

export type SwitchProps = AriaSwitchProps & {
	size?: Size
	light?: boolean
	children?: ReactNode
	className?: string
}

export const Switch = (props: SwitchProps) => {
	const {
		size = 'MD',
		light = false,
		children,
		className,
		...ariaProps
	} = props
	const state = useToggleState(ariaProps)
	const ref = useRef<HTMLInputElement>(null)
	const { inputProps } = useSwitch(ariaProps, state, ref)

	const { isDisabled = false } = ariaProps
	const { isSelected } = state

	return (
		<LabelBody as="label" className={className}>
			{children && <Text>{children}</Text>}
			<StyledSwitch
				light={light}
				size={size}
				checked={isSelected}
				disabled={isDisabled}
			>
				<HiddenInput {...inputProps} type="checkbox" tabIndex={0} ref={ref} />
				<StyledSpan
					light={light}
					size={size}
					aria-hidden
					checked={isSelected}
					disabled={isDisabled}
				/>
			</StyledSwitch>
		</LabelBody>
	)
}
