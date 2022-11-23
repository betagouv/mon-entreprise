import { formatValue } from 'publicodes'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled, { keyframes } from 'styled-components'

import { targetUnitSelector } from '@/selectors/simulationSelectors'

type AnimatedTargetValueProps = {
	value?: number
}

const formatDifference = (difference: number, language: string) => {
	const prefix = difference > 0 ? '+' : ''

	return (
		prefix +
		(formatValue(difference, { displayedUnit: '€', language }) as string)
	)
}

export default function AnimatedTargetValue({
	value,
}: AnimatedTargetValueProps) {
	const previousValue = useRef<number>()
	const previousDifference = useRef<number>()
	const { language } = useTranslation().i18n

	const unit = useSelector(targetUnitSelector)
	const previousUnit = useRef(unit)

	let difference =
		value == null ||
		previousValue.current == null ||
		// We don't want to show the animated if the difference comes from a change in the unit
		previousUnit.current !== unit
			? undefined
			: value - previousValue.current

	if (previousValue.current !== value) {
		previousValue.current = value
		previousDifference.current = difference
	} else {
		difference = previousDifference.current
	}
	if (previousUnit.current !== unit) {
		previousUnit.current = unit
	}

	if (!difference || Math.abs(difference) < 1) {
		return null
	}

	return (
		<div
			className="print-hidden"
			aria-hidden
			key={difference}
			css={`
				position: relative;
				text-align: right;
			`}
		>
			<StyledEvaporate>
				{formatDifference(difference ?? 0, language)}
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
