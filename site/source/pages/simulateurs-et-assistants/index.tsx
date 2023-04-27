import { ComponentType } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { TrackPage } from '@/components/ATInternetTracking'
import PageHeader from '@/components/PageHeader'
import Meta from '@/components/utils/Meta'
import { Chip } from '@/design-system'
import InfoBulle from '@/design-system/InfoBulle'
import { Card } from '@/design-system/card'
import { SmallCard } from '@/design-system/card/SmallCard'
import { Emoji } from '@/design-system/emoji'
import { Grid } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H2, H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { MergedSimulatorDataValues } from '@/hooks/useCurrentSimulatorData'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useSitePaths } from '@/sitePaths'

import simulatorSvg from './illustration-simulateur.svg'

export default function SimulateursEtAssistants() {
	const { t } = useTranslation()
	const { absoluteSitePaths } = useSitePaths()
	const simulators = useSimulatorsData()
	const titre = t(
		'pages.simulateurs.accueil.titre',
		'Simulateurs et Assistants'
	)

	return (
		<>
			<TrackPage chapter1="simulateurs" name="accueil" />
			<Meta
				title={titre}
				description={t(
					'pages.simulateurs.accueil.description',
					'Tous les simulateurs et assistants sur ce site sont maintenus à jour avec les dernières évolutions législatives.'
				)}
				ogImage={simulatorSvg}
			/>
			<PageHeader titre={titre} picture={simulatorSvg}>
				<Intro>
					<Trans i18nKey="pages.simulateurs.accueil.header">
						Tous les simulateurs sur ce site sont maintenus à jour avec les
						dernières évolutions législatives.
					</Trans>
				</Intro>
			</PageHeader>
			<section>
				<H2 id="salarie-employeurs">
					<Trans>Salariés et employeurs</Trans>
				</H2>
				<Grid
					role="list"
					container
					spacing={3}
					aria-labelledby="salarie-employeurs"
				>
					<SimulateurCard {...simulators.salarié} role="listitem" />
					<SimulateurCard {...simulators['chômage-partiel']} role="listitem" />
				</Grid>

				<H3 id="revenu-dirigeant">
					<Trans>Revenu du dirigeant par statut</Trans>
				</H3>
				<Grid
					container
					spacing={3}
					role="list"
					aria-labelledby="revenu-dirigeant"
				>
					<SimulateurCard
						small
						{...simulators['auto-entrepreneur']}
						role="listitem"
					/>
					<SimulateurCard
						small
						{...simulators['entreprise-individuelle']}
						role="listitem"
					/>
					<SimulateurCard small {...simulators.eirl} role="listitem" />
					<SimulateurCard small {...simulators.sasu} role="listitem" />
					<SimulateurCard small {...simulators.eurl} role="listitem" />
					<SimulateurCard
						small
						{...simulators['comparaison-statuts']}
						role="listitem"
					/>
				</Grid>

				<H2 id="travailleurs-ns">
					<Trans>Travailleurs Non Salariés (TNS)</Trans>
				</H2>

				<Grid
					container
					spacing={3}
					role="list"
					aria-labelledby="travailleurs-ns"
				>
					<SimulateurCard {...simulators.indépendant} role="listitem" />
					<SimulateurCard {...simulators['artiste-auteur']} role="listitem" />
					<SimulateurCard
						{...simulators['profession-libérale']}
						role="listitem"
					/>
				</Grid>
				<>
					<H3 id="professions-lib">
						<Trans>Professions libérales</Trans>
					</H3>
					<Grid
						container
						spacing={3}
						role="list"
						aria-labelledby="professions-lib"
					>
						<SimulateurCard
							small
							{...simulators['auxiliaire-médical']}
							role="listitem"
						/>
						<SimulateurCard
							small
							{...simulators['chirurgien-dentiste']}
							role="listitem"
						/>
						<SimulateurCard small {...simulators.médecin} role="listitem" />
						<SimulateurCard
							small
							{...simulators['sage-femme']}
							role="listitem"
						/>
						<SimulateurCard small {...simulators.pharmacien} role="listitem" />
						<SimulateurCard small {...simulators.avocat} role="listitem" />
						<SimulateurCard
							small
							{...simulators['expert-comptable']}
							role="listitem"
						/>
						<SimulateurCard small {...simulators.cipav} role="listitem" />
					</Grid>
				</>

				<H3 id="assistants">
					<Trans>
						Assistants à la déclaration de revenu 2022 des indépendants
					</Trans>
				</H3>
				<Grid container spacing={3} role="list" aria-labelledby="assistants">
					<SimulateurCard
						{...simulators['déclaration-charges-sociales-indépendant']}
						role="listitem"
					/>
					<SimulateurCard
						{...simulators['déclaration-revenu-indépendant']}
						role="listitem"
					/>
				</Grid>

				<H2 id="autres-outils">
					<Trans>Autres outils</Trans>
				</H2>
				<Grid container spacing={3} role="list" aria-labelledby="autres-outils">
					<SimulateurCard {...simulators.is} role="listitem" />
					<SimulateurCard {...simulators.dividendes} role="listitem" />
					<SimulateurCard
						{...simulators['économie-collaborative']}
						role="listitem"
					/>
					<SimulateurCard {...simulators['demande-mobilité']} role="listitem" />
					<SimulateurCard
						{...simulators['coût-création-entreprise']}
						role="listitem"
					/>
					<SimulateurCard
						{...simulators['recherche-code-ape']}
						role="listitem"
					/>
				</Grid>
			</section>
			<section>
				<Trans i18nKey="pages.simulateurs.accueil.section">
					<Body>Tous les simulateurs sur ce site sont :</Body>
					<Ul>
						<Li>
							<strong>Maintenus à jour</strong> avec les dernières évolutions
							législatives
						</Li>
						<Li>
							<strong>Améliorés en continu</strong> afin d'augmenter le nombre
							de dispositifs pris en compte
						</Li>
						<Li>
							<Strong>Intégrables facilement et gratuitement</Strong> sur
							n'importe quel site internet.{' '}
							<Link to={absoluteSitePaths.développeur.iframe}>
								En savoir plus
							</Link>
							.
						</Li>
					</Ul>
				</Trans>
			</section>
		</>
	)
}

type SimulateurCardProps = MergedSimulatorDataValues & {
	small?: boolean
	fromGérer?: boolean
	role?: string
	as?: string | ComponentType<any> | undefined
}

export function SimulateurCard({
	shortName,
	meta,
	path,
	tooltip,
	iframePath,
	pathId,
	icône,
	beta,
	small = false,
	fromGérer = false,
	as = undefined,
	...props
}: SimulateurCardProps) {
	const isIframe = useIsEmbedded()
	const { t } = useTranslation()

	const ctaLabel =
		pathId.startsWith('assistants') || pathId.startsWith('gérer')
			? t('pages.simulateurs.home.cta.assistant', "Lancer l'assistant")
			: t('pages.simulateurs.home.cta.simulateur', 'Lancer le simulateur')

	return (
		<>
			{small ? (
				<Grid item xs={12} sm={6} md={6} lg={4} {...props}>
					<SmallCard
						icon={<Emoji emoji={icône} />}
						to={{
							pathname:
								(isIframe && `/iframes/${encodeURI(iframePath ?? '')}`) || path,
						}}
						state={fromGérer ? { fromGérer: true } : { fromSimulateurs: true }}
						title={
							<span>
								{shortName} {tooltip && <InfoBulle>{tooltip}</InfoBulle>}
								{beta && (
									<Chip type="info" icon={<Emoji emoji="🚧" />}>
										Bêta
									</Chip>
								)}
							</span>
						}
						role="link"
					/>
				</Grid>
			) : (
				<Grid item xs={12} sm={6} md={6} lg={4} {...props}>
					<Card
						title={
							<>
								{shortName}
								{beta && (
									<Chip type="info" icon={<Emoji emoji="🚧" />}>
										Bêta
									</Chip>
								)}
							</>
						}
						icon={<Emoji emoji={icône} />}
						ctaLabel={ctaLabel}
						aria-label={`${shortName}, ${ctaLabel}`}
						to={{
							pathname:
								(isIframe && `/iframes/${encodeURI(iframePath ?? '')}`) || path,
						}}
						state={fromGérer ? { fromGérer: true } : { fromSimulateurs: true }}
						role="link"
					>
						{meta?.description}
					</Card>
				</Grid>
			)}
		</>
	)
}
