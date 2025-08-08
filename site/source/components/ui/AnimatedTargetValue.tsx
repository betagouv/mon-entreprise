import { formatValue } from 'publicodes'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { keyframes, styled } from 'styled-components'

import { Montant } from '@/domaine/Montant'

type AnimatedTargetValueProps = {
	value: Montant
}

const formatDifference = (
	difference: number,
	language: string,
	unit: string
) => {
	const prefix = difference > 0 ? '+' : ''

	return (
		prefix +
		(formatValue(difference, { displayedUnit: unit, language }) as string)
	)
}

export default function AnimatedTargetValue({
	value,
}: AnimatedTargetValueProps) {
	const numericValue = value.valeur
	const valueUnit = value.unité

	const previousValue = useRef<number>()
	const previousDifference = useRef<number>()
	const { language } = useTranslation().i18n
	const previousUnit = useRef(valueUnit)

	let difference =
		numericValue == null ||
		previousValue.current == null ||
		// We don't want to show the animated if the difference comes from a change in the unit
		previousUnit.current !== valueUnit
			? undefined
			: numericValue - previousValue.current

	if (previousValue.current !== numericValue) {
		previousValue.current = numericValue
		previousDifference.current = difference
	} else {
		difference = previousDifference.current
	}

	if (previousUnit.current !== valueUnit) {
		previousUnit.current = valueUnit
	}

	if (!difference || Math.abs(difference) < 1) {
		return null
	}

	return (
		<div
			className="print-hidden"
			aria-hidden
			key={difference}
			style={{
				position: 'relative',
				textAlign: 'right',
			}}
		>
			<StyledEvaporate>
				{formatDifference(difference ?? 0, language, valueUnit)}
			</StyledEvaporate>
		</div>
	)
}

const evaporateAnimation = keyframes`
	5% {
		opacity: 1;
		transform: translateY(-10px) scaleY(1);
	}
	95% {
		opacity: 1;
		transform: translateY(-20px) scaleY(1);
	}
	to {
		transform: translateY(-35px) scaleY(0.1);
		opacity: 0;
	}
`

const StyledEvaporate = styled.div`
	display: block;
	position: absolute;
	font-family: ${({ theme }) => theme.fonts.main};
	z-index: 3;
	right: ${({ theme }) => theme.spacings.sm};
	color: ${({ theme }) => theme.colors.bases.secondary[400]};
	background-color: inherit;
	top: 0;
	opacity: 0;
	animation: ${evaporateAnimation} 2.5s linear;
	transform: scaleY(0.1);
`
