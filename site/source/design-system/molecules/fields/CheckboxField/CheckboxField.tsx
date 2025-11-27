import {
	Checkbox as RACheckbox,
	type CheckboxProps as RACheckboxProps,
} from 'react-aria-components'
import { styled } from 'styled-components'

import { fieldTransition } from '../fieldsStyles'

export type CheckboxOption = {
	description?: string
	label: string
	value: string
}

type CheckboxFieldProps = RACheckboxProps & {
	option: CheckboxOption
}

export function CheckboxField({ option }: CheckboxFieldProps) {
	return (
		<StyledRACheckbox value={option.value}>
			<div className="checkbox" aria-hidden>
				<div className="checkmark"></div>
			</div>

			{option.label}
		</StyledRACheckbox>
	)
}

const StyledRACheckbox = styled(RACheckbox)`
	--size: ${({ theme }) => theme.spacings.md};
	--borderWidth: 2px;

	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacings.xxs};

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
		width: calc(2.5 * var(--size));
		height: calc(2.5 * var(--size));

		border-radius: 50%;

		background: transparent;

		cursor: pointer;
	}

	.checkbox:hover::before {
		background: ${({ theme }) => theme.colors.bases.primary[200]};
	}

	.checkbox::after {
		position: absolute;
		top: calc(0.75 * var(--size));
		left: calc(0.75 * var(--size));

		width: var(--size);
		height: var(--size);
		border: ${({ theme }) => theme.spacings.xxxs} solid
			${({ theme }) => theme.colors.extended.grey[600]};
		border-radius: var(--borderWidth);
	}

	.checkmark {
		position: absolute;
		top: calc(0.75 * var(--size));
		left: calc(0.75 * var(--size));
		z-index: 10;

		width: calc(0.4 * var(--size));
		height: calc(0.65 * var(--size));
		border: var(--borderWidth) solid transparent;
		border-top-width: 0;
		border-left-width: 0;
		border-radius: var(--borderWidth);

		transform: rotate(40deg) translate(70%, -20%);
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
