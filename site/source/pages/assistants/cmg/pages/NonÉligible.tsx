import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'

import { TrackPage } from '@/components/ATInternetTracking'
import { useCMG } from '@/contextes/cmg'
import { Body, Button, FlexCenter, Li, Ul } from '@/design-system'

export default function NonÉligible() {
	const navigate = useNavigate()
	const { raisonsInéligibilité, getRaisonsInéligibilitéHumaines, set } =
		useCMG()
	const { t } = useTranslation()

	if (!raisonsInéligibilité.length) {
		navigate('/assistants/cmg', { replace: true })
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

			<ButtonContainer>
				<Button size="XS" light onClick={set.reset} to="/assistants/cmg">
					{t(
						'pages.assistants.cmg.nouvelle-simulation',
						'Faire une nouvelle simulation'
					)}
				</Button>
			</ButtonContainer>
		</>
	)
}

const ButtonContainer = styled.div`
	margin-top: ${({ theme }) => theme.spacings.xl};
	${FlexCenter}
	justify-content: end;
`
