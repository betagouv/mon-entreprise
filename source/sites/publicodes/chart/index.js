import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import { getRuleFromAnalysis } from 'Engine/rules'
import Bar from './Bar'
import { sortBy } from 'ramda'

const showBudget = false
const // Rough estimate of the 2050 budget per person to stay under 2° by 2100
	climateBudgetPerYear = 2000,
	climateBudgetPerDay = climateBudgetPerYear / 365,
	// Based on current share of the annual mean of 12 ton per french
	// Source : http://ravijen.fr/?p=440
	transportShare = 1 / 4,
	transportClimateBudget = climateBudgetPerDay * transportShare

export default ({}) => {
	const analysis = useSelector(analysisWithDefaultsSelector)
	const getRule = getRuleFromAnalysis(analysis)

	const micmac = getRule('micmac')
	if (!micmac) return null

	const categories = sortBy(
		({ nodeValue }) => -nodeValue,
		micmac.formule.explanation.explanation.map(
			(category) => category.explanation
		)
	)

	const empreinteMaximum = categories.reduce(
		(memo, next) => (memo.nodeValue > next.nodeValue ? memo : next),
		-1
	).nodeValue

	console.log(categories)

	return (
		<section
			css={`
				h2 {
					margin: 0.6rem 0 0.1rem;
					font-size: 140%;
				}
			`}
		>
			<div
				css={`
					position: relative;
				`}
			>
				<span
					css={`
				${!showBudget ? 'display: none' : ''}
				height: 100%;
				left: 0;
				z-index: -1;
				left: ${((transportClimateBudget * 1000) / empreinteMaximum) * 100 * 0.9}%;

				width: 0px;
				border-right: 8px dotted yellow;
		        position: absolute;
				margin-top: 2rem;
				}
					`}
					key="budget"
				></span>
				<ul
					css={`
						margin-left: 2rem;

						@media (min-width: 800px) {
							width: 35rem;
						}
					`}
				>
					{categories.map((category) => (
						<motion.li
							layoutTransition={{
								type: 'spring',
								damping: 100,
								stiffness: 100,
							}}
							key={category.title}
							css="margin: .3rem 0; list-style-type: none; cursor: pointer"
						>
							<Bar {...{ ...category, empreinteMaximum }} />
						</motion.li>
					))}
				</ul>
			</div>
			{showBudget && (
				<span css=" background: yellow ;">
					Budget climat 1 journée {transportClimateBudget.toFixed(1)} kg
				</span>
			)}
		</section>
	)
}
