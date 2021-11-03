import { RadioAriaProps, useRadio } from '@react-aria/radio'
import { RadioGroupState } from '@react-stately/radio'
import { Body } from 'DesignSystem/typography/paragraphs'
import { createContext, useContext, useRef } from 'react'
import styled from 'styled-components'
const RadioContext = createContext<RadioGroupState | null>(null)

export default function Radio(props: RadioAriaProps) {
	const { children } = props
	const state = useContext(RadioContext)
	if (!state) {
		throw new Error("Radio can't be instanciated outside a RadioContext")
	}
	const ref = useRef(null)
	const { inputProps } = useRadio(props, state, ref)
	return (
		<Label>
			<input {...inputProps} className="sr-only" ref={ref} />
			<RadioSvg aria-hidden="true" viewBox="0 0 12 12">
				<OutsideCircle cx={6} cy={6} r={6} />
				<InsideCircle cx={6} cy={6} r={4} />
			</RadioSvg>
			<LabelBody>{children}</LabelBody>
		</Label>
	)
}

const OutsideCircle = styled.circle`
	stroke: ${({ theme }) => theme.colors.extended.grey[500]};
	stroke-width: 2px;
	fill: none;
	transition: all 0.2s;
`

const InsideCircle = styled.circle`
	fill: ${({ theme }) => theme.colors.bases.primary[700]};
	stroke: none;
	transform: scale(0);
	transition: all 0.2s;
`

const RadioSvg = styled.svg`
	--size: ${({ theme }) => theme.spacings.md};
	--halo: ${({ theme }) => theme.spacings.sm};
	height: var(--size);
	width: var(--size);
	cursor: pointer;

	::before {
		content: '';
		position: absolute;
		top: calc(var(--halo) * -1);
		left: calc(var(--halo) * -1);
		width: calc(var(--halo) * 2 + var(--size));
		height: calc(var(--halo) * 2 + var(--size));
		border-radius: 50%;
		background: ${({ theme }) => theme.colors.bases.primary[100]};
		z-index: 0;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	&:hover:before {
		opacity: 1;
	}

	&:hover ${OutsideCircle} {
		stroke: ${({ theme }) => theme.colors.bases.primary[700]};
	}
`

const Label = styled.label`
	display: inline-flex;
	align-items: start;
	z-index: 1;
	input:focus + ${RadioSvg} > ${OutsideCircle} {
		stroke: ${({ theme }) => theme.colors.bases.primary[700]};
	}

	input:checked + ${RadioSvg} > ${InsideCircle} {
		transform: scale(1);
	}
`

const LabelBody = styled(Body)`
	margin: ${({ theme }) => theme.spacings.xs} 0px;
	margin-left: ${({ theme }) => theme.spacings.xxs};
`
