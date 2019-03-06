/* @flow */
import withLanguage from 'Components/utils/withLanguage'
import { memoizeWith } from 'ramda'
import React from 'react'
import './Montant.css'

type Props = {
	children: number,
	className?: string,
	type: 'currency' | 'percent' | 'decimal',
	style?: { [string]: string },
	numFractionDigit?: number
} & ConnectedProps

type ConnectedProps = {
	language: string
}

const NumberFormat = memoizeWith(
	(...args) => JSON.stringify(args),
	Intl.NumberFormat
)

const Montant = ({
	language,
	numFractionDigit = 2,
	children: value,
	className = '',
	style = {}
}: Props) => (
	<span className={'montant ' + className} style={style}>
		{value === 0 || Number.isNaN(value) ? '—' : value}
	</span>
)

export default withLanguage(Montant)
