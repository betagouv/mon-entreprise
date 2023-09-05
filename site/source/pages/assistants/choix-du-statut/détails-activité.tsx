import { useCallback, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'

import Skeleton from '@/components/ui/Skeleton'
import { useEngine } from '@/components/utils/EngineContext'
import { Message, RadioCardGroup } from '@/design-system'
import { RadioCardSkeleton } from '@/design-system/field/Radio/RadioCard'
import { Spacing } from '@/design-system/layout'
import { H5 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
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
import {
	AvertissementActivitéNonDisponible,
	estNonDisponible,
} from './_components/ActivitéNonDisponible'
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
	}, [guichetEntries])
	const guichet = guichetEntries?.find(
		(guichet) => guichet.code === codeGuichet
	)
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
							updateSituationWithGuichet(code)
							setCodeGuichet(code)
						}}
						codeGuichet={codeGuichet}
					/>
				)}
				<Navigation
					currentStepIsComplete={!!guichet && !estNonDisponible(guichet)}
					nextStepLabel={
						guichetEntries?.length === 1 &&
						t('créer.activité-détails.next1', 'Continuer avec cette activité')
					}
				>
					<AvertissementActivitéNonDisponible guichet={guichet} />
				</Navigation>
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
	const showCCIOrCMAHelp = choixEntreArtisanaleOuCommerciale(entries)
	const showBNCorBICHelp = choixEntreBNCouBIC(entries)

	return (
		<>
			<Body>
				Selectionnez la description d'activité qui correspond le mieux.
			</Body>
			{showCCIOrCMAHelp && (
				<Message>
					<Body>
						<Trans i18nKey="créer.choix-statut.détails-activité.aide-cci-cma">
							Si vous hésitez entre une activité artisanale ou commerciale, vous
							pouvez consulter les sites de la{' '}
							<Link href="https://www.cci.fr/">CCI</Link> ou de la{' '}
							<Link href="https://www.cma-france.fr/">CMA</Link>.
						</Trans>
					</Body>
				</Message>
			)}
			{showBNCorBICHelp && (
				<Message>
					<Trans i18nKey="crée.choix-statut.détails-activité.aide-bnc-bic">
						<Body>
							Le choix entre exercer une activité à titre commercial (avec des
							revenus de type BIC) ou à titre indépendant (avec des revenus de
							type BNC) dépend souvent de la nature de votre travail. Si vous
							vendez des biens ou des services de manière régulière et que vous
							agissez comme un commerçant, il est probable que vous releviez du
							régime BIC. En revanche, si votre activité est basée sur des
							compétences professionnelles, intellectuelles ou artistiques,
							comme la médecine, la consultation ou l'écriture, vous serez
							probablement sous le régime BNC.
						</Body>
						<Body>
							Pour en savoir plus, vous pouvez consulter le site de{' '}
							<Link href="https://www.urssaf.fr/portail/home/independant/je-cree-mon-entreprise/quelle-activite/les-differentes-activites-indepe.html">
								l'URSSAF
							</Link>
							.
						</Body>
					</Trans>
				</Message>
			)}

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
						'entreprise . activités . libérale': undefined,
						'entreprise . activités . artisanale': undefined,
						'entreprise . activités . agricole': undefined,
						'entreprise . activités . commerciale': undefined,
						'entreprise . activité . nature': undefined,
						'artiste-auteur': undefined,
						'entreprise . activité . nature . libérale . réglementée':
							undefined,
						'dirigeant . indépendant . PL . métier': undefined,
					})
				)

				return
			}
			const PLRMétier = guichetToPLMétier(guichet)
			const activité = getActivitéFromGuichet(guichet)
			dispatch(
				batchUpdateSituation({
					'entreprise . activités . principale . code guichet': `'${guichet.code}'`,
					'entreprise . imposition . IR . type de bénéfices': `'${guichet.typeBénéfice}'`,
					...(activité
						? {
								'entreprise . activité . nature': `'${activité}'`,
								[`entreprise . activités . ${activité}`]: 'oui',
						  }
						: {}),
					'entreprise . activité . nature . libérale . réglementée': PLRMétier
						? 'oui'
						: 'non',
					'dirigeant . indépendant . PL . métier': PLRMétier,
					'artiste-auteur': guichet.artisteAuteurPossible ? 'oui' : 'non',
				})
			)
		},
		[dispatch, guichetEntries]
	)
}

function getActivitéFromGuichet(guichet: GuichetEntry) {
	return guichet.catégorieActivité.includes('LIBERALE')
		? 'libérale'
		: guichet.catégorieActivité.includes('ARTISANALE')
		? 'artisanale'
		: guichet.catégorieActivité.includes('COMMERCIALE')
		? 'commerciale'
		: guichet.catégorieActivité.includes('AGRICOLE')
		? 'agricole'
		: undefined
}

function choixEntreArtisanaleOuCommerciale(entries: GuichetEntry[]): boolean {
	return (
		entries.every(
			(e) =>
				e.catégorieActivité.includes('ARTISANALE') ||
				e.catégorieActivité.includes('COMMERCIALE')
		) &&
		entries.some((e) => e.catégorieActivité.includes('ARTISANALE')) &&
		entries.some((e) => e.catégorieActivité.includes('COMMERCIALE'))
	)
}

function choixEntreBNCouBIC(entries: GuichetEntry[]): boolean {
	return (
		entries.every(
			(e) => e.typeBénéfice === 'BIC' || e.typeBénéfice === 'BNC'
		) &&
		entries.some((e) => e.typeBénéfice === 'BIC') &&
		entries.some((e) => e.typeBénéfice === 'BNC')
	)
}
