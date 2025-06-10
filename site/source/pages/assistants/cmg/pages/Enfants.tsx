import * as A from 'effect/Array'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { TrackPage } from '@/components/ATInternetTracking'
import {
	Enfant,
	estEnfantsÀChargeValide,
	estInformationsValides,
	RaisonInéligibilité,
	useCMG,
} from '@/contextes/cmg'
import { Button, H2, Spacing } from '@/design-system'

import EnfantInput from '../components/enfants/EnfantInput'
import QuestionsAeeH from '../components/enfants/QuestionsAeeH'
import Navigation from '../components/Navigation'
import { Question } from '../components/styled-components'

export default function Enfants() {
	const navigate = useNavigate()
	const { t } = useTranslation()
	const { raisonsInéligibilité, situation, enfants, set } = useCMG()

	if (!estInformationsValides(situation)) {
		navigate('/assistants/cmg')
	}

	const raisonsInéligibilitéValables: Array<RaisonInéligibilité> = [
		'CMG-perçu',
		'déclarations',
	]
	if (
		raisonsInéligibilitéValables.some((raison) =>
			raisonsInéligibilité.includes(raison)
		)
	) {
		navigate('/assistants/cmg/inéligible', {
			state: { précédent: 'informations' },
		})
	}

	useEffect(() => {
		if (!enfants.length) {
			set.nouvelEnfant()
		}
	}, [])

	const onChange = (index: number) => (enfant: Enfant) => {
		set.enfants(A.replace(enfants, index, enfant))
	}

	const onDelete = (index: number) => () => {
		set.enfants(A.remove(enfants, index))
	}

	const isAddButtonDisabled = enfants.length > 18
	const isSuivantDisabled = !estEnfantsÀChargeValide(situation.enfantsÀCharge)

	return (
		<>
			<TrackPage chapter3="pas_a_pas" name="enfants" />

			<H2>{t('pages.assistants.cmg.enfants.h2', 'Enfants à charge')}</H2>

			<fieldset>
				<legend>
					<Question>
						{t(
							'pages.assistants.cmg.enfants.question',
							'Quels étaient vos enfants à charge sur la période de mars, avril et mai 2025 ?'
						)}
					</Question>
				</legend>

				<Spacing md />

				{enfants.map((enfant, index) => (
					<EnfantInput
						key={index}
						idSuffix={`${index}`}
						enfant={enfant}
						onChange={onChange(index)}
						onDelete={enfants.length > 1 ? onDelete(index) : undefined}
					/>
				))}
			</fieldset>

			<Button
				size="XXS"
				light
				onPress={set.nouvelEnfant}
				isDisabled={isAddButtonDisabled}
			>
				{t(
					'pages.assistants.cmg.enfants.add-button-label',
					'Ajouter un enfant'
				)}
			</Button>

			<QuestionsAeeH />

			<Navigation
				précédent="informations"
				suivant="déclarations"
				isSuivantDisabled={isSuivantDisabled}
			/>
		</>
	)
}
