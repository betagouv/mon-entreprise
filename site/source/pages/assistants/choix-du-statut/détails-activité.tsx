import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'

import Skeleton from '@/components/ui/Skeleton'
import { useEngine } from '@/components/utils/EngineContext'
import { Message, RadioCardGroup } from '@/design-system'
import { RadioCardSkeleton } from '@/design-system/field/Radio/RadioCard'
import { Spacing } from '@/design-system/layout'
import { H5 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { useEngineIsIdle } from '@/hooks/useEngineIsIddle'
import { useSitePaths } from '@/sitePaths'
import { batchUpdateSituation } from '@/store/actions/actions'
import { guichetToPLMétier } from '@/utils/guichetToPLMétier'

import {
	getGuichetTitle,
	GuichetDescription,
	GuichetEntry,
	useGuichetInfo,
} from '../recherche-code-ape/GuichetInfo'
import Layout from './_components/Layout'
import Navigation from './_components/Navigation'

export default function DétailsActivité() {
	const { t } = useTranslation()
	const codeApe = useEngine().evaluate(
		'entreprise . activités . principale . code APE'
	).nodeValue as string | undefined
	const defaultCodeGuichet = useEngine().evaluate(
		'entreprise . activités . principale . code guichet'
	).nodeValue as string | undefined

	const [codeGuichet, setCodeGuichet] = useState<string | undefined>(undefined)

	const guichetEntries = useGuichetInfo(codeApe)
	const updateSituationWithGuichet =
		useUpdateSituationWithGuichet(guichetEntries)

	useEffect(() => {
		// If there is only one guichet code possible for this code APE, we select it
		if (guichetEntries && guichetEntries.length === 1) {
			setCodeGuichet(guichetEntries[0].code)
		}
		// If the current code guichet from situation is in the list of possible guichet codes, we select it
		if (
			guichetEntries &&
			guichetEntries.some((g) => g.code === defaultCodeGuichet)
		) {
			setCodeGuichet(defaultCodeGuichet)
		}
	}, [guichetEntries, defaultCodeGuichet])

	// Wait for the update to be done before rendering the component
	const isIdle = useEngineIsIdle()

	const title = t(
		'créer.choix-statut.détails-activité.title',
		'Précisions sur votre activité'
	)
	if (!isIdle) {
		return <Layout title={title} />
	}

	return (
		<>
			<Layout title={title}>
				{!codeApe ? (
					<CodeAPENonConnu />
				) : !guichetEntries ? (
					<GuichetSkeleton />
				) : guichetEntries.length === 1 ? (
					<>
						<Message border={false}>
							<H5 as="h3">{getGuichetTitle(guichetEntries[0].label)}</H5>

							<GuichetDescription {...guichetEntries[0]} />
						</Message>
					</>
				) : (
					<GuichetSelection
						entries={guichetEntries}
						onGuichetSelected={(code) => {
							updateSituationWithGuichet(codeGuichet)
							setCodeGuichet(code)
						}}
						codeGuichet={codeGuichet}
					/>
				)}
				<Navigation
					currentStepIsComplete={!!codeGuichet}
					onNextStep={() => updateSituationWithGuichet(codeGuichet)}
					nextStepLabel={
						guichetEntries?.length === 1 &&
						t('créer.activité-détails.next1', 'Continuer avec cette activité')
					}
				/>
			</Layout>
		</>
	)
}

function CodeAPENonConnu() {
	const { absoluteSitePaths } = useSitePaths()

	return (
		// For now, we don't handle the case where the user doesn't find his code APE
		<Navigate
			to={absoluteSitePaths.assistants['choix-du-statut']['recherche-activité']}
			replace
		/>
	)
}

function GuichetSelection({
	entries,
	onGuichetSelected,
	codeGuichet,
}: {
	entries: GuichetEntry[]
	onGuichetSelected: (code: string) => void
	codeGuichet?: string
}) {
	return (
		<>
			<Body>Sectionnez la description d'activité qui correspond le mieux.</Body>
			<RadioCardGroup
				value={codeGuichet}
				onChange={onGuichetSelected}
				aria-label={'liste des activités'}
			>
				{entries.map((guichetEntry) => {
					return (
						<RadioCardSkeleton
							value={guichetEntry.code}
							key={guichetEntry.code}
						>
							<H5 as="h3">{getGuichetTitle(guichetEntry.label)}</H5>
							<GuichetDescription {...guichetEntry} />
						</RadioCardSkeleton>
					)
				})}
			</RadioCardGroup>
		</>
	)
}

function GuichetSkeleton() {
	return (
		<Message border={false}>
			<Spacing sm />
			<Skeleton width={300} height={20} />
			<Spacing md />
			<Skeleton width={600} height={20} />
			<Spacing sm />
		</Message>
	)
}

function useUpdateSituationWithGuichet(guichetEntries: GuichetEntry[] | null) {
	const dispatch = useDispatch()

	return useCallback(
		(codeGuichet: GuichetEntry['code'] | undefined) => {
			const guichet = guichetEntries?.find(
				(guichet) => guichet.code === codeGuichet
			)
			if (!guichet) {
				dispatch(
					batchUpdateSituation({
						'entreprise . activités . principale . code guichet': undefined,
						'entreprise . imposition . IR . type de bénéfices': undefined,
						'entreprise . activité . nature': undefined,
						'entreprise . activité . nature . libérale . réglementée':
							undefined,
						'dirigeant . indépendant . PL . métier': undefined,
					})
				)

				return
			}
			const PLRMétier = guichetToPLMétier(guichet)
			dispatch(
				batchUpdateSituation({
					'entreprise . activités . principale . code guichet': `'${guichet.code}'`,
					'entreprise . imposition . IR . type de bénéfices': `'${guichet.typeBénéfice}'`,
					'entreprise . activité . nature': PLRMétier
						? "'libérale'"
						: undefined,
					'entreprise . activité . nature . libérale . réglementée': PLRMétier
						? 'oui'
						: 'non',
					'dirigeant . indépendant . PL . métier': PLRMétier,
				})
			)
		},
		[dispatch, guichetEntries]
	)
}
