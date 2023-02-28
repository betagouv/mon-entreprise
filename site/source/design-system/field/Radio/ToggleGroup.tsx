import { useRadioGroup } from '@react-aria/radio'
import { useRadioGroupState } from '@react-stately/radio'
import { AriaRadioGroupProps } from '@react-types/radio'
import styled, { css } from 'styled-components'

import {
	InputRadio,
	LabelBody,
	RadioButton,
	RadioContext,
	VisibleRadio,
} from './Radio'

export type Toggle = 'toggle'
export type Tab = 'tab'

type ToggleGroupProps = AriaRadioGroupProps & {
	label?: string
	hideRadio?: boolean
	children: React.ReactNode
	className?: string
	mode?: Toggle | Tab
}

export function ToggleGroup(props: ToggleGroupProps) {
	const { children, label, className } = props
	const state = useRadioGroupState(props)
	const { radioGroupProps, labelProps } = useRadioGroup(
		{ ...props, orientation: 'horizontal' },
		state
	)

	return (
		<div
			className={className}
			{...radioGroupProps}
			aria-label={props['aria-label'] ?? undefined}
		>
			{label && <span {...labelProps}>{label}</span>}
			<ToggleGroupContainer
				hideRadio={props.hideRadio ?? false}
				mode={props?.mode}
				isDisabled={props?.isDisabled}
			>
				<RadioContext.Provider value={state}>{children}</RadioContext.Provider>
			</ToggleGroupContainer>
		</div>
	)
}

const TabModeStyle = css`
	border: none !important;
	border-radius: ${({ theme }) =>
		`${theme.spacings.md} ${theme.spacings.md} 0 0`}!important;
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.dark[600]
			: theme.colors.bases.primary[200]};
	padding: 0.875rem 2rem;
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		padding: 0.875rem 0.875rem;
	}
`

const TabModeCheckedStyle = css`
	z-index: 2;
	border: none !important;
	background-color: ${({ theme }) => theme.colors.bases.primary[600]};

	${LabelBody} {
		color: ${({ theme }) => theme.colors.extended.grey[100]}!important;
	}
`

export const ToggleGroupContainer = styled.div<{
	hideRadio: boolean
	mode?: Toggle | Tab
	isDisabled?: boolean
}>`
	--radius: 0.25rem;
	display: inline-flex;
	flex-wrap: wrap;
	${({ mode }) =>
		mode === 'tab' &&
		css`
			flex-wrap: nowrap;
		`}

	${VisibleRadio} {
		position: relative;
		align-items: center;
		z-index: 1;
		border: 2px solid
			${({ theme }) =>
				theme.darkMode
					? theme.colors.extended.dark[500]
					: theme.colors.extended.grey[500]};
		margin: 0;
		margin-right: -2px;
		border-radius: 0;
		padding: ${({ theme: { spacings } }) => spacings.xs + ' ' + spacings.lg};
		background: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.dark[600]
				: theme.colors.extended.grey[100]};

		${({ mode }) => mode === 'tab' && TabModeStyle}
		${({ isDisabled }) => !isDisabled && 'cursor: pointer;'}
	}

	${LabelBody} {
		margin: 0;
		margin-left: ${({ theme }) => theme.spacings.xxs};
	}

	> :first-child ${VisibleRadio} {
		border-top-left-radius: var(--radius);
		border-bottom-left-radius: var(--radius);
	}

	> :last-child ${VisibleRadio} {
		border-top-right-radius: var(--radius);
		border-bottom-right-radius: var(--radius);
		margin-right: 0;
	}

	${InputRadio}:checked + ${VisibleRadio} {
		z-index: 2;
		border: 2px solid
			${({ theme }) =>
				theme.darkMode
					? theme.colors.bases.primary[300]
					: theme.colors.bases.primary[600]};
		background-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.bases.primary[600]
				: theme.colors.bases.primary[100]};
		${({ mode }) => mode === 'tab' && TabModeCheckedStyle}
	}

	${VisibleRadio}:hover {
		background-color: ${({ theme, isDisabled }) =>
			!isDisabled &&
			(theme.darkMode
				? theme.colors.bases.primary[700]
				: theme.colors.bases.primary[100])};
	}
	${RadioButton} {
		${({ hideRadio }) =>
			hideRadio &&
			css`
				display: none;
			`}
		margin-right: ${({ theme }) => theme.spacings.xxs};
	}
	${RadioButton}::before {
		opacity: 0 !important;
	}
`
