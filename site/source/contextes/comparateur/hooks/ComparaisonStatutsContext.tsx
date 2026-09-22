import { Option } from 'effect'
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'

import {
	isPériodeDeCalcul,
	PériodeDeCalcul,
} from '@/components/Simulateur/ChoixPeriodeDeCalcul'
import { PARAMÈTRE_SITUATION, PARAMÈTRE_UNITÉ } from '@/domaine/parametresUrl'
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
	unité: PériodeDeCalcul
	setUnité: (unité: PériodeDeCalcul) => void
	comparaison: Comparaison
}

const SituationContext = createContext<SituationContextType | null>(null)

export const ComparateurProvider: React.FC<{
	modèles: ModèleComparable[]
	children: React.ReactNode
}> = ({ modèles, children }) => {
	const { searchParams, setSearchParams } = useNavigation()

	const [unité, setUnité] = useState<PériodeDeCalcul>(() => {
		const sauvegardée = searchParams.get(PARAMÈTRE_UNITÉ)

		return isPériodeDeCalcul(sauvegardée) ? sauvegardée : '€/an'
	})

	const [situation, setSituation] = useState<SituationComparée>(() => {
		const encodée = searchParams.get(PARAMÈTRE_SITUATION)

		return encodée ? decodeSituation(encodée, unité) : initialSituationComparée
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
		const simulationCommencée = simulationEstCommencée(situation)
		const currentSituationEncodée = searchParams.get(PARAMÈTRE_SITUATION)

		if (!simulationCommencée && currentSituationEncodée !== null) {
			setSearchParams({}, { replace: true })
		} else if (simulationCommencée) {
			const currentUnité = searchParams.get(PARAMÈTRE_UNITÉ)
			const situationEncodée = encodeSituation(situation)

			if (
				currentSituationEncodée === situationEncodée &&
				currentUnité === unité
			) {
				return
			}

			setSearchParams(
				{
					[PARAMÈTRE_SITUATION]: situationEncodée,
					[PARAMÈTRE_UNITÉ]: unité,
				},
				{ replace: true }
			)
		}
	}, [situation, searchParams, setSearchParams, unité])

	const updateSituation = useCallback(
		(updater: (prev: SituationComparée) => SituationComparée) =>
			setSituation(updater),
		[]
	)

	const value = {
		modèles,
		situation,
		updateSituation,
		comparaison,
		unité,
		setUnité,
	}

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
