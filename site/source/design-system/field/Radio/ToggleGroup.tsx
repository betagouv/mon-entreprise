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

type ToggleGroupProps = AriaRadioGroupProps & {
	label?: string
	hideRadio?: boolean
	children: React.ReactNode
	className?: string
}

export function ToggleGroup(props: ToggleGroupProps) {
	const { children, label, className } = props
	const state = useRadioGroupState(props)
	const { radioGroupProps, labelProps } = useRadioGroup(
		{ ...props, orientation: 'horizontal' },
		state
	)

	return (
		<div className={className} {...radioGroupProps}>
			{label && <span {...labelProps}>{label}</span>}
			<ToggleGroupContainer
				hideRadio={props.hideRadio ?? false}
				role="radiogroup"
			>
				<RadioContext.Provider value={state}>{children}</RadioContext.Provider>
			</ToggleGroupContainer>
		</div>
	)
}

export const ToggleGroupContainer = styled.div<{ hideRadio: boolean }>`
	--radius: 0.25rem;
	display: inline-flex;
	flex-wrap: wrap;

	${VisibleRadio} {
		position: relative;
		align-items: center;
		z-index: 1;
		border: 1px solid
			${({ theme }) =>
				theme.darkMode
					? theme.colors.extended.dark[500]
					: theme.colors.extended.grey[500]};
		margin: 0;
		margin-right: -1px;
		border-radius: 0;
		cursor: pointer;
		padding: ${({ theme: { spacings } }) => spacings.xs + ' ' + spacings.lg};
		background: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.dark[600]
				: theme.colors.extended.grey[100]};
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
		border: 1px solid
			${({ theme }) =>
				theme.darkMode
					? theme.colors.bases.primary[400]
					: theme.colors.bases.primary[700]};
		background-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.bases.primary[500]
				: theme.colors.bases.primary[200]};
	}

	${VisibleRadio}:hover {
		background-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.bases.primary[700]
				: theme.colors.bases.primary[100]};
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
