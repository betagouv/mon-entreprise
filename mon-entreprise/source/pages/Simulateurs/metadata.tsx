import RuleLink from 'Components/RuleLink'
import SimulateurWarning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import SalaryExplanation from 'Components/simulationExplanation/SalaryExplanation'
import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import React, { useContext, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { SimulationConfig } from 'Reducers/rootReducer'
import { constructLocalizedSitePath } from '../../sitePaths'
import AideDéclarationIndépendant from '../Gérer/AideDéclarationIndépendant'
import FormulaireMobilitéIndépendant from '../Gérer/DemandeMobilite'
import AidesEmbauche from './AidesEmbauche'
import ArtisteAuteur from './ArtisteAuteur'
import AutoEntrepreneur from './AutoEntrepreneur'
import ChômagePartielComponent from './ChômagePartiel'
import autoEntrepreneurConfig from './configs/auto-entrepreneur.yaml'
import chômageParielConfig from './configs/chômage-partiel.yaml'
import sasuConfig from './configs/dirigeant-sasu.yaml'
import indépendantConfig from './configs/indépendant.yaml'
import professionLibéraleConfig from './configs/profession-libérale.yaml'
import salariéConfig from './configs/salarié.yaml'
import AutoEntrepreneurPreview from './images/AutoEntrepreneurPreview.png'
import ChômagePartielPreview from './images/ChômagePartielPreview.png'
import urlIllustrationNetBrutEn from './images/illustration-net-brut-en.png'
import urlIllustrationNetBrut from './images/illustration-net-brut.png'
import logoFranceRelance from './images/logo-france-relance.svg'
import RémunérationSASUPreview from './images/RémunérationSASUPreview.png'
import salaireBrutNetPreviewEN from './images/SalaireBrutNetPreviewEN.png'
import salaireBrutNetPreviewFR from './images/SalaireBrutNetPreviewFR.png'
import ISSimulation from './ImpôtSociété'
import IndépendantSimulation, {
	EntrepriseIndividuelle,
	IndépendantPLSimulation,
} from './Indépendant'
import PAMCHome from './PAMCHome'
import SalariéSimulation from './Salarié'
import SchemeComparaisonPage from './SchemeComparaison'
import ÉconomieCollaborative from './ÉconomieCollaborative'
import getData from './metadata-src.js'

const simulateurs = [
	'salarié',
	'auto-entrepreneur',
	'indépendant',
	'eirl',
	'eurl',
	'sasu',
	'chômage-partiel',
	'artiste-auteur',
	'comparaison-statuts',
	'entreprise-individuelle',
	'économie-collaborative',
	'aide-déclaration-indépendant',
	'demande-mobilité',
	'profession-libérale',
	'médecin',
	'chirurgien-dentiste',
	'sage-femme',
	'auxiliaire-médical',
	'avocat',
	'expert-comptable',
	'pamc',
	'is',
	'aides-embauche',
] as const

export type SimulatorId = typeof simulateurs[number]

export type SimulatorData = Record<
	SimulatorId,
	{
		meta?: {
			title: string
			description: string
			ogTitle?: string
			ogDescription?: string
			ogImage?: string
			color?: string
		}
		tracking:
			| {
					chapter2?: string
					chapter3?: string
					chapter1?: 'gerer' | 'creer'
			  }
			| string
		icône?: string
		shortName: string
		path?: string
		tooltip?: string
		iframePath?: string
		title?: string
		description?: React.ReactNode
		config?: SimulationConfig
		seoExplanations?: React.ReactNode
		nextSteps?: Array<SimulatorId>
		private?: true
		component: () => JSX.Element
	}
>

export function getSimulatorsData({
	t = (_: unknown, text: string) => text,
	sitePaths = constructLocalizedSitePath('fr'),
	language = 'fr',
} = {}): SimulatorData {
	console.log({ data: getData() })
	const pureSimulatorsData = getData({ t })
	return {
		salarié: {
			...pureSimulatorsData['salarié'],
			config: salariéConfig,
			component: SalariéSimulation,
			meta: {
				...pureSimulatorsData['salarié'].meta,
				ogImage:
					language === 'fr' ? salaireBrutNetPreviewFR : salaireBrutNetPreviewEN,
			},
			path: sitePaths.simulateurs.salarié,
			seoExplanations: (
				<Trans i18nKey="pages.simulateurs.salarié.seo">
					<h2>Comment calculer le salaire net ?</h2>
					<p>
						Lors de l'entretien d'embauche l'employeur propose en général une
						rémunération exprimée en « brut ». Le montant annoncé inclut ainsi
						les cotisations salariales, qui servent à financer la protection
						sociale du salarié et qui sont retranchées du salaire « net » perçu
						par le salarié.
					</p>
					<p>
						Vous pouvez utiliser notre simulateur pour convertir le{' '}
						<strong>salaire brut en net</strong> : il vous suffit pour cela
						saisir la rémunération annoncée dans la case salaire brut. La
						simulation peut-être affinée en répondant aux différentes questions
						(CDD, statut cadre, heures supplémentaires, temps partiel,
						titre-restaurants, etc.).
					</p>
					<img
						src={
							language === 'fr'
								? urlIllustrationNetBrut
								: urlIllustrationNetBrutEn
						}
						alt={t(
							'pages.simulateurs.salarié.alt-image1',
							'Salaire net (perçu par le salarié) = Salaire brut (inscrit dans le contrat de travail) - cotisations salariales (retraite, csg, etc)'
						)}
						css={`
							width: 100%;
						`}
					/>
					<p>
						Par ailleurs depuis 2019, l'
						<RuleLink dottedName="impôt">impôt sur le revenu</RuleLink> est
						prélevé à la source. Pour ce faire, la direction générale des
						finances publiques (DGFiP) transmet à l'employeur le taux
						d'imposition calculé à partir de la déclaration de revenu du
						salarié. Si ce taux est inconnu, par exemple lors d'une première
						année d'activité, l'employeur utilise le{' '}
						<RuleLink dottedName="impôt . taux neutre d'impôt sur le revenu">
							taux neutre
						</RuleLink>
						.
					</p>
					<h2>Comment calculer le coût d'embauche ?</h2>
					<p>
						Si vous cherchez à embaucher, vous pouvez calculer le coût total de
						la rémunération de votre salarié, ainsi que les montants de
						cotisations patronales et salariales correspondant. Cela vous permet
						de définir le niveau de rémunération en connaissant le montant
						global de charge que cela représente pour votre entreprise.
					</p>
					<p>
						En plus du salaire, notre simulateur prend en compte le calcul des
						avantages en nature (téléphone, véhicule de fonction, etc.), ainsi
						que la mutuelle santé obligatoire.
					</p>
					<p>
						Il existe des{' '}
						<RuleLink dottedName="contrat salarié . aides employeur">
							aides différées
						</RuleLink>{' '}
						à l'embauche qui ne sont pas toutes prises en compte par notre
						simulateur, vous pouvez les retrouver sur{' '}
						<a href="http://www.aides-entreprises.fr" target="_blank">
							le portail officiel
						</a>
						.
					</p>
				</Trans>
			),
			nextSteps: ['chômage-partiel', 'aides-embauche'],
		},
		'entreprise-individuelle': {
			...pureSimulatorsData['entreprise-individuelle'],
			config: {
				...indépendantConfig,
				situation: {
					...indépendantConfig.situation,
					'entreprise . imposition': "'IR'",
				},
			},
			meta: {
				...pureSimulatorsData['entreprise-individuelle'].meta,
				ogImage: AutoEntrepreneurPreview,
			},
			component: EntrepriseIndividuelle,
			path: sitePaths.simulateurs['entreprise-individuelle'],
			seoExplanations: (
				<Trans i18nKey="pages.simulateurs.ei.seo explanation">
					<h2>
						Comment calculer le revenu net d'un dirigeant d'entreprise
						individuelle (EI) ?
					</h2>
					<p>
						Un dirigeant d'entreprise individuelle doit payer des cotisations et
						contributions sociales à l'administration. Ces cotisations servent
						au financement de la sécurité sociale, et ouvrent des droits
						notamment pour la retraite et pour l'assurance maladie. Elles
						permettent également de financer la formation professionnelle.
					</p>
					<p>
						<Emoji emoji="👉" />{' '}
						<RuleLink dottedName="dirigeant . indépendant . cotisations et contributions">
							Voir le détail du calcul des cotisations
						</RuleLink>
					</p>
					<p>
						Il ne faut pas oublier de retrancher toutes les dépenses effectuées
						dans le cadre de l'activité professionnelle (équipements, matières
						premières, local, transport). Ces dernières sont déductibles du
						résultat de l'entreprise, cela veut dire que vous ne payerez pas
						d'impôt ou de cotisations sur leur montant (sauf si vous avez opté
						pour l'option micro-fiscal).
					</p>
					<p>
						La formule de calcul complète est donc :
						<blockquote>
							<strong>
								Revenu net = Chiffres d'affaires − Dépenses professionnelles -
								Cotisations sociales
							</strong>
						</blockquote>
					</p>
					<h2>
						Comment calculer les cotisations sociales d'une entreprise
						individuelle ?
					</h2>
					<p>
						Le dirigeant d'une entreprise individuelle paye des cotisations
						sociales, proportionnelle au{' '}
						<RuleLink dottedName="entreprise . résultat fiscal">
							résultat fiscal
						</RuleLink>{' '}
						de l'entreprise. Leur montant varie également en fonction du type
						d'activité (profession libérale, artisan, commerçants, etc), où des
						éventuelles exonérations accordées (ACRE, ZFU, RSA, etc.).
					</p>
					<p>
						{' '}
						Comme le résultat d'une entreprise n'est connu qu'à la fin de
						l'exercice comptable, le dirigeant paye des cotisations
						provisionnelles qui seront ensuite régularisée une fois le revenu
						réel déclaré, l'année suivante.
					</p>
					<p>
						Ce simulateur permet de calculer le montant exact des cotisations
						sociale en partant d'un chiffre d'affaires ou d'un revenu net
						souhaité. Vous pourrez préciser votre situation en répondant aux
						questions s'affichant en dessous de la simulation.
					</p>
				</Trans>
			),
			nextSteps: ['comparaison-statuts'],
		},
		eirl: {
			...pureSimulatorsData['eirl'],
			config: indépendantConfig,
			meta: {
				...pureSimulatorsData['eirl'].meta,
				ogImage: AutoEntrepreneurPreview,
			},
			component: IndépendantSimulation,
			path: sitePaths.simulateurs.eirl,
			nextSteps: ['comparaison-statuts'],
		},
		sasu: {
			...pureSimulatorsData['sasu'],
			config: sasuConfig,
			meta: {
				...pureSimulatorsData['sasu'].meta,
				ogImage: RémunérationSASUPreview,
			},
			path: sitePaths.simulateurs.sasu,
			component: function SasuSimulation() {
				return (
					<>
						<SimulateurWarning simulateur="sasu" />
						<Simulation explanations={<SalaryExplanation />} />
					</>
				)
			},
			seoExplanations: (
				<Trans i18nKey="pages.simulateurs.sasu.seo-explanation">
					<h2>Comment calculer le salaire d'un dirigeant de SASU ? </h2>
					<p>
						Comme pour un salarié classique, le{' '}
						<strong>dirigeant de sasu</strong> paye des cotisations sociales sur
						la rémunération qu'il se verse. Les cotisations sont calculées de la
						même manière que pour le salarié : elles sont décomposées en partie
						employeur et partie salarié et sont exprimées comme un pourcentage
						du salaire brut.
					</p>
					<p>
						Le dirigeant assimilé-salarié ne paye pas de{' '}
						<strong>cotisations chômage</strong>. Par ailleurs, il ne bénéficie
						pas de la{' '}
						<RuleLink dottedName="contrat salarié . réduction générale">
							réduction générale de cotisations
						</RuleLink>{' '}
						ni des dispositifs encadrés par le code du travail comme les{' '}
						<RuleLink dottedName="contrat salarié . temps de travail . heures supplémentaires">
							heures supplémentaires
						</RuleLink>{' '}
						ou les primes.
					</p>
					<p>
						Il peut en revanche prétendre à la{' '}
						<RuleLink dottedName="dirigeant . assimilé salarié . réduction ACRE">
							réduction ACRE
						</RuleLink>{' '}
						en debut d'activité, sous certaines conditions.
					</p>
					<p>
						Vous pouvez utiliser notre simulateur pour calculer la{' '}
						<strong>rémunération nette</strong> à partir d'un montant superbrut
						alloué à la rémunération du dirigeant. Il vous suffit pour cela
						saisir le montant total alloué dans la case "total chargé". La
						simulation peut ensuite être affinée en répondant aux différentes
						questions.
					</p>
				</Trans>
			),
			nextSteps: ['is', 'comparaison-statuts'],
		},
		eurl: {
			...pureSimulatorsData['eurl'],
			config: {
				...indépendantConfig,
				situation: {
					...indépendantConfig.situation,
					'entreprise . imposition': "'IS'",
				},
			},
			meta: {
				...pureSimulatorsData['eurl'].meta,
				ogImage: RémunérationSASUPreview,
			},
			path: sitePaths.simulateurs.eurl,
			component: IndépendantSimulation,
			nextSteps: ['is', 'comparaison-statuts'],
		},
		'auto-entrepreneur': {
			...pureSimulatorsData['auto-entrepreneur'],
			tracking: 'auto_entrepreneur',
			config: autoEntrepreneurConfig,
			icône: '🚶‍♂️',
			iframePath: 'simulateur-autoentrepreneur',
			meta: {
				...pureSimulatorsData['auto-entrepreneur'].meta,
				description: t(
					'pages.simulateurs.auto-entrepreneur.meta.description',
					"Calcul du revenu à partir du chiffre d'affaires, après déduction des cotisations et des impôts"
				),
				ogDescription: t(
					'pages.simulateurs.auto-entrepreneur.meta.ogDescription',
					"Grâce au simulateur de revenu auto-entrepreneur développé par l'Urssaf, vous pourrez estimer le montant de vos revenus en fonction de votre chiffre d'affaires mensuel ou annuel pour mieux gérer votre trésorerie. Ou dans le sens inverse : savoir quel montant facturer pour atteindre un certain revenu."
				),
				ogImage: AutoEntrepreneurPreview,
				ogTitle: t(
					'pages.simulateurs.auto-entrepreneur.meta.ogTitle',
					'Auto-entrepreneur : calculez rapidement votre revenu net à partir du CA et vice-versa'
				),
				title: t(
					'pages.simulateurs.auto-entrepreneur.meta.titre',
					'Auto-entrepreneurs : simulateur de revenus'
				),
			},
			component: AutoEntrepreneur,
			path: sitePaths.simulateurs['auto-entrepreneur'],
			shortName: t(
				'pages.simulateurs.auto-entrepreneur.shortname',
				'Auto-entrepreneur'
			),
			title: t(
				'pages.simulateurs.auto-entrepreneur.title',
				'Simulateur de revenus auto-entrepreneur'
			),
			seoExplanations: (
				<Trans i18nKey="pages.simulateurs.auto-entrepreneur.seo explanation">
					<h2>Comment calculer le revenu net d'un auto-entrepreneur ?</h2>
					<p>
						Un auto-entrepreneur doit payer des cotisations et contributions
						sociales à l'administration. Ces cotisations servent au financement
						de la sécurité sociale, et ouvrent des droits notamment pour la
						retraite et pour l'assurance maladie. Elles permettent également de
						financer la formation professionnelle. Leur montant varie en
						fonction du type d'activité.
					</p>
					<p>
						<Emoji emoji="👉" />{' '}
						<RuleLink dottedName="dirigeant . auto-entrepreneur . cotisations et contributions">
							Voir le détail du calcul des cotisations
						</RuleLink>
					</p>
					<p>
						Il ne faut pas oublier de retrancher toutes les dépenses effectuées
						dans le cadre de l'activité professionnelle (équipements, matières
						premières, local, transport). Bien qu'elles ne soient pas utilisées
						pour le calcul des cotisations et de l'impôt, elles doivent être
						prises en compte pour vérifier si l'activité est viable
						économiquement.
					</p>
					<p>
						La formule de calcul complète est donc :
						<blockquote>
							<strong>
								Revenu net = Chiffres d'affaires − Cotisations sociales −
								Dépenses professionnelles
							</strong>
						</blockquote>
					</p>
					<h2>
						Comment calculer l'impôt sur le revenu pour un auto-entrepreneur ?
					</h2>
					<p>
						Si vous avez opté pour le versement libératoire lors de la création
						de votre auto-entreprise, l'impôt sur le revenu est payé en même
						temps que les cotisations sociales.
					</p>
					<p>
						<Emoji emoji="👉" />{' '}
						<RuleLink dottedName="dirigeant . auto-entrepreneur . impôt . versement libératoire . montant">
							Voir comment est calculé le montant du versement libératoire
						</RuleLink>
					</p>
					<p>
						Sinon, vous serez imposé selon le barème standard de l'impôt sur le
						revenu. Le revenu imposable est alors calculé comme un pourcentage
						du chiffre d'affaires. C'est qu'on appel l'abattement forfaitaire.
						Ce pourcentage varie en fonction du type d'activité excercé. On dit
						qu'il est forfaitaire car il ne prends pas en compte les dépenses
						réelles effectuées dans le cadre de l'activité.
					</p>
					<p>
						<Emoji emoji="👉" />{' '}
						<RuleLink dottedName="dirigeant . auto-entrepreneur . impôt . revenu imposable">
							Voir le détail du calcul du revenu abattu pour un
							auto-entrepreneur
						</RuleLink>
					</p>
				</Trans>
			),
			nextSteps: ['indépendant', 'comparaison-statuts'],
		},
		indépendant: {
			...pureSimulatorsData['indépendant'],
			config: indépendantConfig,
			path: sitePaths.simulateurs.indépendant,
			meta: {
				...pureSimulatorsData['indépendant'].meta,
			},
			component: IndépendantSimulation,
			nextSteps: ['comparaison-statuts', 'is'],
		},
		'artiste-auteur': {
			...pureSimulatorsData['artiste-auteur'],
			meta: {
				...pureSimulatorsData['artiste-auteur'].meta,
			},
			path: sitePaths.simulateurs['artiste-auteur'],
			component: ArtisteAuteur,
		},
		'chômage-partiel': {
			...pureSimulatorsData['chômage-partiel'],
			component: ChômagePartielComponent,
			config: chômageParielConfig,
			path: sitePaths.simulateurs['chômage-partiel'],
			meta: {
				...pureSimulatorsData['chômage-partiel'].meta,
				ogImage: ChômagePartielPreview,
			},
			seoExplanations: (
				<Trans i18nKey="pages.simulateurs.chômage-partiel.seo">
					<h2>Comment calculer l'indemnité d'activité partielle ?</h2>
					<p>
						L'indemnité d'activité partielle de base est fixée par la loi à{' '}
						<strong>70% du brut</strong>. Elle est proratisée en fonction du
						nombre d'heures chômées. Pour un salarié à 2300 € brut mensuel, qui
						travaille à 50% de son temps usuel, cela donne{' '}
						<strong>2300 € × 50% × 70% = 805 €</strong>
					</p>
					<p>
						A cette indemnité de base s'ajoute l'indemnité complémentaire pour
						les salaires proches du SMIC. Ce complément intervient lorsque le
						cumul de la rémunération et de l'indemnité de base est en dessous
						d'un SMIC net. Ces indemnités sont prises en charge par l'employeur,
						qui sera ensuite remboursé en parti ou en totalité par l'État.
					</p>
					<p>
						👉{' '}
						<RuleLink dottedName="contrat salarié . activité partielle . indemnités">
							Voir le détail du calcul de l'indemnité
						</RuleLink>
					</p>
					<h2>Comment calculer la part remboursée par l'État ?</h2>
					<p>
						L'État prend en charge une partie de l'indemnité partielle pour les
						salaires allant jusqu'à <strong>4,5 SMIC</strong>, avec un minimum à
						8,03€ par heures chômée. Concrètement, cela abouti à une prise en
						charge à<strong>100%</strong> pour les salaires proches du SMIC.
						Celle-ci diminue progressivement jusqu'à se stabiliser à{' '}
						<strong>93%</strong> pour les salaires compris{' '}
						<strong>entre 2000 € et 7000 €</strong> (salaire correspondant à la
						limite de 4,5 SMIC).
					</p>
					<p>
						👉{' '}
						<RuleLink dottedName="contrat salarié . activité partielle . indemnisation entreprise">
							Voir le détail du calcul du remboursement de l'indemnité
						</RuleLink>
					</p>
					<h2>Comment déclarer une activité partielle ?</h2>
					<p>
						Face à la crise du coronavirus, les modalités de passage en activité
						partielle ont été allégées. L'employeur est autorisé a placer ses
						salariés en activité partielle avant que la demande officielle ne
						soit déposée. Celui-ci dispose ensuite d'un délai de{' '}
						<strong>30 jours</strong> pour se mettre en règle. Les indemnités
						seront versées avec un effet rétro-actif débutant à la mise en place
						du chômage partiel.
					</p>
					<p>
						👉{' '}
						<a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/R31001">
							Effectuer la demande de chômage partiel
						</a>
					</p>
					<h2>
						{' '}
						Quelles sont les cotisations sociales à payer pour l'indemnité
						d'activité partielle ?
					</h2>
					<p>
						L'indemnité d'activité partielle est soumise à la CSG/CRDS et à une
						contribution maladie dans certains cas. Pour en savoir plus, voir la
						page explicative sur{' '}
						<a href="https://www.urssaf.fr/portail/home/employeur/reduire-ou-cesser-lactivite/la-reduction-ou-la-cessation-tem/lactivite-partielle-dispositif-d/le-regime-social-de-lindemnite-d.html">
							le site de l'Urssaf
						</a>
						.
					</p>
				</Trans>
			),
			nextSteps: ['salarié', 'aides-embauche'],
		},
		'comparaison-statuts': {
			...pureSimulatorsData['comparaison-statuts'],
			component: SchemeComparaisonPage,
			path: sitePaths.simulateurs.comparaison,
			meta: {
				...pureSimulatorsData['comparaison-statuts'].meta,
			},
		},
		'économie-collaborative': {
			...pureSimulatorsData['économie-collaborative'],
			component: ÉconomieCollaborative,
			meta: {
				...pureSimulatorsData['économie-collaborative'].meta,
			},
			path: sitePaths.simulateurs.économieCollaborative.index,
		},
		'aide-déclaration-indépendant': {
			...pureSimulatorsData['aide-déclaration-indépendant'],
			component: AideDéclarationIndépendant,
			tracking: {
				chapter1: 'gerer',
				chapter2: 'aide_declaration_independant',
			},
			meta: {
				...pureSimulatorsData['aide-déclaration-indépendant'].meta,
			},
			path: sitePaths.gérer.déclarationIndépendant,
		},
		'demande-mobilité': {
			...pureSimulatorsData['demande-mobilité'],
			component: FormulaireMobilitéIndépendant,
			tracking: {
				chapter1: 'gerer',
				chapter2: 'demande_mobilite',
			},
			meta: {
				...pureSimulatorsData['demande-mobilité'].meta,
			},
			path: sitePaths.gérer.formulaireMobilité,
		},
		médecin: {
			...pureSimulatorsData['médecin'],
			config: médecinConfig,
			tracking: {
				chapter2: 'profession_liberale',
				chapter3: 'medecin',
			},
			path: sitePaths.simulateurs['profession-libérale'].médecin,
			component: IndépendantPLSimulation,
		},
		'chirurgien-dentiste': {
			...pureSimulatorsData['chirurgien-dentiste'],
			config: dentisteConfig,
			tracking: {
				chapter2: 'profession_liberale',
				chapter3: 'chirurgien_dentiste',
			},
			path: sitePaths.simulateurs['profession-libérale']['chirurgien-dentiste'],
			component: IndépendantPLSimulation,
		},
		'sage-femme': {
			...pureSimulatorsData['sage-femme'],
			config: sageFemmeConfig,
			tracking: {
				chapter2: 'profession_liberale',
				chapter3: 'sage_femme',
			},
			path: sitePaths.simulateurs['profession-libérale']['sage-femme'],
			component: IndépendantPLSimulation,
		},
		'auxiliaire-médical': {
			...pureSimulatorsData['auxiliaire-médical'],
			config: auxiliaireConfig,
			tracking: {
				chapter2: 'profession_liberale',
				chapter3: 'auxiliaire_medical',
			},
			path: sitePaths.simulateurs['profession-libérale'].auxiliaire,
			component: IndépendantPLSimulation,
		},
		avocat: {
			...pureSimulatorsData['avocat'],
			config: avocatConfig,
			tracking: {
				chapter2: 'profession_liberale',
				chapter3: 'avocat',
			},
			path: sitePaths.simulateurs['profession-libérale'].avocat,
			component: IndépendantPLSimulation,
		},
		'expert-comptable': {
			...pureSimulatorsData['expert-comptable'],
			config: expertComptableConfig,
			tracking: {
				chapter2: 'profession_liberale',
				chapter3: 'expert_comptable',
			},
			path: sitePaths.simulateurs['profession-libérale']['expert-comptable'],
			component: IndépendantPLSimulation,
		},
		'profession-libérale': {
			...pureSimulatorsData['profession-libérale'],
			config: professionLibéraleConfig,
			tracking: {
				chapter2: 'profession_liberale',
			},
			meta: {
				...pureSimulatorsData['profession-libérale'].meta,
			},
			path: sitePaths.simulateurs['profession-libérale'].index,
			component: IndépendantPLSimulation,
		},
		pamc: {
			...pureSimulatorsData['pamc'],
			private: true,
			tracking: {},
			path: sitePaths.simulateurs.pamc,
			config: professionLibéraleConfig,
			meta: {
				...pureSimulatorsData['pamc'].meta,
			},
			component: PAMCHome,
		},
		'aides-embauche': {
			...pureSimulatorsData['aides-embauche'],
			tracking: 'aides_embauche',
			meta: {
				...pureSimulatorsData['aides-embauche'].meta,
			},
			path: sitePaths.simulateurs['aides-embauche'],
			// Cette description est surchargé car elle contient ici du JSX
			description: (
				<Trans i18nKey="pages.simulateurs.aides-embauche.introduction">
					<p>
						<a
							href="https://www.gouvernement.fr/france-relance"
							title="Aller sur le site France Relance"
							target="_blank"
						>
							<img
								src={logoFranceRelance}
								alt="Logo France Relance"
								style={{
									width: '120px',
									marginBottom: '1rem',
									marginLeft: '1rem',
									float: 'right',
								}}
							/>
						</a>
						Les employeurs peuvent bénéficier d'une aide financière pour
						l'embauche de certains publics prioritaires. Découvrez les
						dispositifs existants et estimez le montant de l'aide en répondant
						aux questions.
					</p>
				</Trans>
			),
			component: AidesEmbauche,
			nextSteps: ['salarié'],
		},
		is: {
			...pureSimulatorsData['is'],
			tracking: 'impot-societe',
			path: sitePaths.simulateurs.is,
			meta: {
				...pureSimulatorsData['is'].meta,
			},
			component: ISSimulation,
			seoExplanations: (
				<Trans i18nKey="pages.simulateurs.is.seo">
					<h2>Comment est calculé l’impôt sur les sociétés ?</h2>
					<p>
						L’impôt sur les sociétés s’applique aux bénéfices réalisés par les
						sociétés de capitaux (SA, SAS, SASU, SARL, etc.) et sur option
						facultative pour certaines autres sociétés (EIRL, EURL, SNC, etc.).
					</p>
					<p>
						Il est calculé sur la base des bénéfices réalisés en France au cours
						de l’exercice comptable. La durée d’un exercice est normalement d’un
						an mais il peut être plus court ou plus long (notamment en début
						d’activité ou à la dissolution de l’entreprise). Dans ce cas le
						barème de l’impôt est pro-ratisé en fonction de la durée de
						l’exercice, ce qui est pris en compte dans le simulateur en
						modifiant les dates de début et de fin de l’exercice.
					</p>
					<h2>Taux réduit et régimes spécifiques</h2>
					<p>
						Les PME réalisant moins de 7,63 millions d’euros de chiffre
						d’affaires et dont le capital est détenu à 75% par des personnes
						physiques bénéficient d’un taux réduit d’impôt sur les sociétés. Ce
						taux est pris en compte sur le simulateur et il n’est pour l’instant
						pas possible de simuler l’inéligibilité aux taux réduits.
					</p>
					<p>
						Enfin il existe des régimes d’impositions spécifiques avec des taux
						dédiés pour certains types de plus-values (cession de titres,
						cession de brevets). Ces régimes ne sont pas intégrés dans le
						simulateur.
					</p>
				</Trans>
			),
			nextSteps: ['salarié', 'comparaison-statuts'],
		},
	}
}

export default function useSimulatorsData(): SimulatorData {
	const { t, i18n } = useTranslation()
	const sitePaths = useContext(SitePathsContext)

	return useMemo(
		() => getSimulatorsData({ t, sitePaths, language: i18n.language }),
		[t, sitePaths, i18n.language]
	)
}

professionLibéraleConfig as SimulationConfig

const configFromPLMetier = (metier: string): SimulationConfig => ({
	...professionLibéraleConfig,
	situation: {
		...professionLibéraleConfig.situation,
		'entreprise . activité . libérale réglementée': 'oui',
		'dirigeant . indépendant . PL . métier': `'${metier}'`,
	},
})

const auxiliaireConfig = configFromPLMetier('santé . auxiliaire médical')
const dentisteConfig = configFromPLMetier('santé . chirurgien-dentiste')
const médecinConfig = configFromPLMetier('santé . médecin')
const sageFemmeConfig = configFromPLMetier('santé . sage-femme')
const avocatConfig = configFromPLMetier('avocat')
const expertComptableConfig = configFromPLMetier('expert-comptable')
