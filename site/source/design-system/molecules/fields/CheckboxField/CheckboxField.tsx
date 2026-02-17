import { Checkbox as RACheckbox } from 'react-aria-components'
import { styled } from 'styled-components'

import { InfoButton } from '@/design-system/InfoButton'

import { fieldTransition, outlineOnFocus } from '../fieldsStyles'

export type CheckboxOption = {
	description?: string
	label: string
	value: string
}

type CheckboxFieldProps = {
	option: CheckboxOption
}

export function CheckboxField({ option }: CheckboxFieldProps) {
	return (
		<StyledCheckoxAndInfoButtonContainer>
			<StyledRACheckbox value={option.value}>
				<div className="checkbox" aria-hidden>
					<div className="checkmark"></div>
				</div>

				{option.label}
			</StyledRACheckbox>

			{option.description && (
				<InfoButton
					description={option.description}
					title={option.label.toString()}
					light
				/>
			)}
		</StyledCheckoxAndInfoButtonContainer>
	)
}

const StyledCheckoxAndInfoButtonContainer = styled.div`
	display: flex;
	align-items: center;

	button.print-hidden {
		margin-left: ${({ theme }) => theme.spacings.xxxs};
	}
`

const StyledRACheckbox = styled(RACheckbox)`
	--size: ${({ theme }) => theme.spacings.md};
	--borderWidth: 2px;

	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacings.xs};

	width: fit-content;
	margin: ${({ theme }) => theme.spacings.xxs};
	padding-right: ${({ theme }) => theme.spacings.xs};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	outline: transparent solid 1px;

	font-family: ${({ theme }) => theme.fonts.main};

	position: relative;

	.checkbox::before,
	.checkbox::after {
		content: '';

		display: block;

		cursor: pointer;

		${fieldTransition}
	}

	.checkbox::before {
		width: calc(2 * var(--size));
		height: calc(2 * var(--size));

		border-radius: 50%;

		background: transparent;

		cursor: pointer;
	}

	.checkbox:hover::before {
		background: ${({ theme }) => theme.colors.bases.primary[200]};
	}

	.checkbox::after {
		position: absolute;
		top: calc(0.5 * var(--size));
		left: calc(0.5 * var(--size));

		width: var(--size);
		height: var(--size);
		border: ${({ theme }) => theme.spacings.xxxs} solid
			${({ theme }) => theme.colors.extended.grey[600]};
		border-radius: var(--borderWidth);
	}

	.checkmark {
		position: absolute;
		top: calc(0.5 * var(--size));
		left: calc(0.5 * var(--size));
		z-index: 10;

		width: calc(0.4 * var(--size));
		height: calc(0.65 * var(--size));
		border: var(--borderWidth) solid transparent;
		border-top-width: 0;
		border-left-width: 0;
		border-radius: var(--borderWidth);

		transform: rotate(40deg) translate(70%, -20%);
	}

	&[data-focused='true'] {
		${outlineOnFocus}
	}

	&[data-selected='true'] {
		.checkbox::after {
			border-color: ${({ theme }) => theme.colors.bases.primary[700]};

			background: ${({ theme }) => theme.colors.bases.primary[700]};
		}

		.checkmark {
			border-color: white;
		}
	}
`
