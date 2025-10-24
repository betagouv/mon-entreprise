import * as O from 'effect/Option'
import { RuleNode } from 'publicodes'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { TrackPage } from '@/components/ATInternetTracking'
import { CurrentSimulatorCard } from '@/components/CurrentSimulatorCard'
import { Feedback } from '@/components/Feedback/Feedback'
import { References } from '@/components/References'
import { StatutType } from '@/components/StatutTag'
import {
	Article,
	Button,
	Container,
	Emoji,
	Grid,
	H3,
	Intro,
	Message,
	Spacing,
	Strong,
} from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/hooks/useEngine'
import { useNavigation } from '@/lib/navigation'
import { useSitePaths } from '@/sitePaths'
import { enregistreLesRéponsesAuxQuestions } from '@/store/actions/actions'

import useIsEmbeddedOnBPISite from './_components/useIsEmbeddedBPI'

export default function Résultat() {
	const { absoluteSitePaths } = useSitePaths()
	const { currentPath } = useNavigation()

	const statut = Object.entries(
		absoluteSitePaths.assistants['choix-du-statut'].résultat
	).find(([, path]) => currentPath === path)?.[0]
	const dottedName = STATUT_TO_DOTTEDNAME[statut as StatutType]
	useSetStatutInSituation(dottedName)
	const rule = useEngine().getRule(dottedName)
	const statutLabel = rule.title
	const références = useReferences(rule)
	const externalGuideLink = useExternalGuideLink()

	return (
		<>
			<TrackPage chapter3="resultat" name={statutLabel} />

			<H3 as="h2">
				Vous avez choisi le statut : <Strong>{statutLabel}</Strong>{' '}
				<Emoji emoji="🎉" />
			</H3>
			<Intro>
				Félicitations ! Le temps est venu de rassembler toutes les informations
				nécessaires à la création de votre entreprise. Voici quelques pistes.
			</Intro>
			<Grid spacing={3} container>
				<Grid item xl={4} lg={6} sm={12}>
					<Article
						title="Le guide complet pour créer son activité"
						href={externalGuideLink}
						ctaLabel="Lire le guide"
					>
						Laissez-vous guidez pas à pas dans les étapes de création de votre
						entreprise, du stade de l'idée au lancement de l'entreprise.
					</Article>
				</Grid>
				<Grid item xl={4} lg={6} sm={12}>
					<Article
						title="Vos démarches en ligne"
						href="https://formalites.entreprises.gouv.fr/"
						ctaLabel="Accéder au site"
					>
						Immatriculez votre entreprise en ligne, de manière sécurisée et
						gratuite, sur le site officiel formalites.entreprises.gouv.fr.
					</Article>
				</Grid>
				<Grid item xl={4} xs={12} sm>
					<Message
						type="info"
						border={false}
						style={{
							textAlign: 'center',
							display: 'flex',
							alignItems: 'center',
							height: '100%',
						}}
					>
						<Feedback />
						<Spacing sm />
					</Message>
				</Grid>
				<Grid
					item
					xs
					style={{
						textAlign: 'right',
					}}
					xl="auto"
				>
					<Button
						color="secondary"
						light
						size="XXS"
						to={absoluteSitePaths.assistants['choix-du-statut'].index}
					>
						<span aria-hidden>↻</span> Recommencer l'assistant
					</Button>
				</Grid>
			</Grid>
			<Spacing md />

			<Container
				backgroundColor={(theme) =>
					theme.darkMode
						? theme.colors.extended.dark[700]
						: theme.colors.bases.primary[100]
				}
			>
				<H3>{statutLabel} : pour aller plus loin</H3>
				<References dottedName={dottedName} references={références} />
				<H3>Simuler vos futurs revenus</H3>
				<CurrentSimulatorCard />
				<Spacing xl />
			</Container>
		</>
	)
}

const STATUT_TO_DOTTEDNAME: Record<StatutType, DottedName> = {
	AE: 'entreprise . catégorie juridique . EI . auto-entrepreneur',
	association: 'entreprise . catégorie juridique . association',
	EI: 'entreprise . catégorie juridique . EI . EI',
	EURL: 'entreprise . catégorie juridique . SARL . EURL',
	SARL: 'entreprise . catégorie juridique . SARL . SARL',
	SAS: 'entreprise . catégorie juridique . SAS . SAS',
	SASU: 'entreprise . catégorie juridique . SAS . SASU',
	SELARL: 'entreprise . catégorie juridique . SELARL . SELARL',
	SELARLU: 'entreprise . catégorie juridique . SELARL . SELARLU',
	SELASU: 'entreprise . catégorie juridique . SELAS . SELASU',
	SELAS: 'entreprise . catégorie juridique . SELAS . SELAS',
}

function setAllStatutTo(value: undefined | 'non') {
	return Object.values(STATUT_TO_DOTTEDNAME).reduce(
		(acc, dottedName) => ({
			...acc,
			[dottedName]: O.fromNullable(value),
		}),
		{} as Record<DottedName, O.Option<ValeurPublicodes>>
	)
}

function useSetStatutInSituation(dottedName: DottedName) {
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(
			enregistreLesRéponsesAuxQuestions({
				...setAllStatutTo('non'),
				[dottedName]: 'oui',
			})
		)

		return () => {
			dispatch(enregistreLesRéponsesAuxQuestions(setAllStatutTo(undefined)))
		}
	}, [])
}

// BPI agreed to use our assistant on their website, but only if we filter the
// links to only show the ones that are relevant to their users.
// They paid the extra development cost for this feature.
const BPIWhiteList = ['bpifrance-creation.fr', 'associations.gouv.fr']

export function useReferences(rule: RuleNode) {
	const onBPISite = useIsEmbeddedOnBPISite()
	if (!rule.rawNode.références) {
		return {}
	}

	return Object.fromEntries(
		Object.entries(rule.rawNode.références).filter(([, value]) => {
			const whitelistedByBPI = BPIWhiteList.some((site) => value.includes(site))

			return onBPISite ? whitelistedByBPI : !whitelistedByBPI
		})
	)
}

function useExternalGuideLink() {
	const onBPISite = useIsEmbeddedOnBPISite()

	return onBPISite
		? 'https://bpifrance-creation.fr/boiteaoutils/guide-pratique-du-createur-reussir-votre-creation-dentreprise'
		: 'https://entreprendre.service-public.fr/vosdroits/N31901'
}
