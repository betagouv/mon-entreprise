/* @flow */
import React, { useRef } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from 'Engine/format'
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

	const difference =
		previousValue.current === value || Number.isNaN(value)
			? null
			: (value || 0) - (previousValue.current || 0)
	previousValue.current = value
	const shouldDisplayDifference =
		difference !== null && Math.abs(difference) > 1

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
