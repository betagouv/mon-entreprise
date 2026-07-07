import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { TrackPage } from '@/components/PianoAnalytics/index'
import {
	auMoinsUneSalariée,
	chaqueSalariéeAAuMoinsUneDéclaration,
	chaqueSalariéeAMAEstValide,
	chaqueSalariéeGEDEstValide,
	estEnfantsÀChargeValide,
	estInformationsValides,
	estSalariéesValide,
	useCMG,
} from '@/contextes/cmg/index'
import { useGetPath } from '@/hooks/useGetPath'
import { useNavigation } from '@/lib/navigation/index'

import AMA from '../components/AMA/AMA'
import QuestionModesDeGarde from '../components/declaration/QuestionModesDeGarde'
import GED from '../components/GED/GED'
import Navigation from '../components/Navigation'
import { MessageFormulaireInvalide } from '../components/styled-components'

export default function Déclarations() {
	const { navigate } = useNavigation()
	const { t } = useTranslation()
	const { raisonsInéligibilité, situation, salarieesAMA, salarieesGED } =
		useCMG()
	const getPath = useGetPath()

	useEffect(() => {
		if (
			!estInformationsValides(situation) ||
			!estEnfantsÀChargeValide(situation.enfantsÀCharge)
		) {
			navigate(getPath('assistants.cmg'), { replace: true })
		}

		if (raisonsInéligibilité.length) {
			navigate(getPath('assistants.cmg.inéligibilité'), { replace: true })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const isSuivantDisabled = !estSalariéesValide(situation.salariees)

	return (
		<>
			<TrackPage chapter3="pas_a_pas" name="declarations" />

			<QuestionModesDeGarde />

			{!!salarieesAMA.length && <AMA />}
			{!!salarieesGED.length && <GED />}

			<Navigation
				précédent="enfants"
				suivant="résultat"
				isSuivantDisabled={isSuivantDisabled}
			/>

			{isSuivantDisabled && (
				<MessageFormulaireInvalide>
					{!auMoinsUneSalariée(situation.salariees) && (
						<>
							{t(
								'pages.assistants.cmg.declarations.erreurs.aucune-salariee',
								'Il doit y avoir au moins une salariee.'
							)}
							<br />
						</>
					)}
					{!chaqueSalariéeAAuMoinsUneDéclaration(situation.salariees) && (
						<>
							{t(
								'pages.assistants.cmg.declarations.erreurs.aucune-declaration',
								'Chaque salariee doit avoir au moins une declaration.'
							)}
							<br />
						</>
					)}
					{!chaqueSalariéeAMAEstValide(situation.salariees) && (
						<>
							{t(
								'pages.assistants.cmg.declarations.erreurs.declarations-AMA-invalides',
								'Chaque declaration d’assistante maternelle doit avoir au moins un enfant gardé, un nombre d’heures de garde et une rémunération.'
							)}
							<br />
						</>
					)}
					{!chaqueSalariéeGEDEstValide(situation.salariees) && (
						<>
							{t(
								'pages.assistants.cmg.declarations.erreurs.declarations-GED-invalides',
								'Chaque declaration de garde d’enfants à domicile doit avoir un nombre d’heures de garde et une rémunération.'
							)}
							<br />
						</>
					)}
				</MessageFormulaireInvalide>
			)}
		</>
	)
}
