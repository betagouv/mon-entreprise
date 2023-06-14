import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'

import Skeleton from '@/components/ui/Skeleton'
import { useEngine } from '@/components/utils/EngineContext'
import { Message, RadioCardGroup } from '@/design-system'
import { RadioCardSkeleton } from '@/design-system/field/Radio/RadioCard'
import { Spacing } from '@/design-system/layout'
import { H3, H5 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { useSitePaths } from '@/sitePaths'
import { batchUpdateSituation } from '@/store/actions/actions'

import {
	GuichetDescription,
	GuichetEntry,
	getGuichetTitle,
	useGuichetInfo,
} from '../recherche-code-ape/GuichetInfo'
import Layout from './_components/Layout'
import Navigation from './_components/Navigation'

export default function DétailsActivité() {
	const { t } = useTranslation()
	const codeApe = useEngine().evaluate(
		'entreprise . activités . principale . code APE'
	).nodeValue as string | undefined
	const dispatch = useDispatch()

	const [codeGuichet, setCodeGuichet] = useState<string | undefined>(undefined)
	const guichetEntries = useGuichetInfo(codeApe)

	useEffect(() => {
		if (guichetEntries && guichetEntries.length === 1)
			setCodeGuichet(guichetEntries[0].code)
	}, [guichetEntries])

	const guichetSelected = guichetEntries?.find(
		(guichet) => guichet.code === codeGuichet
	)

	const onNextStepClicked = () => {
		if (!guichetSelected) {
			return
		}
		dispatch(
			batchUpdateSituation({
				'entreprise . activités . principale . code guichet': `'${guichetSelected.code}'`,
				'entreprise . imposition . IR . type de bénéfices':
					guichetSelected.typeBénéfice,
			})
		)
	}

	if (!codeApe) return <CodeAPENonConnu />

	return (
		<>
			<Layout title={t('créer.activité.title', 'Votre activité')}>
				<Trans i18nKey={'créer.activité-détails.subtitle'}>
					<H3 as="h2">Précisions sur votre activité</H3>
				</Trans>

				{!guichetEntries ? (
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
						onGuichetSelected={setCodeGuichet}
					/>
				)}
				<Navigation
					currentStepIsComplete={!!codeGuichet}
					nextStepLabel={
						guichetEntries?.length === 1 &&
						t('créer.activité-détails.next1', 'Continuer avec cette activité')
					}
					onNextStep={onNextStepClicked}
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
			<Skeleton width={300} height={20} />
			<Spacing md />
			<Skeleton width={600} height={20} />
		</Message>
	)
}
