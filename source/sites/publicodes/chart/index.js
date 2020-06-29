import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import {
	analysisWithDefaultsSelector,
	parsedRulesSelector,
} from 'Selectors/analyseSelectors'
import { getRuleFromAnalysis, encodeRuleName } from 'Engine/rules'
import Bar from './Bar'
import { sortBy } from 'ramda'
import { Link } from 'react-router-dom'

const showBudget = false
const // Rough estimate of the 2050 budget per person to stay under 2° by 2100
	climateBudgetPerYear = 2000,
	climateBudgetPerDay = climateBudgetPerYear / 365,
	// Based on current share of the annual mean of 12 ton per french
	// Source : http://ravijen.fr/?p=440
	transportShare = 1 / 4,
	transportClimateBudget = climateBudgetPerDay * transportShare

const sortCategories = sortBy(({ nodeValue }) => -nodeValue)
export const extractCategories = (analysis) => {
	const getRule = getRuleFromAnalysis(analysis)

	const bilan = getRule('bilan')
	if (!bilan) return null
	const categories = bilan.formule.explanation.explanation.map(
		(category) => category.explanation
	)

	return sortCategories(categories)
}
export default ({ details, color, noText, noAnimation }) => {
	const analysis = useSelector(analysisWithDefaultsSelector),
		rules = useSelector(parsedRulesSelector)

	const categories = analysis?.targets.length
		? extractCategories(analysis)
		: details &&
		  sortCategories(
				rules['bilan'].formule.explanation.explanation.map((reference) => {
					const category = rules[reference.dottedName]
					return {
						...category,
						nodeValue: details[category.name[0]],
					}
				})
		  )
	if (!categories) return null

	const empreinteMaximum = categories.reduce(
		(memo, next) => (memo.nodeValue > next.nodeValue ? memo : next),
		-1
	).nodeValue

	return (
		<section
			css={`
				h2 {
					margin: 0.6rem 0 0.1rem;
					font-size: 140%;
				}
				padding: 0;
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
							max-width: 35rem;
						}
					`}
				>
					{categories.map((category) => (
						<motion.li
							layoutTransition={
								noAnimation
									? null
									: {
											type: 'spring',
											damping: 100,
											stiffness: 100,
									  }
							}
							key={category.title}
							css={`
								margin: 0.4rem 0;
								list-style-type: none;
								> a {
									display: block;
									text-decoration: none;
									line-height: inherit;
								}
							`}
						>
							<Link
								to={'/documentation/' + encodeRuleName(category.dottedName)}
							>
								<Bar {...{ ...category, color, noText, empreinteMaximum }} />
							</Link>
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
