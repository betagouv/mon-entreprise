import { Option } from 'effect'
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'

import { PARAMÈTRE_SITUATION } from '@/domaine/parametre-situation'
import { NomModèle } from '@/domaine/PublicodesSimulationConfig'
import { useNavigation } from '@/lib/navigation'

import { ModèleComparable } from '../domaine/modeleComparable'
import {
	initialSituationComparée,
	simulationEstCommencée,
	SituationComparée,
} from '../domaine/situation'
import {
	decodeSituation,
	encodeSituation,
} from '../domaine/situationQueryString'

type Comparaison = Array<
	ModèleComparable['get'] & {
		nomModèle: NomModèle
	}
>
type SituationContextType = {
	modèles: ModèleComparable[]
	situation: SituationComparée
	updateSituation: (
		updater: (prev: SituationComparée) => SituationComparée
	) => void
	comparaison: Comparaison
}

const SituationContext = createContext<SituationContextType | null>(null)

export const ComparateurProvider: React.FC<{
	modèles: ModèleComparable[]
	children: React.ReactNode
}> = ({ modèles, children }) => {
	const { searchParams, setSearchParams } = useNavigation()

	const [situation, setSituation] = useState<SituationComparée>(() => {
		const encodée = searchParams.get(PARAMÈTRE_SITUATION)

		return encodée ? decodeSituation(encodée) : initialSituationComparée
	})

	const [comparaison, setComparaison] = useState<Comparaison>([])

	useEffect(() => {
		modèles.forEach((modèle) => {
			modèle.set.situation(situation)
		})

		if (Option.isSome(situation.chiffreDAffaires)) {
			setComparaison(
				modèles.map((modèle) => ({
					nomModèle: modèle.nom,
					...modèle.get,
				}))
			)
		}
	}, [modèles, situation])

	useEffect(() => {
		const encodée = simulationEstCommencée(situation)
			? encodeSituation(situation)
			: null
		if (searchParams.get(PARAMÈTRE_SITUATION) === encodée) {
			return
		}
		setSearchParams(
			(précédents) => {
				const suivants = new URLSearchParams(précédents)
				if (encodée === null) {
					suivants.delete(PARAMÈTRE_SITUATION)
				} else {
					suivants.set(PARAMÈTRE_SITUATION, encodée)
				}

				return suivants
			},
			{ replace: true }
		)
	}, [situation, searchParams, setSearchParams])

	const updateSituation = useCallback(
		(updater: (prev: SituationComparée) => SituationComparée) =>
			setSituation(updater),
		[]
	)

	const value = { modèles, situation, updateSituation, comparaison }

	return (
		<SituationContext.Provider value={value}>
			{children}
		</SituationContext.Provider>
	)
}

export const useSituationContext = () => {
	const context = useContext(SituationContext)
	if (!context) {
		throw new Error(
			'useSituationContext doit être utilisé dans un ComparateurProvider'
		)
	}

	return context
}
