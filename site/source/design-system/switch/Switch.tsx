import { FocusStyle, SROnly } from '~/design-system/global-style'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useToggleState } from '@react-stately/toggle'
import { useSwitch } from '@react-aria/switch'

const HiddenCheckbox = styled.input`
	${SROnly}
`

interface StyledProps {
	checked: boolean
	disabled: boolean
}

const StyledCheckbox = styled.label<StyledProps>`
	display: flex;
	justify-content: center;
	position: relative;
	padding: 0.6rem 1rem;
	border-radius: inherit;
	box-shadow: 0px 3px 1px 0px #0000000f, 0px 3px 8px 0px #00000026;
	background-color: #ffffff;
	text-align: center;
	transition: transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
	transform: translateX(${({ checked }) => (checked ? '0.8rem' : '-0.8rem')});
`

const StyledSwitch = styled.span<StyledProps>`
	display: inline-block;
	position: relative;
	transition: all 0.15s ease-in-out;
	background-color: ${({ theme, checked }) =>
		checked
			? theme.colors.bases.primary[700]
			: theme.colors.extended.grey[500]};
	font-family: ${({ theme }) => theme.fonts.main};
	padding: 0.2rem 1rem;
	border-radius: 2.5rem;
	width: 90px;

	&:focus-within {
		${FocusStyle}
	}

	&:hover ${StyledCheckbox} {
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

type AriaCheckboxProps = Parameters<typeof useSwitch>[0]

export type SwitchProps = AriaCheckboxProps

export const Switch = (props: SwitchProps) => {
	const { t } = useTranslation()
	const state = useToggleState(props)
	const ref = useRef<HTMLInputElement>(null)
	const { inputProps } = useSwitch(props, state, ref)

	const { isDisabled = false } = props
	const { isSelected } = state

	return (
		<StyledSwitch
			checked={isSelected}
			disabled={isDisabled}
			onClick={() => !isDisabled && state.toggle()}
		>
			<HiddenCheckbox {...inputProps} aria-hidden="true" ref={ref} />
			<StyledCheckbox checked={isSelected} disabled={isDisabled}>
				{isSelected ? t('Oui') : t('Non')}
			</StyledCheckbox>
		</StyledSwitch>
	)
}
