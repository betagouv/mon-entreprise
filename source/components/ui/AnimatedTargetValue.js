/* @flow */
import React, { useEffect, useState } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { useTranslation } from 'react-i18next'
import './AnimatedTargetValue.css'

type Props = {
	value: ?number
}

export default function AnimatedTargetValue({ value }: Props) {
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

	const format = value => {
		return value == null
			? ''
			: Intl.NumberFormat(i18n.language, {
					style: 'currency',
					currency: 'EUR',
					maximumFractionDigits: 0,
					minimumFractionDigits: 0
			  }).format(value)
	}

	const formattedDifference = format(difference)
	const shouldDisplayDifference =
		Math.abs(difference) > 1 && value != null && !Number.isNaN(value)
	return (
		<>
			<span className="Rule-value">
				{shouldDisplayDifference && (
					<Evaporate
						style={{
							color: difference > 0 ? 'chartreuse' : 'red'
						}}>
						{(difference > 0 ? '+' : '') + formattedDifference}
					</Evaporate>
				)}{' '}
				<span>{Number.isNaN(value) ? '—' : format(value)}</span>
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
