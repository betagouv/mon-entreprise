/* @flow */
import React from 'react'
import withLanguage from '../withLanguage'
import './Montant.css'

type Props = {
	children: number,
	className?: string,
	type: 'currency' | 'percent',
	style?: { [string]: string },
	numFractionDigit?: number
} & ConnectedProps

type ConnectedProps = {
	language: string
}

const Montant = ({
	language,
	numFractionDigit = 2,
	children: value,
	className = '',
	type = 'currency',
	style = {}
}: Props) => (
	<span className={'montant ' + className} style={style}>
		{value === 0
			? '—'
			: Intl.NumberFormat(language, {
					style: type,
					currency: 'EUR',
					maximumFractionDigits: numFractionDigit,
					minimumFractionDigits: numFractionDigit
			  }).format(value)}
	</span>
)

export default withLanguage(Montant)
