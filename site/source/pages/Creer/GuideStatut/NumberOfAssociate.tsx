import {
	companyHasMultipleAssociates,
	useDispatchAndGoToNextQuestion,
} from '@/actions/companyStatusActions'
import DefaultHelmet from '@/components/utils/DefaultHelmet'
import AnswerGroup from '@/design-system/answer-group'
import { Button } from '@/design-system/buttons'
import { H2 } from '@/design-system/typography/heading'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'
import { Trans, useTranslation } from 'react-i18next'
import { TrackPage } from '../../../ATInternetTracking'

export default function NumberOfAssociates() {
	const dispatch = useDispatchAndGoToNextQuestion()
	const { t } = useTranslation()

	return (
		<>
			<TrackPage name="seul_ou_plusieurs" />
			<DefaultHelmet>
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
			</DefaultHelmet>
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
				<Button
					onPress={() => {
						dispatch(companyHasMultipleAssociates(false))
					}}
					aria-label={t(
						'associés.choix1-aria-label',
						"Seul, sélectionner l'option et passer à l'étape suivante"
					)}
				>
					<Trans i18nKey="associés.choix1">Seul</Trans>
				</Button>
				<Button
					onPress={() => {
						dispatch(companyHasMultipleAssociates(true))
					}}
					aria-label={t(
						'associés.choix2-aria-label',
						"Plusieurs personnes, sélectionner l'option et passer à l'étape suivante"
					)}
				>
					<Trans i18nKey="associés.choix2">Plusieurs personnes</Trans>
				</Button>
			</AnswerGroup>
		</>
	)
}
