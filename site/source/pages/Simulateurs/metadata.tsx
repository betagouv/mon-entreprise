import { PlaceDesEntreprisesButton } from '@/components/PlaceDesEntreprises'
import RuleLink from '@/components/RuleLink'
import Emoji from '@/components/utils/Emoji'
import { Strong } from '@/design-system/typography'
import { H2 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import { AbsoluteSitePaths, useSitePaths } from '@/sitePaths'
import { createContext, useMemo } from 'react'
import { TFunction, Trans, useTranslation } from 'react-i18next'
import Créer from '../Creer/Home'
import DéclarationChargeSocialeIndépendant from '../gerer/declaration-charges-sociales-independant'
import DéclarationRevenuIndépendant from '../gerer/declaration-revenu-independants'
import FormulaireMobilitéIndépendant from '../gerer/demande-mobilité'
import ArtisteAuteur from './ArtisteAuteur'
import AutoEntrepreneur from './AutoEntrepreneur'
import ChômagePartielComponent from './ChômagePartiel'
import { configAutoEntrepreneur } from './configs/autoEntrepreneur'
import { configChômagePartiel } from './configs/chômagePartiel'
import { configSASU } from './configs/dirigeantSASU'
import { configDividendes } from './configs/dividendes'
import {
	configEirl,
	configEntrepriseIndividuelle,
	configEurl,
	configIndépendant,
} from './configs/indépendant'
import {
	configAuxiliaire,
	configAvocat,
	configDentiste,
	configExpertComptable,
	configMédecin,
	configPharmacien,
	configProfessionLibérale,
	configSageFemme,
} from './configs/professionLibérale'
import { configSalarié } from './configs/salarié'
import DividendesSimulation from './Dividendes'
import ÉconomieCollaborative from './EconomieCollaborative'
import ExonérationCovid from './ExonerationCovid'
import AutoEntrepreneurPreview from './images/AutoEntrepreneurPreview.png'
import ChômagePartielPreview from './images/ChômagePartielPreview.png'
import urlIllustrationNetBrutEn from './images/illustration-net-brut-en.png'
import urlIllustrationNetBrut from './images/illustration-net-brut.png'
import RémunérationSASUPreview from './images/RémunérationSASUPreview.png'
import salaireBrutNetPreviewEN from './images/SalaireBrutNetPreviewEN.png'
import salaireBrutNetPreviewFR from './images/SalaireBrutNetPreviewFR.png'
import ISSimulation from './ImpôtSociété'
import IndépendantSimulation, {
	EntrepriseIndividuelle,
	IndépendantPLSimulation,
} from './Indépendant'
import getData from './metadata-src.js'
import PAMCHome from './PAMCHome'
import SalariéSimulation from './Salarié'
import { SASUSimulation } from './SASU'
import SchemeComparaisonPage from './SchemeComparaison'

interface SimulatorsDataParams {
	t: TFunction<'translation', string>
	sitePaths: AbsoluteSitePaths
	language: string
}

function getSimulatorsData({ t, sitePaths, language }: SimulatorsDataParams) {
	const pureSimulatorsData = getData(t)

	return {
		salarié: {
			...pureSimulatorsData['salarié'],
			config: configSalarié,
			component: SalariéSimulation,
			meta: {
				...pureSimulatorsData['salarié'].meta,
				ogImage:
					language === 'fr' ? salaireBrutNetPreviewFR : salaireBrutNetPreviewEN,
			},
			path: sitePaths.simulateurs.salarié,
			seoExplanations: (
				<Trans i18nKey="pages.simulateurs.salarié.seo">
					<H2>Comment calculer le salaire net ?</H2>
					<Body>
						Lors de l'entretien d'embauche l'employeur propose en général une
						rémunération exprimée en « brut ». Le montant annoncé inclut ainsi
						les cotisations salariales, qui servent à financer la protection
						sociale du salarié et qui sont retranchées du salaire « net » perçu
						par le salarié.
					</Body>
					<Body>
						Vous pouvez utiliser notre simulateur pour convertir le{' '}
						<strong>salaire brut en net</strong> : il vous suffit pour cela
						saisir la rémunération annoncée dans la case salaire brut. La
						simulation peut-être affinée en répondant aux différentes questions
						(CDD, statut cadre, heures supplémentaires, temps partiel,
						titre-restaurants, etc.).
					</Body>
					<img
						src={
							language === 'fr'
								? urlIllustrationNetBrut
								: urlIllustrationNetBrutEn
						}
						alt={t(
							'pages.simulateurs.salarié.alt-image1',
							'Salaire net (perçu par le salarié) est égal à Salaire brut (inscrit dans le contrat de travail) moins cotisations salariales (retraite, csg, etc)'
						)}
						css={`
							width: 100%;
						`}
					/>
					<Body>
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
					</Body>
					<H2>Comment calculer le coût d'embauche ?</H2>
					<Body>
						Si vous cherchez à embaucher, vous pouvez calculer le coût total de
						la rémunération de votre salarié, ainsi que les montants de
						cotisations patronales et salariales correspondant. Cela vous permet
						de définir le niveau de rémunération en connaissant le montant
						global de charge que cela représente pour votre entreprise.
					</Body>
					<Body>
						En plus du salaire, notre simulateur prend en compte le calcul des
						avantages en nature (téléphone, véhicule de fonction, etc.), ainsi
						que la mutuelle santé obligatoire.
					</Body>
					<Body>
						Il existe des{' '}
						<RuleLink dottedName="salarié . coût total employeur . aides">
							aides différées
						</RuleLink>{' '}
						à l'embauche qui ne sont pas toutes prises en compte par notre
						simulateur, vous pouvez les retrouver sur{' '}
						<Link
							href="http://www.aides-entreprises.fr"
							aria-label="le portail officiel, accéder à aides-entreprises.fr, nouvelle fenêtre"
						>
							le portail officiel
						</Link>
						.
					</Body>
					<div className="print-hidden">
						<H2>
							Échanger avec un conseiller pour votre projet de recrutement
						</H2>
						<Body as="div">
							Vous souhaitez :
							<Ul>
								<Li>
									Être conseillé(e) sur les aides à l'embauche mobilisables pour
									votre recrutement
								</Li>
								<Li>
									Vous informer sur l'apprentissage, le contrat de
									professionnalisation, les emplois francs en quartiers
									prioritaires, le{' '}
									<abbr title="Volontariat Territorial en Entreprise">VTE</abbr>
									...
								</Li>
								<Li>Trouver des candidats</Li>
								<Li>Recruter une personne en situation de handicap</Li>
							</Ul>
							<Strong>
								Service public simple et rapide : vous êtes rappelé(e) par le
								conseiller qui peut vous aider.
							</Strong>
						</Body>
						<Body>
							Partenaires mobilisés : Pôle emploi, APEC, Cap Emploi, missions
							locales...
						</Body>
						<PlaceDesEntreprisesButton pathname="/aide-entreprise/rh-mon-entreprise-urssaf-fr/theme/recrutement-formation#section-breadcrumbs" />
					</div>
				</Trans>
			),
		},
		'entreprise-individuelle': {
			...pureSimulatorsData['entreprise-individuelle'],
			config: configEntrepriseIndividuelle,
			meta: {
				...pureSimulatorsData['entreprise-individuelle']?.meta,
				ogImage: AutoEntrepreneurPreview,
			},
			component: EntrepriseIndividuelle,
			path: sitePaths.simulateurs['entreprise-individuelle'],
			seoExplanations: (
				<Trans i18nKey="pages.simulateurs.ei.seo explanation">
					<H2>
						Comment calculer le revenu net d'un dirigeant d'entreprise
						individuelle (EI) ?
					</H2>
					<Body>
						Un dirigeant d'entreprise individuelle doit payer des cotisations et
						contributions sociales à l'administration. Ces cotisations servent
						au financement de la sécurité sociale, et ouvrent des droits
						notamment pour la retraite et pour l'assurance maladie. Elles
						permettent également de financer la formation professionnelle.
					</Body>
					<Body>
						<Emoji emoji="👉" />{' '}
						<RuleLink dottedName="dirigeant . indépendant . cotisations et contributions">
							Voir le détail du calcul des cotisations
						</RuleLink>
					</Body>
					<Body>
						Il ne faut pas oublier de retrancher toutes les dépenses effectuées
						dans le cadre de l'activité professionnelle (équipements, matières
						premières, local, transport). Ces dernières sont déductibles du
						résultat de l'entreprise, cela veut dire que vous ne payerez pas
						d'impôt ou de cotisations sur leur montant (sauf si vous avez opté
						pour l'option micro-fiscal).
					</Body>
					<Body>La formule de calcul complète est donc :</Body>
					<blockquote>
						<strong>
							Revenu net = Chiffres d'affaires − Dépenses professionnelles -
							Cotisations sociales
						</strong>
					</blockquote>
					<H2>
						Comment calculer les cotisations sociales d'une entreprise
						individuelle ?
					</H2>
					<Body>
						Le dirigeant d'une entreprise individuelle paye des cotisations
						sociales, proportionnelle au{' '}
						<RuleLink dottedName="entreprise . résultat fiscal">
							résultat fiscal
						</RuleLink>{' '}
						de l'entreprise. Leur montant varie également en fonction du type
						d'activité (profession libérale, artisan, commerçants, etc), où des
						éventuelles exonérations accordées (ACRE, ZFU, RSA, etc.).
					</Body>
					<Body>
						{' '}
						Comme le résultat d'une entreprise n'est connu qu'à la fin de
						l'exercice comptable, le dirigeant paye des cotisations
						provisionnelles qui seront ensuite régularisée une fois le revenu
						réel déclaré, l'année suivante.
					</Body>
					<Body>
						Ce simulateur permet de calculer le montant exact des cotisations
						sociale en partant d'un chiffre d'affaires ou d'un revenu net
						souhaité. Vous pourrez préciser votre situation en répondant aux
						questions s'affichant en dessous de la simulation.
					</Body>
				</Trans>
			),
		},
		eirl: {
			...pureSimulatorsData.eirl,
			config: configEirl,
			meta: {
				...pureSimulatorsData.eirl?.meta,
				ogImage: AutoEntrepreneurPreview,
			},
			component: IndépendantSimulation,
			path: sitePaths.simulateurs.eirl,
			nextSteps: ['comparaison-statuts'],
		},
		sasu: {
			...pureSimulatorsData.sasu,
			config: configSASU,
			meta: {
				...pureSimulatorsData.sasu?.meta,
				ogImage: RémunérationSASUPreview,
			},
			path: sitePaths.simulateurs.sasu,
			component: SASUSimulation,
			seoExplanations: (
				<Trans i18nKey="pages.simulateurs.sasu.seo-explanation">
					<H2>Comment calculer le salaire d'un dirigeant de SASU ? </H2>
					<Body>
						Comme pour un salarié classique, le{' '}
						<strong>dirigeant de sasu</strong> paye des cotisations sociales sur
						la rémunération qu'il se verse. Les cotisations sont calculées de la
						même manière que pour le salarié : elles sont décomposées en partie
						employeur et partie salarié et sont exprimées comme un pourcentage
						du salaire brut.
					</Body>
					<Body>
						Le dirigeant assimilé-salarié ne paye pas de{' '}
						<strong>cotisations chômage</strong>. Par ailleurs, il ne bénéficie
						pas de la{' '}
						<RuleLink dottedName="salarié . cotisations . exonérations . réduction générale">
							réduction générale de cotisations
						</RuleLink>{' '}
						ni des dispositifs encadrés par le code du travail comme les{' '}
						<RuleLink dottedName="salarié . temps de travail . heures supplémentaires">
							heures supplémentaires
						</RuleLink>{' '}
						ou les primes.
					</Body>
					<Body>
						Il peut en revanche prétendre à la{' '}
						<RuleLink dottedName="dirigeant . assimilé salarié . réduction ACRE">
							réduction ACRE
						</RuleLink>{' '}
						en debut d'activité, sous certaines conditions.
					</Body>
					<Body>
						Vous pouvez utiliser notre simulateur pour calculer la{' '}
						<strong>rémunération nette</strong> à partir d'un montant superbrut
						alloué à la rémunération du dirigeant. Il vous suffit pour cela
						saisir le montant total alloué dans la case "total chargé". La
						simulation peut ensuite être affinée en répondant aux différentes
						questions.
					</Body>
				</Trans>
			),
		},
		eurl: {
			...pureSimulatorsData.eurl,
			config: configEurl,
			meta: {
				...pureSimulatorsData.eurl?.meta,
				ogImage: RémunérationSASUPreview,
			},
			path: sitePaths.simulateurs.eurl,
			component: IndépendantSimulation,
		},
		'auto-entrepreneur': {
			...pureSimulatorsData['auto-entrepreneur'],
			tracking: 'auto_entrepreneur',
			config: configAutoEntrepreneur,
			meta: {
				...pureSimulatorsData['auto-entrepreneur']?.meta,
				ogImage: AutoEntrepreneurPreview,
			},
			component: AutoEntrepreneur,
			path: sitePaths.simulateurs['auto-entrepreneur'],

			seoExplanations: (
				<Trans i18nKey="pages.simulateurs.auto-entrepreneur.seo explanation">
					<H2>Comment calculer le revenu net d'un auto-entrepreneur ?</H2>
					<Body>
						Un auto-entrepreneur doit payer des cotisations et contributions
						sociales à l'administration. Ces cotisations servent au financement
						de la sécurité sociale, et ouvrent des droits notamment pour la
						retraite et pour l'assurance maladie. Elles permettent également de
						financer la formation professionnelle. Leur montant varie en
						fonction du type d'activité.
					</Body>
					<Body>
						<Emoji emoji="👉" />{' '}
						<RuleLink dottedName="dirigeant . auto-entrepreneur . cotisations et contributions">
							Voir le détail du calcul des cotisations
						</RuleLink>
					</Body>
					<Body>
						Il ne faut pas oublier de retrancher toutes les dépenses effectuées
						dans le cadre de l'activité professionnelle (équipements, matières
						premières, local, transport). Bien qu'elles ne soient pas utilisées
						pour le calcul des cotisations et de l'impôt, elles doivent être
						prises en compte pour vérifier si l'activité est viable
						économiquement.
					</Body>
					<Body>La formule de calcul complète est donc :</Body>
					<blockquote>
						<strong>
							Revenu net = Chiffres d'affaires − Cotisations sociales − Dépenses
							professionnelles
						</strong>
					</blockquote>
					<H2>
						Comment calculer l'impôt sur le revenu pour un auto-entrepreneur ?
					</H2>
					<Body>
						Si vous avez opté pour le versement libératoire lors de la création
						de votre auto-entreprise, l'impôt sur le revenu est payé en même
						temps que les cotisations sociales.
					</Body>
					<Body>
						<Emoji emoji="👉" />{' '}
						<RuleLink dottedName="dirigeant . auto-entrepreneur . impôt . versement libératoire . montant">
							Voir comment est calculé le montant du versement libératoire
						</RuleLink>
					</Body>
					<Body>
						Sinon, vous serez imposé selon le barème standard de l'impôt sur le
						revenu. Le revenu imposable est alors calculé comme un pourcentage
						du chiffre d'affaires. C'est qu'on appel l'abattement forfaitaire.
						Ce pourcentage varie en fonction du type d'activité excercé. On dit
						qu'il est forfaitaire car il ne prend pas en compte les dépenses
						réelles effectuées dans le cadre de l'activité.
					</Body>
					<Body>
						<Emoji emoji="👉" />{' '}
						<RuleLink dottedName="dirigeant . auto-entrepreneur . impôt . revenu imposable">
							Voir le détail du calcul du revenu abattu pour un
							auto-entrepreneur
						</RuleLink>
					</Body>
				</Trans>
			),
		},
		indépendant: {
			...pureSimulatorsData['indépendant'],
			config: configIndépendant,
			path: sitePaths.simulateurs.indépendant,
			component: IndépendantSimulation,
		},
		'artiste-auteur': {
			...pureSimulatorsData['artiste-auteur'],
			path: sitePaths.simulateurs['artiste-auteur'],
			component: ArtisteAuteur,
		},
		'chômage-partiel': {
			...pureSimulatorsData['chômage-partiel'],
			component: ChômagePartielComponent,
			config: configChômagePartiel,
			path: sitePaths.simulateurs['chômage-partiel'],
			meta: {
				...pureSimulatorsData['chômage-partiel']?.meta,
				ogImage: ChômagePartielPreview,
			},
			seoExplanations: (
				<Trans i18nKey="pages.simulateurs.chômage-partiel.seo">
					<H2>Comment calculer l'indemnité d'activité partielle ?</H2>
					<Body>
						L'indemnité d'activité partielle de base est fixée par la loi à{' '}
						<strong>70% du brut</strong>. Elle est proratisée en fonction du
						nombre d'heures chômées. Pour un salarié à 2300 € brut mensuel, qui
						travaille à 50% de son temps usuel, cela donne{' '}
						<strong>2300 € × 50% × 70% = 805 €</strong>
					</Body>
					<Body>
						A cette indemnité de base s'ajoute l'indemnité complémentaire pour
						les salaires proches du SMIC. Ce complément intervient lorsque le
						cumul de la rémunération et de l'indemnité de base est en dessous
						d'un SMIC net. Ces indemnités sont prises en charge par l'employeur,
						qui sera ensuite remboursé en parti ou en totalité par l'État.
					</Body>
					<Body>
						👉{' '}
						<RuleLink dottedName="salarié . activité partielle . indemnités">
							Voir le détail du calcul de l'indemnité
						</RuleLink>
					</Body>
					<H2>Comment calculer la part remboursée par l'État ?</H2>
					<Body>
						L'État prend en charge une partie de l'indemnité partielle pour les
						salaires allant jusqu'à <strong>4,5 SMIC</strong>, avec un minimum à
						8,03€ par heures chômée. Concrètement, cela abouti à une prise en
						charge à<strong>100%</strong> pour les salaires proches du SMIC.
						Celle-ci diminue progressivement jusqu'à se stabiliser à{' '}
						<strong>93%</strong> pour les salaires compris{' '}
						<strong>entre 2000 € et 7000 €</strong> (salaire correspondant à la
						limite de 4,5 SMIC).
					</Body>
					<Body>
						👉{' '}
						<RuleLink dottedName="salarié . activité partielle . indemnisation entreprise">
							Voir le détail du calcul du remboursement de l'indemnité
						</RuleLink>
					</Body>
					<H2>Échanger avec un conseiller sur l'activité partielle</H2>
					<Body as="div">
						Vous souhaitez :
						<Ul>
							<Li>vérifier l'allocation perçue, le reste à charge</Li>
							<Li>
								connaître la procédure de consultation du{' '}
								<abbr title="Comité social et économique">CSE</abbr>, la demande
								d'autorisation préalable
							</Li>
							<Li>vous informer sur l'activité partielle longue durée</Li>
							<Li>
								former vos salariés en activité partielle à de nouvelles
								compétences (coûts pédagogique pris en charge)
							</Li>
						</Ul>
						<Body>
							Service public simple et rapide : vous êtes rappelé(e) par le
							conseiller qui peut vous aider. Partenaires mobilisés : les
							directions départementales de l'emploi, du travail et des
							solidarités.
						</Body>
						<PlaceDesEntreprisesButton pathname="/aide-entreprise/activite-partielle-mon-entreprise-urssaf-fr/demande/activite-partielle" />
					</Body>
					<H2>Comment déclarer une activité partielle ?</H2>
					<Body>
						Face à la crise du coronavirus, les modalités de passage en activité
						partielle ont été allégées. L'employeur est autorisé a placer ses
						salariés en activité partielle avant que la demande officielle ne
						soit déposée. Celui-ci dispose ensuite d'un délai de{' '}
						<strong>30 jours</strong> pour se mettre en règle. Les indemnités
						seront versées avec un effet rétro-actif débutant à la mise en place
						du chômage partiel.
					</Body>
					<Body>
						👉{' '}
						<a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/R31001">
							Effectuer la demande de chômage partiel
						</a>
					</Body>
					<H2>
						{' '}
						Quelles sont les cotisations sociales à payer pour l'indemnité
						d'activité partielle ?
					</H2>
					<Body>
						L'indemnité d'activité partielle est soumise à la CSG/CRDS et à une
						contribution maladie dans certains cas. Pour en savoir plus, voir la
						page explicative sur{' '}
						<a href="https://www.urssaf.fr/portail/home/employeur/reduire-ou-cesser-lactivite/la-reduction-ou-la-cessation-tem/lactivite-partielle-dispositif-d/le-regime-social-de-lindemnite-d.html">
							le site de l'Urssaf
						</a>
						.
					</Body>
				</Trans>
			),
			nextSteps: ['salarié'],
		},
		'comparaison-statuts': {
			...pureSimulatorsData['comparaison-statuts'],
			component: SchemeComparaisonPage,
			path: sitePaths.simulateurs.comparaison,
		},
		'économie-collaborative': {
			...pureSimulatorsData['économie-collaborative'],
			component: ÉconomieCollaborative,
			path: sitePaths.simulateurs.économieCollaborative.index,
		},
		'choix-statut': {
			...pureSimulatorsData['choix-statut'],
			component: Créer,
			path: sitePaths.créer.guideStatut.index,
		},
		'déclaration-charges-sociales-indépendant': {
			...pureSimulatorsData['déclaration-charges-sociales-indépendant'],
			component: DéclarationChargeSocialeIndépendant,
			path: sitePaths.gérer['déclaration-charges-sociales-indépendant'],
		},
		'déclaration-revenu-indépendant': {
			...pureSimulatorsData['déclaration-revenu-indépendant'],
			component: DéclarationChargeSocialeIndépendant,
			path: sitePaths.gérer.déclarationIndépendant.index,
		},
		'déclaration-revenu-indépendant-beta': {
			...pureSimulatorsData['déclaration-revenu-indépendant-beta'],
			component: DéclarationRevenuIndépendant,
			path: sitePaths.gérer.déclarationIndépendant.beta.index,
		},
		'demande-mobilité': {
			...pureSimulatorsData['demande-mobilité'],
			component: FormulaireMobilitéIndépendant,
			path: sitePaths.gérer.formulaireMobilité,
		},
		pharmacien: {
			...pureSimulatorsData.pharmacien,
			config: configPharmacien,
			path: sitePaths.simulateurs['profession-libérale'].pharmacien,
			component: IndépendantPLSimulation,
		},
		médecin: {
			...pureSimulatorsData['médecin'],
			config: configMédecin,
			path: sitePaths.simulateurs['profession-libérale'].médecin,
			component: IndépendantPLSimulation,
		},
		'chirurgien-dentiste': {
			...pureSimulatorsData['chirurgien-dentiste'],
			config: configDentiste,
			path: sitePaths.simulateurs['profession-libérale']['chirurgien-dentiste'],
			component: IndépendantPLSimulation,
		},
		'sage-femme': {
			...pureSimulatorsData['sage-femme'],
			config: configSageFemme,
			path: sitePaths.simulateurs['profession-libérale']['sage-femme'],
			component: IndépendantPLSimulation,
		},
		'auxiliaire-médical': {
			...pureSimulatorsData['auxiliaire-médical'],
			config: configAuxiliaire,
			path: sitePaths.simulateurs['profession-libérale'].auxiliaire,
			component: IndépendantPLSimulation,
		},
		avocat: {
			...pureSimulatorsData.avocat,
			config: configAvocat,
			path: sitePaths.simulateurs['profession-libérale'].avocat,
			component: IndépendantPLSimulation,
		},
		'expert-comptable': {
			...pureSimulatorsData['expert-comptable'],
			config: configExpertComptable,
			path: sitePaths.simulateurs['profession-libérale']['expert-comptable'],
			component: IndépendantPLSimulation,
		},
		'profession-libérale': {
			...pureSimulatorsData['profession-libérale'],
			config: configProfessionLibérale,
			path: sitePaths.simulateurs['profession-libérale'].index,
			component: IndépendantPLSimulation,
		},
		pamc: {
			...pureSimulatorsData.pamc,
			path: sitePaths.simulateurs.pamc,
			config: configProfessionLibérale,
			component: PAMCHome,
		},
		is: {
			...pureSimulatorsData.is,
			path: sitePaths.simulateurs.is,
			component: ISSimulation,
			seoExplanations: (
				<Trans i18nKey="pages.simulateurs.is.seo">
					<H2>Comment est calculé l’impôt sur les sociétés ?</H2>
					<Body>
						L’impôt sur les sociétés s’applique aux bénéfices réalisés par les
						sociétés de capitaux (SA, SAS, SASU, SARL, etc.) et sur option
						facultative pour certaines autres sociétés (EIRL, EURL, SNC, etc.).
					</Body>
					<Body>
						Il est calculé sur la base des bénéfices réalisés en France au cours
						de l’exercice comptable. La durée d’un exercice est normalement d’un
						an mais il peut être plus court ou plus long (notamment en début
						d’activité ou à la dissolution de l’entreprise). Dans ce cas le
						barème de l’impôt est pro-ratisé en fonction de la durée de
						l’exercice, ce qui est pris en compte dans le simulateur en
						modifiant les dates de début et de fin de l’exercice.
					</Body>
					<H2>Taux réduit et régimes spécifiques</H2>
					<Body>
						Les PME réalisant moins de 7,63 millions d’euros de chiffre
						d’affaires et dont le capital est détenu à 75% par des personnes
						physiques bénéficient d’un taux réduit d’impôt sur les sociétés. Ce
						taux est pris en compte sur le simulateur et il n’est pour l’instant
						pas possible de simuler l’inéligibilité aux taux réduits.
					</Body>
					<Body>
						Enfin il existe des régimes d’impositions spécifiques avec des taux
						dédiés pour certains types de plus-values (cession de titres,
						cession de brevets). Ces régimes ne sont pas intégrés dans le
						simulateur.
					</Body>
				</Trans>
			),
		},
		dividendes: {
			...pureSimulatorsData.dividendes,
			path: sitePaths.simulateurs.dividendes,
			component: DividendesSimulation,
			config: configDividendes,
			seoExplanations: (
				<Trans i18nKey="pages.simulateurs.dividendes.seo">
					<H2>Les dividendes et distributions</H2>
					<Body>
						À la fin de l'exercice d'une société, le résultat de l'exercice
						précédent peut être conservé en réserve (pour de futurs
						investissements) ou bien être versé en dividendes. Du point de vue
						des bénéficiaires, ce sont des revenus de capitaux mobiliers, soumis
						à cotisations et à une imposition spécifiques.
					</Body>
					<Body>
						Ne sont pris en compte dans ce simulateur que les cas de figure du
						bénéficiaire personne physique et des dividendes décidés par la
						société.
					</Body>
					<H2>Comment sont calculés les prélèvements sur les dividendes ?</H2>
					<Body>
						Les dividendes peuvent être soumis au prélèvement forfaitaire unique
						de 30% incluant imposition et contributions sociales (aussi appelé
						<i> flat tax</i>). Par option, le barème de l'impôt peut être
						choisi. Ce simulateur peut être utilisé pour comparer les deux
						régimes.
					</Body>
					<Body>
						Un acompte du montant de l'impôt (12,8%) est prélevé au moment du
						versement des dividendes, sauf si le bénéficiaire remplit{' '}
						<a
							target="_blank"
							rel="noreferrer"
							aria-label="certains critères, en savoir plus sur service-public.fr, nouvelle fenêtre"
							href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F32963"
						>
							certains critères
						</a>
						.
					</Body>
					<H2>Cas particulier du dirigeant non salarié</H2>
					<Body>
						Pour le travailleur indépendant non salarié, la part des dividendes
						dépassant 10% du capital social sera soumise aux cotisations et
						contributions suivant les mêmes modalités que sa rémunération de
						dirigeant.
					</Body>
					<Body>
						Ce cas de figure n'est pas encore pris en compte par ce simulateur.
					</Body>
				</Trans>
			),
		},
		'exonération-covid': {
			...pureSimulatorsData['exonération-covid'],
			path: sitePaths.simulateurs['exonération-covid'],
			component: ExonérationCovid,
		},
	} as const
}

export type SimulatorData = ReturnType<typeof getSimulatorsData>

/**
 * Extract type if U extends T
 * Else return an object with value undefined
 */
type ExtractOrUndefined<T, U> = T extends U ? T : Record<keyof U, undefined>

/**
 * Extract type from a key of SimulatorData
 */
export type ExtractFromSimuData<T extends string> = ExtractOrUndefined<
	SimulatorData[keyof SimulatorData],
	Record<T, unknown>
>[T]

export default function useSimulatorsData(): SimulatorData {
	const { t, i18n } = useTranslation()
	const { absoluteSitePaths } = useSitePaths()

	return useMemo(
		() =>
			getSimulatorsData({
				t,
				sitePaths: absoluteSitePaths,
				language: i18n.language,
			}),
		[t, absoluteSitePaths, i18n.language]
	)
}

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

export const CurrentSimulatorDataContext = createContext<Overwrite<
	SimulatorData[keyof SimulatorData],
	{ path: ExtractFromSimuData<'path'> }
> | null>(null)

export const CurrentSimulatorDataProvider = CurrentSimulatorDataContext.Provider
