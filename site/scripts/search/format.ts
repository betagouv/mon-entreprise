import { ParsedRules } from 'publicodes'

import { NomModèle } from '@/domaine/SimulationConfig'
import { SimulatorData } from '@/pages/simulateurs-et-assistants/metadata-src'

export const formatRulesToAlgolia = (
	rules: ParsedRules<string>,
	nomModèle?: NomModèle
) =>
	Object.entries(rules)
		.map(([dottedName, rule]) => {
			if (!rule) {
				return false
			}

			const objectID = nomModèle ? `${nomModèle} . ${dottedName}` : dottedName
			const path = dottedName.split(' . ')
			const namespace = path.slice(0, -1)
			const {
				title,
				rawNode: { icônes = '', description, acronyme, résumé },
			} = rule
			const ruleName = `${title} ${' ' + icônes}`.trim()

			return {
				objectID,
				nomModèle: nomModèle || 'modele-social',
				dottedName,
				path,
				ruleName,
				namespace,
				pathDepth: path.length,
				acronyme,
				titre: title,
				icone: icônes,
				description: description || résumé,
			}
		})
		.filter(<T>(value: T | false): value is T => Boolean(value))

export const formatSimulationDataToAlgolia = (
	simulations: Omit<SimulatorData, 'component'>
) =>
	Object.entries(simulations)
		.filter(
			([, simulation]) =>
				!(
					typeof simulation === 'object' &&
					'private' in simulation &&
					simulation.private === true
				)
		)
		.map(([id, simulation]) => ({
			...simulation,
			objectID: id,
			title:
				('title' in simulation && simulation.title) ||
				simulation.shortName ||
				simulation.meta.title,
			tooltip: ('tooltip' in simulation && simulation.tooltip) || '',
			description: simulation.meta?.description,
		}))

export type AlgoliaRule = ReturnType<typeof formatRulesToAlgolia>[number]
export type AlgoliaSimulateur = ReturnType<
	typeof formatSimulationDataToAlgolia
>[number]

export type AlgoliaData = {
	rules: AlgoliaRule[]
	simulateurs: AlgoliaSimulateur[]
}
