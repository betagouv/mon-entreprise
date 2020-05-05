import { toPairs } from 'ramda'
import React, { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { defaultUnitsSelector } from 'Selectors/analyseSelectors'
import { convertUnit, parseUnit, Unit } from '../../engine/units'
import { ThemeColorsContext } from 'Components/utils/colors'
import emoji from 'react-easy-emoji'

/* This component helps input a value that is not known by suggesting another input to the user. This new input will be multiplied by 12 (to convert from month to year) and then by the inputEstimation's formule attribute.
 *
 * It's orginiated from the estimation of an annual energy bill kWh from the monthly cost in €
 *
 * This is **highly hardcoded** for now, and the estimator can't yet be computed (since getInputComponent.js is passed non-evaluated flatRules,
 * but it could easily be made into a generic input helper */

export default function InputEstimation({ inputEstimation, setFinalValue }) {
	if (typeof inputEstimation?.formule !== 'number') return null
	const [value, setValue] = useState('')
	const colors = useContext(ThemeColorsContext)

	return (
		<div
			css={`
				margin-top: 1rem;
				input {
					margin-top: 0.4rem;
					border: 1px dashed ${colors.color} !important;
				}
				display: flex;
				justify-content: left;
				align-items: center;
				img {
					font-size: 230%;
					margin-right: 0.6rem !important;
				}
			`}
		>
			<span>{emoji('💡')} </span>
			<span>
				<div>{inputEstimation.question}</div>
				<div>
					<input
						type="number"
						min="0"
						max="1000000"
						step="1"
						value={value}
						onChange={(e) => {
							setValue(e.target.value)
							setFinalValue(
								Math.round(12 * (+e.target.value / inputEstimation.formule))
							)
						}}
					/>
					<span>€</span>
				</div>
			</span>
		</div>
	)
}
