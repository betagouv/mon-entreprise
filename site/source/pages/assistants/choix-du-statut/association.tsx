import { Evaluation } from 'publicodes'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useEngine } from '@/components/utils/EngineContext'
import { RadioCard, RadioCardGroup } from '@/design-system'
import { HelpButtonWithPopover } from '@/design-system/buttons'
import { Strong } from '@/design-system/typography'
import { Body } from '@/design-system/typography/paragraphs'
import { batchUpdateSituation } from '@/store/actions/actions'

import Layout from './_components/Layout'
import Navigation from './_components/Navigation'

export default function Association() {
	const { t } = useTranslation()
	const [currentSelection, setCurrentSelection, reset] =
		useAssociationSelection()

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
					onChange={setCurrentSelection}
					value={currentSelection}
				>
					<RadioCard
						value={'gagner-argent'}
						label={
							<Trans i18nKey="choix-statut.association.question.gagner-argent">
								Dans le but de <Strong>gagner de l'argent</Strong>
							</Trans>
						}
					>
						<Body></Body>
					</RadioCard>
					<RadioCard
						value={'non-lucratif'}
						label={
							<Trans i18nKey="choix-statut.association.question.non-lucratif">
								Dans un but <Strong>non lucratif</Strong>
							</Trans>
						}
						description={t(
							'choix-statut.association.question.non-lucratif.description',
							'Par exemple, en créant une association'
						)}
					/>
				</RadioCardGroup>
				<Navigation
					currentStepIsComplete={currentSelection !== undefined}
					onPreviousStep={reset}
					assistantIsCompleted={currentSelection === 'non-lucratif'}
				/>
			</Layout>
		</>
	)
}

type RadioOption = 'gagner-argent' | 'non-lucratif' | undefined
function useAssociationSelection(): [
	RadioOption,
	(value: RadioOption) => void,
	() => void
] {
	const isAssociation = useEngine().evaluate(
		'entreprise . catégorie juridique . association'
	).nodeValue as Evaluation<boolean>

	const [currentSelection, setCurrentSelection] = useState<RadioOption>(
		isAssociation === true
			? 'non-lucratif'
			: isAssociation === false
			? 'gagner-argent'
			: undefined
	)

	const dispatch = useDispatch()

	const handleChange = (value: RadioOption) => {
		setCurrentSelection(value)

		if (value === 'gagner-argent') {
			dispatch(
				batchUpdateSituation({
					'entreprise . catégorie juridique . association': 'non',
					'entreprise . catégorie juridique': undefined,
				})
			)
		} else if (value === 'non-lucratif') {
			dispatch(
				batchUpdateSituation({
					'entreprise . catégorie juridique . association': undefined,
					'entreprise . catégorie juridique': "'association'",
				})
			)
		}
	}

	const reset = () => {
		setCurrentSelection(undefined)
		dispatch(
			batchUpdateSituation({
				'entreprise . catégorie juridique . association': undefined,
				'entreprise . catégorie juridique': undefined,
			})
		)
	}

	return [currentSelection, handleChange, reset]
}
