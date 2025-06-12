import * as O from 'effect/Option'
import { Trans } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { TrackPage } from '@/components/ATInternetTracking'
import { useCMG } from '@/contextes/cmg'
import { Body, Message, SmallBody, Strong } from '@/design-system'
import { toString as formatMontant } from '@/domaine/Montant'

import Navigation from '../components/Navigation'

export default function Résultat() {
	const navigate = useNavigate()
	const { montantCT } = useCMG()

	if (!O.isSome(montantCT) || !montantCT.value) {
		navigate('/assistants/cmg/inéligible')

		return
	}

	const amount = formatMontant(montantCT.value)

	return (
		<>
			<TrackPage chapter3="pas_a_pas" name="résultat" />

			<Trans i18nKey="pages.assistants.cmg.résultat">
				<Body>
					Pour une <Strong>situation identique</Strong>, le montant{' '}
					<Strong>indicatif</Strong> de votre complément transitoire s’élèverait
					à&nbsp;: <Strong>{{ amount }}</Strong>.<br />
					Ce complément du CMG permet d’éviter une variation importante des
					dépenses restant à votre charge.
				</Body>
				<Message type="info" icon={true}>
					<SmallBody>
						Le résultat de cette simulation est communiqué à titre indicatif.
						<br />
						Aucun élément saisi au cours de cette simulation ne vaut pour
						déclaration de changement de situation ou pour demande de
						prestation.
						<br />
						Aucun élément de cette simulation ne sera conservé.
					</SmallBody>
				</Message>
			</Trans>

			<Navigation précédent="déclarations" />
		</>
	)
}
