import { useCheckbox } from '@react-aria/checkbox'
import { useToggleState } from '@react-stately/toggle'
import { AriaCheckboxProps } from '@react-types/checkbox'
import { useRef } from 'react'
import { styled } from 'styled-components'

import { FocusStyle } from '../../global-style'
import { Body } from '../../typography/paragraphs'

type Props = AriaCheckboxProps & {
	id: string
	alignment?: 'center' | 'start' | 'end'
} & (
	| {label?: string}
	| {children?: string}
)

export function Checkbox(props: Props) {
	const label =
		'label' in props ? props.label : 'children' in props ? props.children : ''
	const state = useToggleState(props)
	const ref = useRef<HTMLInputElement | null>(null)
	const { inputProps } = useCheckbox(
		{
			...props,
			// On ajoute cette propriété pour éviter l'avertissement
			// "If you do not provide children, you must specify an
			// aria-label for accessibility"
			children: label,
		},
		state,
		ref
	)
	const alignment = props.alignment ?? 'center'

	return (
		<CheckboxContainer htmlFor={props.id}>
			<input
				id={props.id}
				type="checkbox"
				className="sr-only"
				ref={ref}
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...inputProps}
			/>
			<VisibleContainer $alignItems={alignment}>
				<CheckboxVisualContainer aria-hidden>
					<CheckboxVisual viewBox="0 0 18 18">
						<polyline points="1 9 7 14 15 4" />
					</CheckboxVisual>
				</CheckboxVisualContainer>
				{label && <LabelBody as="span">{label}</LabelBody>}
			</VisibleContainer>
		</CheckboxContainer>
	)
}

const CheckboxVisual = styled.svg`
	z-index: 1;
	fill: none;
	stroke-linecap: round;
	stroke-linejoin: round;
	stroke: ${({ theme }) => theme.colors.extended.grey[100]};
	stroke-width: ${({ theme }) => (theme.darkMode ? '3px' : '2px')};
	transition: all 0.2s ease;
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;

	& polyline {
		stroke-dasharray: 22;
		stroke-dashoffset: 66;
	}
`

const CheckboxVisualContainer = styled.span`
	--size: ${({ theme }) => theme.spacings.md};
	--halo: ${({ theme }) => theme.spacings.sm};
	cursor: pointer;
	position: relative;
	border: 2px solid;
	border-radius: 2px;
	border-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[300]
			: theme.colors.extended.grey[600]};
	margin: var(--halo);
	margin-left: 0;
	width: var(--size);
	height: var(--size);
	flex-shrink: 0;
	-webkit-tap-highlight-color: transparent;
	transition: all 0.2s ease;

	&::before {
		content: '';
		position: absolute;
		top: calc(var(--halo) * -1 - 2px);
		left: calc(var(--halo) * -1 - 2px);
		width: calc((var(--halo)) * 2 + var(--size));
		height: calc((var(--halo)) * 2 + var(--size));
		border-radius: 50%;
		background: ${({ theme }) =>
			theme.darkMode
				? 'rgba(255,255,255,20%)'
				: theme.colors.bases.primary[100]};
		z-index: -1;
		opacity: 0;
		transition: all 0.15s ease;
		transform: scale(0.5);
	}

	&:hover:before {
		opacity: 1;
		transform: scale(1);
	}

	&:hover {
		border-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.bases.primary[700]};
	}
`

const VisibleContainer = styled.span<{
	$alignItems: 'center' | 'start' | 'end'
}>`
	display: inline-flex;
	z-index: 1;
	border-radius: ${({ theme }) => theme.box.borderRadius};
	padding: 0 ${({ theme }) => theme.spacings.sm};
	margin: 0 calc(-1 * ${({ theme }) => theme.spacings.sm});
	align-items: ${({ $alignItems }) => $alignItems};
`
const LabelBody = styled(Body)`
	margin: ${({ theme }) => theme.spacings.xs} 0px;
	margin-left: ${({ theme }) => theme.spacings.xxs};
`
const CheckboxContainer = styled.label`
	input :focus + ${VisibleContainer} ${CheckboxVisualContainer} {
		opacity: 1;
	}

	input:focus + ${VisibleContainer} ${CheckboxVisual} {
		stroke: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.bases.primary[700]};
	}

	input:checked
		+ ${VisibleContainer}
		${CheckboxVisualContainer}
		> ${CheckboxVisual} {
		background-color: ${({ theme }) => theme.colors.bases.primary[700]};
		stroke: ${({ theme }) => theme.colors.extended.grey[100]};

		& > polyline {
			stroke-dashoffset: 42;
			transition: all 0.1s linear;
			transition-delay: 0.075s;
		}
	}

	input:checked + ${VisibleContainer} ${CheckboxVisualContainer} {
		border-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.bases.primary[700]};
	}

	&:focus-within ${VisibleContainer} {
		${FocusStyle}
	}
`
