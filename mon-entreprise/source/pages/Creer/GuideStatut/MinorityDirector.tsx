import {
	directorIsInAMinority,
	useDispatchAndGoToNextQuestion,
} from 'Actions/companyStatusActions'
import AnswerGroup from 'DesignSystem/answer-group'
import { Button } from 'DesignSystem/buttons'
import { H2 } from 'DesignSystem/typography/heading'
import { Li, Ul } from 'DesignSystem/typography/list'
import { Body } from 'DesignSystem/typography/paragraphs'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { TrackPage } from '../../../ATInternetTracking'

export default function MinorityDirector() {
	const { t } = useTranslation()
	const dispatch = useDispatchAndGoToNextQuestion()
	return (
		<>
			<Helmet>
				<TrackPage name="majoritaire_ou_minoritaire" />
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
			</Helmet>
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

			<AnswerGroup>
				{[
					<Button
						key="director-minority-false"
						onClick={() => {
							dispatch(directorIsInAMinority(false))
						}}
					>
						<Trans>Gérant majoritaire</Trans>
					</Button>,
					<Button
						key="director-minority-true"
						onClick={() => {
							dispatch(directorIsInAMinority(true))
						}}
					>
						<Trans>Gérant minoritaire ou égalitaire</Trans>
					</Button>,
				]}
			</AnswerGroup>
		</>
	)
}
