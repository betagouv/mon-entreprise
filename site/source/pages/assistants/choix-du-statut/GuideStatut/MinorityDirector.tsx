import { Trans, useTranslation } from 'react-i18next'

import { TrackPage } from '@/components/ATInternetTracking'
import DefaultHelmet from '@/components/utils/DefaultHelmet'
import AnswerGroup from '@/design-system/answer-group'
import { Button } from '@/design-system/buttons'
import { H2 } from '@/design-system/typography/heading'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import {
	directorIsInAMinority,
	useDispatchAndGoToNextQuestion,
} from '@/store/actions/companyStatusActions'

export default function MinorityDirector() {
	const { t } = useTranslation()
	const dispatch = useDispatchAndGoToNextQuestion()

	return (
		<>
			<TrackPage name="majoritaire_ou_minoritaire" />
			<DefaultHelmet>
				<title>
					{t(
						'gérant minoritaire.page.titre',
						'Gérant majoritaire ou minoritaire'
					)}{' '}
				</title>
				<meta
					name="description"
					content={t(
						'gérant minoritaire.page.description',
						"Certaines règles particulières s'appliquent en fonction du nombre d'actions détenues par l'administrateur, ce qui peut conduire à un statut différent lors de la création de votre société"
					)}
				/>
			</DefaultHelmet>
			<H2>
				<Trans i18nKey="gérant minoritaire.titre">
					Gérant majoritaire ou minoritaire
				</Trans>{' '}
			</H2>
			<Trans i18nKey="gérant minoritaire.description">
				<Body>
					Certaines règles spéciales s'appliquent selon le nombre d'actions
					détenues.
				</Body>
				<Ul>
					<Li>
						<strong>Gérant majoritaire</strong> : Vous êtes l'administrateur
						majoritaire (ou faite partie d'un conseil d'administration
						majoritaire).
					</Li>
					<Li>
						<strong>Gérant minoritaire</strong> : Vous êtes administrateur
						minoritaire ou égalitaire (ou faites partie d'un conseil
						d'administration minoritaire ou égalitaire).
					</Li>
				</Ul>
			</Trans>

			<AnswerGroup role="list">
				<Button
					onPress={() => {
						dispatch(directorIsInAMinority(false))
					}}
					aria-label={t(
						"Gérant majoritaire, sélectionner l'option et passer à l'étape suivante"
					)}
				>
					<Trans>Gérant majoritaire</Trans>
				</Button>
				<Button
					key="director-minority-true"
					onPress={() => {
						dispatch(directorIsInAMinority(true))
					}}
					aria-label={t(
						"Gérant minoritaire ou égalitaire, sélectionner l'option et passer à l'étape suivante"
					)}
				>
					<Trans>Gérant minoritaire ou égalitaire</Trans>
				</Button>
			</AnswerGroup>
		</>
	)
}
