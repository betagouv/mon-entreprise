import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { TrackPage } from '@/components/ATInternetTracking'
import { useCMG } from '@/contextes/cmg'
import { Body, Li, Ul } from '@/design-system'
import { RelativeSitePaths } from '@/sitePaths'

import Navigation from '../components/Navigation'

type Props = {
	précédent?: keyof RelativeSitePaths['assistants']['cmg']
}

export default function NonÉligible({ précédent }: Props) {
	const navigate = useNavigate()
	const location = useLocation()
	const { raisonsInéligibilité, getRaisonsInéligibilitéHumaines } = useCMG()
	const { t } = useTranslation()

	if (!raisonsInéligibilité.length) {
		navigate('/assistants/cmg')
	}

	return (
		<>
			<TrackPage chapter3="pas_a_pas" name="résultat" />

			<Body>
				{raisonsInéligibilité.length > 1
					? t(
							'pages.assistants.cmg.non-éligible.other',
							'Au vu des données renseignées, vous n’êtes pas éligible au complément transitoire pour les raisons suivantes :'
					  )
					: t(
							'pages.assistants.cmg.non-éligible.one',
							'Au vu des données renseignées, vous n’êtes pas éligible au complément transitoire pour la raison suivante :'
					  )}
			</Body>
			<Ul>
				{getRaisonsInéligibilitéHumaines(raisonsInéligibilité).map(
					(raison, index) => (
						<Li key={index}>{raison}</Li>
					)
				)}
			</Ul>

			<Navigation
				précédent={précédent || (location.state as Props).précédent}
			/>
		</>
	)
}
