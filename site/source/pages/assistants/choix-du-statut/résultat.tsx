import { DottedName } from 'modele-social'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { CurrentSimulatorCard } from '@/components/CurrentSimulatorCard'
import { References } from '@/components/References'
import { StatutType } from '@/components/StatutTag'
import { useEngine } from '@/components/utils/EngineContext'
import { Button } from '@/design-system/buttons'
import { Article } from '@/design-system/card'
import { Emoji } from '@/design-system/emoji'
import { Container, Grid, Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H3 } from '@/design-system/typography/heading'
import { Intro } from '@/design-system/typography/paragraphs'
import { useSitePaths } from '@/sitePaths'
import { batchUpdateSituation } from '@/store/actions/actions'
import { Situation } from '@/store/reducers/rootReducer'

export default function Résultat() {
	const { absoluteSitePaths } = useSitePaths()
	const location = useLocation()

	const statut = Object.entries(
		absoluteSitePaths.assistants['choix-du-statut'].résultat
	).find(([, path]) => location.pathname === path)?.[0]
	const dottedName = STATUT_TO_DOTTEDNAME[statut as StatutType]
	useSetStatutInSituation(dottedName)
	const rule = useEngine().getRule(dottedName)
	const statutLabel = rule.title

	return (
		<>
			<H3 as="h2">
				Vous avez choisi le statut : <Strong>{statutLabel}</Strong>{' '}
				<Emoji emoji="🎉" />
			</H3>
			<Intro>
				Félicitations ! Le temps est venu de rassembler toutes les informations
				nécessaires à la création de votre entreprise. Voici quelques pistes.
			</Intro>
			<Grid spacing={3} container>
				<Grid item lg={6} sm={12}>
					<Article
						title="Le guide complet pour créer son activité"
						href="https://entreprendre.service-public.fr/vosdroits/N31901"
						ctaLabel="Lire le guide"
					>
						Laissez-vous guidez pas à pas dans les étapes de création de votre
						entreprise, du stade de l'idée au lancement de l'entreprise.
					</Article>
				</Grid>
				<Grid item lg={6} sm={12}>
					<Article
						title="Vos démarches en ligne"
						href="https://formalites.entreprises.gouv.fr/"
						ctaLabel="Accéder au site"
					>
						Immatriculez votre entreprise en ligne, de manière sécurisée et
						gratuite, sur le site officiel formalites.entreprises.gouv.fr.
					</Article>
				</Grid>
			</Grid>
			<Spacing xl />
			<Button
				color="secondary"
				light
				size="XS"
				to={absoluteSitePaths.assistants['choix-du-statut'].index}
			>
				<span aria-hidden>↻</span> Recommencer l'assistant
			</Button>
			<Spacing xl />
			<Container
				backgroundColor={(theme) =>
					theme.darkMode
						? theme.colors.extended.dark[700]
						: theme.colors.bases.primary[100]
				}
			>
				<H3>{statutLabel} : pour aller plus loin</H3>
				<References
					dottedName={dottedName}
					references={rule.rawNode.références}
				/>
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
			[dottedName]: value,
		}),
		{} as Situation
	)
}

function useSetStatutInSituation(dottedName: DottedName) {
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(
			batchUpdateSituation({
				...setAllStatutTo('non'),
				[dottedName]: 'oui',
			})
		)

		return () => {
			dispatch(batchUpdateSituation(setAllStatutTo(undefined)))
		}
	}, [])
}
