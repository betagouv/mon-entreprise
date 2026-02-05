import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { TrackPage } from '@/components/ATInternetTracking'
import { useNavigate } from '@/lib/navigation'
import {
	auMoinsUneSalariée,
	chaqueSalariéeAAuMoinsUneDéclaration,
	chaqueSalariéeAMAEstValide,
	chaqueSalariéeGEDEstValide,
	estEnfantsÀChargeValide,
	estInformationsValides,
	estSalariéesValide,
	useCMG,
} from '@/contextes/cmg'
import { useGetPath } from '@/hooks/useGetPath'

import AMA from '../components/AMA/AMA'
import QuestionModesDeGarde from '../components/déclaration/QuestionModesDeGarde'
import GED from '../components/GED/GED'
import Navigation from '../components/Navigation'
import { MessageFormulaireInvalide } from '../components/styled-components'

export default function Déclarations() {
	const navigate = useNavigate()
	const { t } = useTranslation()
	const { raisonsInéligibilité, situation, salariéesAMA, salariéesGED } =
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

	const isSuivantDisabled = !estSalariéesValide(situation.salariées)

	return (
		<>
			<TrackPage chapter3="pas_a_pas" name="déclarations" />

			<QuestionModesDeGarde />

			{!!salariéesAMA.length && <AMA />}
			{!!salariéesGED.length && <GED />}

			<Navigation
				précédent="enfants"
				suivant="résultat"
				isSuivantDisabled={isSuivantDisabled}
			/>

			{isSuivantDisabled && (
				<MessageFormulaireInvalide>
					{!auMoinsUneSalariée(situation.salariées) && (
						<>
							{t(
								'pages.assistants.cmg.déclarations.erreurs.aucune-salariée',
								'Il doit y avoir au moins une salariée.'
							)}
							<br />
						</>
					)}
					{!chaqueSalariéeAAuMoinsUneDéclaration(situation.salariées) && (
						<>
							{t(
								'pages.assistants.cmg.déclarations.erreurs.aucune-déclaration',
								'Chaque salariée doit avoir au moins une déclaration.'
							)}
							<br />
						</>
					)}
					{!chaqueSalariéeAMAEstValide(situation.salariées) && (
						<>
							{t(
								'pages.assistants.cmg.déclarations.erreurs.déclarations-AMA-invalides',
								'Chaque déclaration d’assistante maternelle doit avoir au moins un enfant gardé, un nombre d’heures de garde et une rémunération.'
							)}
							<br />
						</>
					)}
					{!chaqueSalariéeGEDEstValide(situation.salariées) && (
						<>
							{t(
								'pages.assistants.cmg.déclarations.erreurs.déclarations-GED-invalides',
								'Chaque déclaration de garde d’enfants à domicile doit avoir un nombre d’heures de garde et une rémunération.'
							)}
							<br />
						</>
					)}
				</MessageFormulaireInvalide>
			)}
		</>
	)
}
