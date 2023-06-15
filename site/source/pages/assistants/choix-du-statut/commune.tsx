import { DottedName } from 'modele-social'
import { Evaluation } from 'publicodes'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import SelectCommune from '@/components/conversation/select/SelectCommune'
import { useEngine } from '@/components/utils/EngineContext'
import { HelpButtonWithPopover } from '@/design-system/buttons'
import { Body } from '@/design-system/typography/paragraphs'
import { answerQuestion } from '@/store/actions/actions'

import Layout from './_components/Layout'
import Navigation from './_components/Navigation'

export default function Commune() {
	const dispatch = useDispatch()
	const dottedName = 'établissement . commune' as DottedName
	const commune = useEngine().evaluate(dottedName).nodeValue
	const { t } = useTranslation()

	return (
		<>
			<Layout
				title={
					<Trans i18nKey="choix-statut.commune.title">
						Dans quelle commune voulez-vous créer votre entreprise ?
						<HelpButtonWithPopover
							title={t(
								'choix-statut.commune.help.title',
								'Chaque territoire a ses spécificités'
							)}
							type="info"
						>
							<Body>
								Certains dispositifs législatifs sont spécifiques à des régions
								ou départements (Alsace-Moselle, exonération DOM, etc).
							</Body>
							<Body>
								Par ailleurs, certaines communes ont des dispositifs d'aide à la
								création d'entreprise (ZRR, ZFU, etc).
							</Body>
						</HelpButtonWithPopover>
					</Trans>
				}
			>
				<SelectCommune
					onChange={(c) =>
						dispatch(answerQuestion(dottedName, { batchUpdate: c }))
					}
					value={commune as Evaluation<string>}
				/>
				<Navigation currentStepIsComplete={!!commune} />
			</Layout>
		</>
	)
}
