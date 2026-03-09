import { ASTNode, reduceAST } from 'publicodes'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { Condition } from '@/components/EngineValue/Condition'
import Value from '@/components/EngineValue/Value'
import RuleLink from '@/components/RuleLink'
import { FromTop } from '@/components/ui/animate'
import { Emoji, SmallBody } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'
import { useEngine } from '@/utils/publicodes/EngineContext'

export default function Aides() {
	const targetUnit = useSelector(targetUnitSelector)
	const dottedName = 'salarié . coût total employeur . aides' as DottedName
	const engine = useEngine()
	const aides = engine.getRule(dottedName)
	// Dans le cas où il n'y a qu'une seule aide à l'embauche qui s'applique, nous
	// faisons un lien direct vers cette aide, plutôt qu'un lien vers la liste qui
	// est une somme des aides qui sont toutes nulle sauf l'aide active.
	const aideLink = reduceAST(
		(acc, node) => {
			if (node.sourceMap?.mecanismName === 'somme') {
				const aidesNotNul =
					(node.sourceMap?.args.valeur as ASTNode[])
						.map((n) => engine.evaluate(n))
						.filter(({ nodeValue }) => nodeValue !== false) ?? []
				if (aidesNotNul.length === 1 && 'dottedName' in aidesNotNul[0]) {
					return aidesNotNul[0].dottedName as DottedName
				} else {
					return acc
				}
			}
		},
		dottedName,
		aides
	)

	return (
		<Condition expression={`${dottedName} > 0`}>
			<FromTop>
				<StyledInfo>
					<RuleLink dottedName={aideLink}>
						<Trans i18nKey="pages.simulateurs.salarié.aides">
							en incluant{' '}
							<Value
								expression={dottedName}
								displayedUnit="€"
								unit={targetUnit}
								linkToRule={false}
							/>{' '}
							d'aides
						</Trans>{' '}
						<Emoji emoji={aides.rawNode.icônes as string} />
					</RuleLink>
				</StyledInfo>
			</FromTop>
		</Condition>
	)
}

const StyledInfo = styled(SmallBody)`
	position: relative;
	text-align: right;
	margin-top: -1.5rem;
	margin-bottom: 1.5rem;
	right: 0;
	z-index: 3;
`
