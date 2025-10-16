import { ASTNode, formatValue } from 'publicodes'
import { useTranslation } from 'react-i18next'
import { keyframes, styled } from 'styled-components'

import { DottedName } from '@/domaine/publicodes/DottedName'

import RuleLink from '../RuleLink'
import { useEngine } from '../utils/EngineContext'
import { ValueProps } from './types'

export default function Value<Names extends string>({
	expression,
	unit,
	engine,
	displayedUnit,
	flashOnChange = false,
	precision,
	documentationPath,
	linkToRule = true,
	...props
}: ValueProps<Names>) {
	const { language, t } = useTranslation().i18n
	if (expression === null) {
		throw new TypeError('expression cannot be null')
	}
	const defaultEngine = useEngine()
	const e = engine ?? defaultEngine
	const isRule =
		typeof expression === 'string' && expression in e.getParsedRules()

	const evaluation = e.evaluate({
		valeur: expression,
		...(unit && { unité: unit }),
	})

	const value = formatValue(evaluation, {
		displayedUnit,
		language,
		precision,
	}) as string

	if (isRule && linkToRule) {
		const ruleEvaluation = e.evaluate(expression)
		let dottedName = expression as DottedName
		if (ruleEvaluation.sourceMap?.mecanismName === 'replacement') {
			dottedName = (
				ruleEvaluation.sourceMap.args.originalNode as ASTNode<'reference'>
			).dottedName as DottedName
		}

		return (
			<RuleLink
				dottedName={dottedName}
				documentationPath={documentationPath}
				aria-label={t(
					'composants.engine-value.voir-la-documentation',
					'Voir la documentation du calcul de {{valeur}}',
					{ valeur: value.replace(/(\d)\s+(\d)/g, '$1$2') }
				)}
			>
				<StyledValue {...props} key={value} $flashOnChange={flashOnChange}>
					{value}
				</StyledValue>
			</RuleLink>
		)
	}

	return (
		<StyledValue {...props} key={value} $flashOnChange={flashOnChange}>
			{value}
		</StyledValue>
	)
}

const flash = keyframes`

	from {
    background-color: white;
		opacity: 0.8;
  }

		to {
			background-color: transparent;
		}

`

export const StyledValue = styled.span<{ $flashOnChange: boolean }>`
	animation: ${flash} 0.2s 1;
	will-change: background-color, opacity;
`
