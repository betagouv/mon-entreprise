/* @flow */
import React from 'react'
import withLanguage from '../withLanguage'
import './Montant.css'

type Props = {
	children: number,
	className?: string,
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
	style = {}
}: Props) => (
	<span className={'montant ' + className} style={style}>
		{value === 0
			? '—'
			: Intl.NumberFormat(language, {
					style: 'currency',
					currency: 'EUR',
					maximumFractionDigits: numFractionDigit,
					minimumFractionDigits: numFractionDigit
			  }).format(value)}
	</span>
)

export default withLanguage(Montant)
