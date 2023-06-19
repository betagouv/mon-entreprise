import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useEngine } from '@/components/utils/EngineContext'
import { RadioCard, RadioCardGroup } from '@/design-system'
import { HelpButtonWithPopover } from '@/design-system/buttons'
import { Strong } from '@/design-system/typography'
import { Body } from '@/design-system/typography/paragraphs'
import { deleteFromSituation, updateSituation } from '@/store/actions/actions'

import Layout from './_components/Layout'
import Navigation from './_components/Navigation'

export default function Associés() {
	const { t } = useTranslation()
	const [currentSelection, setCurrentSelection, reset] = useAssociésSelection()

	return (
		<>
			<Layout
				title={
					<Trans i18nKey="choix-statut.associés.title">
						Je gère cette entreprise...
						<HelpButtonWithPopover
							title={t(
								'choix-statut.associés.help.title',
								'Être associé(e) ou actionnaire'
							)}
							type="info"
						>
							<Body>
								Vous{' '}
								<Strong>
									partagez la propriété de votre entreprise avec d’autres
									personnes qui peuvent être physiques (individus) ou morales
									(sociétés)
								</Strong>
								. Dans le cas des <Strong>sociétés par actions</Strong> (SASU,
								SAS), on parle d’<Strong>actionnaires</Strong>.
							</Body>
						</HelpButtonWithPopover>
					</Trans>
				}
			>
				<RadioCardGroup
					aria-label={t(
						'choix-statut.associés.question',
						'Comment gérez-vous cette entreprise ?'
					)}
					onChange={setCurrentSelection}
					value={currentSelection}
				>
					<RadioCard
						value={"'unique'"}
						label={
							<Trans i18nKey="choix-statut.associés.question.seul">Seul</Trans>
						}
					>
						<Body></Body>
					</RadioCard>
					<RadioCard
						value={"'multiples'"}
						label={
							<Trans i18nKey="choix-statut.associés.question.plusieurs">
								À plusieurs
							</Trans>
						}
					/>
				</RadioCardGroup>
				<Navigation
					currentStepIsComplete={currentSelection !== undefined}
					onPreviousStep={reset}
				/>
			</Layout>
		</>
	)
}

type RadioOption = "'unique'" | "'multiples'" | undefined
function useAssociésSelection(): [
	RadioOption,
	(value: RadioOption) => void,
	() => void
] {
	const associés = useEngine().evaluate('entreprise . associés').nodeValue as
		| RadioOption
		| undefined
	console.log(
		useEngine().evaluate('entreprise . associés'),
		useEngine().evaluate('entreprise . catégorie juridique')
	)
	const [currentSelection, setCurrentSelection] =
		useState<RadioOption>(associés)

	const dispatch = useDispatch()

	const handleChange = (value: RadioOption) => {
		setCurrentSelection(value)
		dispatch(updateSituation('entreprise . associés', value))
	}

	const reset = () => {
		setCurrentSelection(undefined)
		dispatch(deleteFromSituation('entreprise . associés'))
	}

	return [currentSelection, handleChange, reset]
}
