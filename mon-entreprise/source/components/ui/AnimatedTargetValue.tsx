import { formatValue } from 'publicodes'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import './AnimatedTargetValue.css'

type AnimatedTargetValueProps = {
	value?: number
	children?: React.ReactNode
}

const formatDifference = (difference: number, language: string) => {
	const prefix = difference > 0 ? '+' : ''
	return prefix + formatValue(difference, { displayedUnit: '€', language })
}

export default function AnimatedTargetValue({
	value,
	children
}: AnimatedTargetValueProps) {
	const previousValue = useRef<number>()
	const { language } = useTranslation().i18n

	// We don't want to show the animated if the difference comes from a change in the unit
	const currentUnit = useSelector(
		(state: RootState) => state?.simulation?.targetUnit
	)
	const previousUnit = useRef(currentUnit)

	const difference =
		previousValue.current === value || (value && Number.isNaN(value))
			? null
			: (value || 0) - (previousValue.current || 0)
	const shouldDisplayDifference =
		difference !== null &&
		previousUnit.current === currentUnit &&
		Math.abs(difference) > 1

	previousValue.current = value
	previousUnit.current = currentUnit

	return (
		<>
			<span className="Rule-value">
				{shouldDisplayDifference && difference !== null && (
					<Evaporate
						style={{
							color: difference > 0 ? 'chartreuse' : 'red',
							pointerEvents: 'none'
						}}
					>
						{formatDifference(difference, language)}
					</Evaporate>
				)}{' '}
				{children}
			</span>
		</>
	)
}

const Evaporate = React.memo(
	({ children, style }: { children: string; style: object }) => (
		<span key={children} style={style} className="evaporate">
			{children}
		</span>
	)
)
