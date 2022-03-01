import { FocusStyle, SROnly } from '@/design-system/global-style'
import { useRef } from 'react'
import styled, { css } from 'styled-components'
import { useToggleState } from '@react-stately/toggle'
import { useSwitch } from '@react-aria/switch'

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
}

const StyledSpan = styled.span<StyledProps>`
	position: relative;
	left: ${({ checked }) =>
		checked ? 'calc(100% - 2 * (var(--switch-size) / 4))' : '0'};
	transition: left 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
	padding: calc(var(--switch-size) / 4);
	border-radius: inherit;
	box-shadow: 0px 3px 1px 0px #0000000f, 0px 3px 8px 0px #00000026;
	background-color: #ffffff;
`

const StyledLabel = styled.label<StyledProps>`
	--switch-size: ${({ size }) => sizeDico[size]};
	display: inline-flex;
	transition: all 0.15s ease-in-out;
	background-color: ${({ theme, checked }) =>
		checked
			? theme.colors.bases.primary[700]
			: theme.colors.extended.grey[500]};
	font-family: ${({ theme }) => theme.fonts.main};
	padding: 0.2rem;
	border-radius: var(--switch-size);
	width: calc(1.1 * var(--switch-size));

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
					: theme.colors.extended.grey[500]}42;
	}
	${({ disabled, theme }) =>
		disabled
			? css`
					background-color: ${theme.colors.extended.grey[300]};
					color: ${theme.colors.extended.grey[500]};
			  `
			: ''}
`

type AriaSwitchProps = Parameters<typeof useSwitch>[0]

export type SwitchProps = AriaSwitchProps & {
	size?: Size
}

export const Switch = (props: SwitchProps) => {
	const { size = 'MD', ...ariaProps } = props
	const state = useToggleState(ariaProps)
	const ref = useRef<HTMLInputElement>(null)
	const { inputProps } = useSwitch(ariaProps, state, ref)

	const { isDisabled = false } = ariaProps
	const { isSelected } = state

	return (
		<StyledLabel size={size} checked={isSelected} disabled={isDisabled}>
			<HiddenInput {...inputProps} type="checkbox" tabIndex={0} ref={ref} />
			<StyledSpan
				size={size}
				aria-hidden="true"
				checked={isSelected}
				disabled={isDisabled}
			></StyledSpan>
		</StyledLabel>
	)
}
