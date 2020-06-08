import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Engine from 'publicodes'
import formulaire from './formulaire-détachement.yaml'
import RuleInput from 'Components/conversation/RuleInput'
import * as Animate from 'Components/ui/animate'
import { Explicable } from 'Components/conversation/Explicable'
import { Markdown } from 'Components/utils/markdown'
import { uniq } from 'ramda'
import InfoBulle from 'Components/ui/InfoBulle'
export default function FormulaireDétachementIndépendant() {
	const engine = new Engine(formulaire)
	return (
		<>
			<FormulairePublicodes engine={engine} dottedName="formulaire" />
		</>
	)
}

const titleTags = ['h1']

function FormulairePublicodes({ engine }) {
	const [situation, setSituation] = useState({})
	engine.setSituation(situation)
	const onChange = useCallback(
		dottedName => value =>
			setSituation({
				...situation,
				[dottedName]: value
			}),
		[setSituation, situation]
	)
	const rules = engine.getParsedRules()
	return (
		<Animate.fromTop>
			{Object.entries(formulaire).map(([name, value]) => {
				const rule = rules[name]
				const node = engine.evaluate(name)
				if (node.isApplicable === false || node.isApplicable === null) {
					return
				}
				return (
					<Animate.fromTop key={name}>
						{rule.type === 'groupe' ? (
							<>
								{React.createElement(
									`h${Math.min(name.split(' . ').length + 1, 6)}`,
									{},
									rule.title
								)}
								{rule.description && <Markdown source={rule.description} />}
							</>
						) : (
							<label
								css={`
									display: block;
								`}
							>
								{rule.question ? (
									<div
										css={`
											margin-top: 0.6rem;
										`}
									>
										{rule.question}
									</div>
								) : (
									<small>{rule.title} </small>
								)}
								{rule.description && (
									<InfoBulle>
										<Markdown source={rule.description} />
									</InfoBulle>
								)}

								<RuleInput
									key={name}
									dottedName={name}
									rules={rules}
									value={situation[name]}
									onChange={onChange(name)}
								/>
							</label>
						)}
					</Animate.fromTop>
				)
			})}
		</Animate.fromTop>
	)
}
