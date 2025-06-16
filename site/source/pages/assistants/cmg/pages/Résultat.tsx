import * as O from 'effect/Option'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'

import { TrackPage } from '@/components/ATInternetTracking'
import { useCMG } from '@/contextes/cmg'
import {
	Body,
	Button,
	FlexCenter,
	Li,
	Message,
	SmallBody,
	Strong,
	Ul,
} from '@/design-system'
import { toString as formatMontant } from '@/domaine/Montant'

export default function Résultat() {
	const navigate = useNavigate()
	const { montantCT, enfantsOuvrantDroit, set } = useCMG()
	const { t } = useTranslation()

	if (!O.isSome(montantCT) || !montantCT.value) {
		navigate('/assistants/cmg/inéligible', { replace: true })

		return
	}

	const amount = formatMontant(montantCT.value)

	return (
		<>
			<TrackPage name="simulation terminée" />
			<TrackPage chapter3="pas_a_pas" name="résultat" />

			<Body>
				<Trans i18nKey="pages.assistants.cmg.résultat.montant">
					Pour une <Strong>situation identique</Strong>, le montant{' '}
					<Strong>indicatif</Strong> de votre complément transitoire s’élèverait
					à&nbsp;: <Strong>{{ amount }}</Strong>.<br />
					Ce complément du CMG permet d’éviter une variation importante des
					dépenses restant à votre charge.
				</Trans>
			</Body>
			<Body>
				{enfantsOuvrantDroit.length > 1
					? t(
							'pages.assistants.cmg.résultat.enfants.other',
							'Les enfants qui vous ouvrent le droit à ce complément transitoire sont :'
					  )
					: t(
							'pages.assistants.cmg.résultat.enfants.one',
							'L’enfant qui vous ouvre le droit à ce complément transitoire est :'
					  )}
				<Ul>
					{enfantsOuvrantDroit.map((enfant, index) => (
						<Li key={index}>{enfant.prénom.value}</Li>
					))}
				</Ul>
			</Body>
			<Message type="info" icon={true}>
				<SmallBody>
					<Trans i18nKey="pages.assistants.cmg.résultat.disclaimer">
						Le résultat de cette simulation est communiqué à titre indicatif.
						<br />
						Aucun élément saisi au cours de cette simulation ne vaut pour
						déclaration de changement de situation ou pour demande de
						prestation.
						<br />
						Aucun élément de cette simulation ne sera conservé.
					</Trans>
				</SmallBody>
			</Message>

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
