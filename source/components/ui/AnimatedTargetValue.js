/* @flow */
import React, { useRef } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from 'Engine/format'
import { usePeriod } from 'Selectors/analyseSelectors'
import './AnimatedTargetValue.css'

type Props = {
	value: ?number
}

function formatDifference(difference, language) {
	const prefix = difference > 0 ? '+' : ''
	return prefix + formatCurrency(difference, language)
}

export default function AnimatedTargetValue({ value, children }: Props) {
	const previousValue = useRef()
	const { language } = useTranslation().i18n

	// We don't want to show the animated if the difference comes from a change in the period
	const currentPeriod = usePeriod()
	const previousPeriod = useRef(currentPeriod)

	const difference =
		previousValue.current === value || Number.isNaN(value)
			? null
			: (value || 0) - (previousValue.current || 0)
	const shouldDisplayDifference =
		difference !== null &&
		previousPeriod.current === currentPeriod &&
		Math.abs(difference) > 1

	previousValue.current = value
	previousPeriod.current = currentPeriod

	return (
		<>
			<span className="Rule-value">
				{shouldDisplayDifference && (
					<Evaporate
						style={{
							color: difference > 0 ? 'chartreuse' : 'red',
							pointerEvents: 'none'
						}}>
						{formatDifference(difference, language)}
					</Evaporate>
				)}{' '}
				{children}
			</span>
		</>
	)
}

const Evaporate = React.memo(
	({ children, style }: { children: string, style: Object }) => (
		<ReactCSSTransitionGroup
			transitionName="evaporate"
			transitionEnterTimeout={2500}
			transitionLeaveTimeout={1}>
			<span key={children} style={style} className="evaporate">
				{children}
			</span>
		</ReactCSSTransitionGroup>
	)
)
