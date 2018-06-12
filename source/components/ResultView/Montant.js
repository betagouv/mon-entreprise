/* @flow */
import React from 'react'
import withLanguage from '../withLanguage'
import './Montant.css'

type Props = {
	children: number,
	className?: string,
	style?: { [string]: string }
} & ConnectedProps

type ConnectedProps = {
	language: string
}

const Montant = ({
	language,
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
					maximumFractionDigits: 2,
					minimumFractionDigits: 2
			  }).format(value)}
	</span>
)

export default withLanguage(Montant)
