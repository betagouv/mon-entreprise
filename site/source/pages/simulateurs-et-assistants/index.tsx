import { Trans, useTranslation } from 'react-i18next'

import { ACCUEIL, TrackPage } from '@/components/ATInternetTracking'
import PageHeader from '@/components/PageHeader'
import { SimulateurCard } from '@/components/SimulateurCard'
import Meta from '@/components/utils/Meta'
import {
	Body,
	Grid,
	H2,
	H3,
	Intro,
	Li,
	Link,
	Strong,
	Ul,
} from '@/design-system'
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
			<TrackPage chapter1="simulateurs" name={ACCUEIL} />
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
					{t(
						'pages.simulateurs.accueil.header',
						'Tous les simulateurs sur ce site sont maintenus à jour avec les dernières évolutions législatives.'
					)}
				</Intro>
			</PageHeader>
			<section>
				<H2 id="salarie-employeurs">
					{t('pages.simulateurs.accueil.1.h2', 'Salariés et employeurs')}
				</H2>
				<Grid
					role="list"
					container
					spacing={3}
					aria-labelledby="salarie-employeurs"
				>
					<SimulateurCard {...simulators.salarié} role="listitem" />
					<SimulateurCard
						{...simulators['activité-partielle']}
						role="listitem"
					/>
				</Grid>

				<H3 id="revenu-dirigeant">
					{t(
						'pages.simulateurs.accueil.1.h3',
						'Revenu du dirigeant par statut'
					)}
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
					<SimulateurCard small {...simulators.sasu} role="listitem" />
					<SimulateurCard small {...simulators.eurl} role="listitem" />
					<SimulateurCard
						small
						{...simulators['comparaison-statuts']}
						role="listitem"
					/>
				</Grid>

				<H2 id="travailleurs-ns">
					{t(
						'pages.simulateurs.accueil.2.h2',
						'Travailleurs et travailleuses Non Salariés (TNS)'
					)}
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
						{t('pages.simulateurs.accueil.2.h3.1', 'Professions libérales')}
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
					{t(
						'pages.simulateurs.accueil.2.h3.2',
						'Assistants à la déclaration de revenus des indépendants'
					)}
				</H3>
				<Grid container spacing={3} role="list" aria-labelledby="assistants">
					<SimulateurCard
						{...simulators['déclaration-charges-sociales-indépendant']}
						role="listitem"
						titleLevel="h4"
					/>
				</Grid>

				<H2 id="autres-outils">
					{t('pages.simulateurs.accueil.3.h2', 'Autres outils')}
				</H2>
				<Grid container spacing={3} role="list" aria-labelledby="autres-outils">
					<SimulateurCard {...simulators['choix-statut']} role="listitem" />
					<SimulateurCard {...simulators.is} role="listitem" />
					<SimulateurCard {...simulators.dividendes} role="listitem" />

					<SimulateurCard
						{...simulators['coût-création-entreprise']}
						role="listitem"
					/>
					<SimulateurCard
						{...simulators['recherche-code-ape']}
						role="listitem"
					/>
					<SimulateurCard
						{...simulators['cessation-activité']}
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
