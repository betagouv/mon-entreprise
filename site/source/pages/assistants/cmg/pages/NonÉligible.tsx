import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { SIMULATION_TERMINEE, TrackPage } from '@/components/ATInternetTracking'
import { useCMG } from '@/contextes/cmg'
import { Body, Button, FlexCenter, Li, Ul } from '@/design-system'
import { useGetPath } from '@/hooks/useGetPath'
import { useNavigation } from '@/lib/navigation'

export default function NonÉligible() {
	const { navigate } = useNavigation()
	const { raisonsInéligibilité, getRaisonsInéligibilitéHumaines, set } =
		useCMG()
	const { t } = useTranslation()
	const getPath = useGetPath()

	useEffect(() => {
		if (!raisonsInéligibilité.length) {
			navigate(getPath('assistants.cmg'), { replace: true })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<TrackPage chapter3="pas_a_pas" name={SIMULATION_TERMINEE} />

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
				<Button
					size="XS"
					light
					onPress={set.reset}
					to={getPath('assistants.cmg')}
				>
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
