import { useRef } from 'react'
import styled from 'styled-components'
import {useToggleState} from '@react-stately/toggle';
import { useCheckbox } from '@react-aria/checkbox';
import { AriaCheckboxProps } from '@react-types/checkbox';
import { Body } from 'DesignSystem/typography/paragraphs';

export default function Checkbox(
	props: AriaCheckboxProps & ({label: string} | {children: string} | {'aria-labelledby': string} | {'aria-label': string})
) {
	const label = 'label' in props ? props.label : 'children' in props ? props.children : false
  const state = useToggleState(props);
  const ref = useRef<HTMLInputElement | null>(null);
  const {inputProps} = useCheckbox(props, state, ref);
	return (
		<>
			<Label>
				<input type="checkbox" className="sr-only" ref={ref} {...inputProps} />
				<CheckboxVisualContainer aria-hidden="true">
					<CheckboxVisual viewBox="0 0 18 18">
						<polyline points="1 9 7 14 15 4" />
					</CheckboxVisual>
				</CheckboxVisualContainer>
				{label && (
					<LabelBody>{' '}{label}</LabelBody>
				)}
			</Label>
		</>
	)
}


const CheckboxVisual = styled.svg`
	position: relative;
	z-index: 1;
	fill: none;
	border: 2px solid;
	border-radius: 2px;
	height: 100%;
	width: 100%;
	stroke-linecap: round;
	stroke-linejoin: round;
	border-color: ${({theme}) => theme.colors.extended.grey[500]};
	stroke: ${({theme}) => theme.colors.extended.grey[100]};
	stroke-width: 2px;
	transition: all 0.2s ease;


	& polyline {
		stroke-dasharray: 22;
		stroke-dashoffset: 66;
	}
`

const CheckboxVisualContainer = styled.div`
	--size: ${({theme}) => theme.spacings.md};
	--halo: ${({theme}) => theme.spacings.sm};
	cursor: pointer;
	position: relative;
	margin-right: var(--halo);
	margin-top: var(--halo);
	width: var(--size);
	height: var(--size);
	flex-shrink: 0;
	line-height: ${({theme}) => theme.spacings.lg};
	-webkit-tap-highlight-color: transparent;

	::before {
		content: '';
		position: absolute;
		top: calc(var(--halo) * -1);
		left: calc(var(--halo) * -1);
		width: calc((var(--halo) + 1px) * 2 + var(--size));
		height: calc((var(--halo) + 1px) * 2 + var(--size));
		border-radius: 50%;
		background:  ${({theme}) => theme.colors.bases.primary[100]};
		z-index: 0;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	&:hover:before {
		opacity: 1;
	}

	&:hover ${CheckboxVisual} {
		border-color: ${({theme}) => theme.colors.bases.primary[700]};
	}

`


const Label = styled.label`
	display: inline-flex;
	align-items: start;
	z-index: 1;

	:focus-within > ${CheckboxVisualContainer} {
		opacity: 1;
	}

	:focus-within > ${CheckboxVisual} {
		stroke: ${({theme}) => theme.colors.bases.primary[700]};
	}

	> input:checked + ${CheckboxVisualContainer} > ${CheckboxVisual} {
		background-color: ${({theme}) => theme.colors.bases.primary[700]};
		stroke: ${({theme}) => theme.colors.extended.grey[100]};
		border-color: ${({theme}) => theme.colors.bases.primary[700]};


		& > polyline {
			stroke-dashoffset: 42;
			transition: all 0.1s linear;
			transition-delay: 0.075s;
		}
	}
`
const LabelBody = styled(Body)`
margin: ${({theme}) => theme.spacings.xs} 0px;
margin-left: ${({theme}) => theme.spacings.xxs};
`
