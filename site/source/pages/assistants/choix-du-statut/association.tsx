import { Trans, useTranslation } from 'react-i18next'

import { RadioCard, RadioCardGroup } from '@/design-system'
import { HelpButtonWithPopover } from '@/design-system/buttons'
import { Strong } from '@/design-system/typography'
import { Body } from '@/design-system/typography/paragraphs'

import Layout from './_components/Layout'
import Navigation from './_components/Navigation'

export default function Association() {
	const { t } = useTranslation()

	return (
		<>
			<Layout
				title={
					<Trans i18nKey="choix-statut.association.title">
						Je crée cette entreprise...
						<HelpButtonWithPopover
							title={t(
								'choix-statut.association.help.title',
								'L’association, ou organisation à but non lucratif, quèsaco ?'
							)}
							type="info"
						>
							<Body>
								Elle permet de{' '}
								<Strong>
									partager un projet commun dans l’intérêt général, sans faire
									de bénéfices
								</Strong>{' '}
								: promouvoir une activité sportive, l'insertion de personnes en
								difficulté, le développement local, etc...
							</Body>
						</HelpButtonWithPopover>
					</Trans>
				}
			>
				<RadioCardGroup
					aria-label={t(
						'choix-statut.association.question',
						'Pourquoi créez vous cette entreprise ?'
					)}
					// onChange={handleChange}
					// value={currentSelection ?? undefined}
				>
					<RadioCard
						value={'gagner-argent'}
						label={
							<Trans i18nKey="choix-statut.association.question.gagner-argent">
								Dans le but de <Strong>gagner de l'argent</Strong>
							</Trans>
						}
						// emoji={node.rawNode.icônes}
						// description={node.rawNode.description}
					>
						<Body></Body>
					</RadioCard>
					<RadioCard
						value={'non-lucratif'}
						label={
							<Trans i18nKey="choix-statut.association.question.gagner-argent">
								Dans un but <Strong>non lucratif</Strong>
							</Trans>
						}
						// emoji={node.rawNode.icônes}
						description={t(
							'choix-statut.association.question.non-lucratif.description',
							'Par exemple, en créant une association'
						)}
					/>
				</RadioCardGroup>
				<Navigation currentStepIsComplete />
			</Layout>
		</>
	)
}
