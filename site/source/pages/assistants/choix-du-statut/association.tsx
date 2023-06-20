import { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { usePersistingState } from '@/components/utils/persistState'
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
	const [{ state: currentSelection }, setCurrentSelection] =
		usePersistingState<{ state: RadioOption }>('choix-statut:association', {
			state: undefined,
		})

	const dispatch = useDispatch()

	const handleChange = (value: RadioOption) => {
		setCurrentSelection({ state: value })

		switch (value) {
			case 'gagner-argent':
				dispatch(
					batchUpdateSituation({
						'entreprise . catégorie juridique . association': 'non',
						'entreprise . catégorie juridique': undefined,
					})
				)
				break
			case 'non-lucratif':
				dispatch(
					batchUpdateSituation({
						'entreprise . catégorie juridique . association': undefined,
						'entreprise . catégorie juridique': "'association'",
					})
				)
				break
			case undefined:
				dispatch(
					batchUpdateSituation({
						'entreprise . catégorie juridique . association': undefined,
						'entreprise . catégorie juridique': undefined,
					})
				)
				break
		}
	}

	useEffect(() => {
		handleChange(currentSelection)
	}, [])
	const reset = () => {
		handleChange(undefined)
	}

	return [currentSelection, handleChange, reset]
}
