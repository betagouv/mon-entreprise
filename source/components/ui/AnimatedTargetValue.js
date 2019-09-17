/* @flow */
import React, { useEffect, useState } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { useTranslation } from 'react-i18next'
import './AnimatedTargetValue.css'
import { formatCurrency } from 'Components/TargetSelection'

type Props = {
	value: ?number
}

export default function AnimatedTargetValue({ value, children }: Props) {
	const [difference, setDifference] = useState(0)
	const [previousValue, setPreviousValue] = useState()
	useEffect(() => {
		if (previousValue === value || Number.isNaN(value)) {
			return
		}
		setDifference((value || 0) - (previousValue || 0))
		setPreviousValue(value)
	}, [previousValue, value])
	const { i18n } = useTranslation()

	const formattedDifference = formatCurrency(difference, i18n.language)
	const shouldDisplayDifference =
		Math.abs(difference) > 1 && value != null && !Number.isNaN(value)
	return (
		<>
			<span className="Rule-value">
				{shouldDisplayDifference && (
					<Evaporate
						style={{
							color: difference > 0 ? 'chartreuse' : 'red',
							pointerEvents: 'none'
						}}>
						{(difference > 0 ? '+' : '') + formattedDifference}
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
