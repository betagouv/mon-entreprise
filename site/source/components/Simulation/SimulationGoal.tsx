import { DottedName } from 'modele-social'
import { formatValue } from 'publicodes'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput from '@/components/conversation/RuleInput'
import RuleLink from '@/components/RuleLink'
import { ObjectifDeSimulation } from '@/components/Simulation/ObjectifDeSimulation'
import { ObjectifSaisissableDeSimulation } from '@/components/Simulation/ObjectifSaisissableDeSimulation'
import { useEngine } from '@/components/utils/EngineContext'
import { normalizeRuleName } from '@/components/utils/normalizeRuleName'
import { MontantAdapter } from '@/domaine/engine/MontantAdapter'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { Montant } from '@/domaine/Montant'
import { UnitéMonétaire } from '@/domaine/Unités'
import { ajusteLaSituation } from '@/store/actions/actions'
import { targetUnitSelector } from '@/store/selectors/simulationSelectors'

type SimulationGoalProps = {
	dottedName: DottedName
	label?: React.ReactNode
	small?: boolean
	appear?: boolean
	editable?: boolean
	isTypeBoolean?: boolean
	displayedUnit?: string
	isInfoMode?: boolean
	round?: boolean
	onUpdateSituation?: (name: DottedName, value?: ValeurPublicodes) => void
}

export function SimulationGoal({
	dottedName,
	label,
	onUpdateSituation,
	displayedUnit,
	small = false,
	round = true,
	appear = true,
	editable = true,
	isTypeBoolean = false,
	isInfoMode = false,
}: SimulationGoalProps) {
	const dispatch = useDispatch()
	const engine = useEngine()
	const currentUnit = useSelector(targetUnitSelector)
	const language = useTranslation().i18n.language

	const evaluation = engine.evaluate({
		valeur: dottedName,
		arrondi: round ? 'oui' : 'non',
		...(!isTypeBoolean ? { unité: currentUnit } : {}),
	})

	const rule = engine.getRule(dottedName)

	const onChange = useCallback(
		(x?: ValeurPublicodes) => {
			const montantDansLaBonneUnité: Montant | undefined =
				x === undefined
					? undefined
					: {
							...(x as Montant),
							unité: currentUnit as UnitéMonétaire,
					  }

			dispatch(
				ajusteLaSituation({ [dottedName]: montantDansLaBonneUnité } as Record<
					DottedName,
					ValeurPublicodes
				>)
			)
			onUpdateSituation?.(dottedName, montantDansLaBonneUnité)
		},
		[dispatch, onUpdateSituation, dottedName, currentUnit]
	)

	if (evaluation.nodeValue === null) {
		return null
	}

	if (small && !editable && evaluation.nodeValue === undefined) {
		return null
	}

	const titreTexte = label || rule.title

	const titre = isInfoMode ? (
		titreTexte
	) : (
		<RuleLinkAccessible dottedName={dottedName}>
			{titreTexte}
		</RuleLinkAccessible>
	)

	const description = rule.rawNode.résumé || undefined

	const valeurFormatee = formatValue(evaluation, {
		displayedUnit,
		precision: round ? 0 : 2,
		language,
	}) as string

	const valeurMontant = MontantAdapter.decode(evaluation)

	const editeur = editable ? (
		<RuleInput
			modifiers={
				!isTypeBoolean
					? {
							unité: currentUnit,
					  }
					: undefined
			}
			hideDefaultValue
			displayedUnit={displayedUnit}
			dottedName={dottedName}
			onChange={onChange}
			missing={dottedName in evaluation.missingVariables}
			small={small}
			formatOptions={{
				maximumFractionDigits: round ? 0 : 2,
			}}
		/>
	) : undefined

	const rendreEditeur = editable ? () => editeur : undefined

	// Pour les cas où la valeur n'est pas un nombre, on utilise le format texte
	const valeur = isTypeBoolean ? valeurFormatee : valeurMontant

	if (editable) {
		return (
			<ObjectifSaisissableDeSimulation
				id={dottedName.replace(/\s|\./g, '_')}
				titre={titre}
				description={description}
				valeur={valeurMontant}
				rendreChampSaisie={rendreEditeur as () => React.ReactNode}
				isInfoMode={isInfoMode}
				small={small}
				appear={appear}
			/>
		)
	}

	return (
		<ObjectifDeSimulation
			id={dottedName.replace(/\s|\./g, '_')}
			titre={titre}
			description={description}
			valeur={valeur}
			displayedUnit={displayedUnit}
			isInfoMode={isInfoMode}
			small={small}
			appear={appear}
			explication={<ExplicableRule dottedName={dottedName} light />}
		/>
	)
}

const RuleLinkAccessible = styled(RuleLink)`
	font-size: ${({ theme }) => theme.fontSizes.lg};

	&:hover {
		color: ${({ theme }) => theme.colors.extended.grey[300]};
	}
`
