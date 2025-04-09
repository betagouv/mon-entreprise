import { Option } from 'effect'
import { DottedName } from 'modele-social'
import { formatValue, PublicodesExpression } from 'publicodes'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput, { InputProps } from '@/components/conversation/RuleInput'
import RuleLink from '@/components/RuleLink'
import { ObjectifDeSimulation } from '@/components/Simulation/ObjectifDeSimulation'
import { ObjectifSaisissableDeSimulation } from '@/components/Simulation/ObjectifSaisissableDeSimulation'
import { useEngine } from '@/components/utils/EngineContext'
import { normalizeRuleName } from '@/components/utils/normalizeRuleName'
import { SimpleRuleEvaluation } from '@/domaine/engine/SimpleRuleEvaluation'
import {
	eurosParAn,
	eurosParHeure,
	eurosParJour,
	eurosParMois,
	Montant,
} from '@/domaine/Montant'
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
	onUpdateSituation?: (
		name: DottedName,
		...rest: Parameters<InputProps['onChange']>
	) => void
}

export function SimulationGoal({
	dottedName,
	label,
	onUpdateSituation,
	displayedUnit = '€',
	small = false,
	round = true,
	appear = true,
	editable = true,
	isTypeBoolean = false, // TODO : remove when type inference works in publicodes
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
		(x?: PublicodesExpression) => {
			dispatch(
				ajusteLaSituation({ [dottedName]: x } as Record<
					DottedName,
					SimpleRuleEvaluation
				>)
			)
			onUpdateSituation?.(dottedName, x)
		},
		[dispatch, onUpdateSituation, dottedName]
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
		<RuleLink dottedName={dottedName}>{titreTexte}</RuleLink>
	)

	const description = rule.rawNode.résumé || undefined

	// Pour la compatibilité avec l'ancienne API
	const valeurFormatee = formatValue(evaluation, {
		displayedUnit,
		precision: round ? 0 : 2,
		language,
	}) as string

	// Conversion de la valeur en Option<Montant>
	const valeurMontant =
		typeof evaluation.nodeValue === 'number'
			? (() => {
					const valeur = evaluation.nodeValue
					switch (currentUnit) {
						case '€/an':
							return Option.some(eurosParAn(valeur))
						case '€/mois':
							return Option.some(eurosParMois(valeur))
						case '€/jour':
							return Option.some(eurosParJour(valeur))
						case '€/heure':
							return Option.some(eurosParHeure(valeur))
						default:
							return Option.some(eurosParAn(valeur))
					}
			  })()
			: Option.none<Montant>()

	const editeur = editable ? (
		<RuleInput
			modifiers={
				!isTypeBoolean
					? {
							unité: currentUnit,
					  }
					: undefined
			}
			aria-describedby={
				description ? normalizeRuleName.Description(dottedName) : undefined
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
			isInfoMode={isInfoMode}
			small={small}
			appear={appear}
			explication={<ExplicableRule dottedName={dottedName} light />}
		/>
	)
}
