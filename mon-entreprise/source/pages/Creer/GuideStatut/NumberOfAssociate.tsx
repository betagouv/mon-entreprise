import {
	companyHasMultipleAssociates,
	useDispatchAndGoToNextQuestion,
} from 'Actions/companyStatusActions'
import AnswerGroup from 'DesignSystem/answer-group'
import { Button } from 'DesignSystem/buttons'
import { H2 } from 'DesignSystem/typography/heading'
import { Body, SmallBody } from 'DesignSystem/typography/paragraphs'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { TrackPage } from '../../../ATInternetTracking'

export default function NumberOfAssociates() {
	const dispatch = useDispatchAndGoToNextQuestion()
	const { t } = useTranslation()
	return (
		<>
			<TrackPage name="seul_ou_plusieurs" />
			<Helmet>
				<title>
					{t(
						'associés.page.titre',
						"Nombre d'associés pour créer une entreprise"
					)}
				</title>
				<meta
					name="description"
					content={t(
						'associés.page.description',
						"Découvrez quels status choisir en fonction du nombre d'associés participant à la création de l'entreprise."
					)}
				/>
			</Helmet>
			<H2>
				<Trans i18nKey="associés.titre">Seul ou à plusieurs</Trans>
			</H2>
			<Trans i18nKey="associés.description">
				<Body>
					Une entreprise avec un seul associé est plus simple à créer et gérer.
					Un associé peut-être une personne physique (un individu) ou une
					personne morale (par exemple une société).
				</Body>
				<SmallBody>
					Note : ce choix n'est pas définitif. Vous pouvez tout à fait commencer
					votre société seul, et accueillir de nouveaux associés au cours de
					votre développement.
				</SmallBody>
			</Trans>

			<AnswerGroup>
				{[
					<Button
						key="associé=1"
						onClick={() => {
							dispatch(companyHasMultipleAssociates(false))
						}}
					>
						<Trans i18nKey="associés.choix1">Seul</Trans>
					</Button>,
					<Button
						key="associé=many"
						onClick={() => {
							dispatch(companyHasMultipleAssociates(true))
						}}
					>
						<Trans i18nKey="associés.choix2">Plusieurs personnes</Trans>
					</Button>,
				]}
			</AnswerGroup>
		</>
	)
}
