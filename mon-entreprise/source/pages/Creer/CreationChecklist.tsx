import { Grid } from '@mui/material'
import {
	checkCompanyCreationItem,
	initializeCompanyCreationChecklist
} from 'Actions/companyCreationChecklistActions'
import { resetCompanyStatusChoice } from 'Actions/companyStatusActions'
import { FromBottom } from 'Components/ui/animate'
import { CheckItem, Checklist } from 'Components/ui/Checklist'
import Emoji from 'Components/utils/Emoji'
import Scroll from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Button } from 'DesignSystem/buttons'
import { Card } from 'DesignSystem/card'
import { H1, H2 } from 'DesignSystem/typography/heading'
import { Link } from 'DesignSystem/typography/link'
import { Li, Ul } from 'DesignSystem/typography/list'
import { Body, SmallBody } from 'DesignSystem/typography/paragraphs'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import { LegalStatus } from 'Selectors/companyStatusSelectors'
import { TrackPage } from '../../ATInternetTracking'
import StatutDescription from './StatutDescription'

type CreateCompanyProps = {
	statut: LegalStatus
}

export default function CreateCompany({ statut }: CreateCompanyProps) {
	const { t, i18n } = useTranslation()
	const sitePaths = useContext(SitePathsContext)
	const companyCreationChecklist = useSelector(
		(state: RootState) => state.inFranceApp.companyCreationChecklist
	)
	const dispatch = useDispatch()
	const history = useHistory()

	// TODO : add this logic inside selector
	const isAutoentrepreneur = statut.startsWith('auto-entrepreneur')
	const multipleAssociates = ['SARL', 'SAS', 'SA'].includes(statut)
	const isEI = isAutoentrepreneur || statut.startsWith('EI')

	const titre = isAutoentrepreneur
		? t(
				[
					'entreprise.page.autoEntrepreneur.titre',
					'Devenir {{autoEntrepreneur}}',
				],
				{
					autoEntrepreneur: statut,
				}
		  )
		: t(['entreprise.page.entreprise.titre', 'Créer une {{status}}'], {
				status: statut,
		  })

	return (
		<FromBottom>
			<TrackPage chapter2="statut" name={statut} />
			<Helmet>
				<title>{titre}</title>
				<meta
					name="description"
					content={
						isAutoentrepreneur
							? t(
									[
										'entreprise.page.autoEntrepreneur.description',
										'La liste complète des démarches à faire pour devenir {{autoEntrepreneur}}.',
									],
									{ autoEntrepreneur: t(statut) }
							  )
							: t(
									[
										'entreprise.page.description',
										"La liste complète des démarches à faire pour créer une {{statut}} auprès de l'administration française.",
									],
									{ statut: t(statut) }
							  )
					}
				/>
			</Helmet>
			<Scroll.toTop />
			<div css="transform: translateY(2rem);">
				<button
					onClick={() => {
						dispatch(resetCompanyStatusChoice())
						history.push(sitePaths.créer.index)
					}}
					className="ui__ simple small push-left button"
				>
					<Trans i18nKey="entreprise.retour">← Choisir un autre statut</Trans>
				</button>
			</div>

			<H1>{titre}</H1>
			<Body>
				<StatutDescription statut={statut} />
			</Body>

			<H2>
				<Emoji emoji="📋" />{' '}
				<Trans i18nKey="entreprise.tâches.titre">
					À faire pour créer votre entreprise
				</Trans>
			</H2>
			<Body>
				<Trans i18nKey="entreprise.tâches.avancement">
					Utilisez cette liste pour suivre votre avancement dans les démarches.
					Votre progression est automatiquement sauvegardée dans votre
					navigateur.
				</Trans>
			</Body>
			<Checklist
				key={statut}
				onInitialization={(items) =>
					dispatch(initializeCompanyCreationChecklist(statut, items))
				}
				onItemCheck={(name, isChecked) =>
					dispatch(checkCompanyCreationItem(name, isChecked))
				}
				defaultChecked={companyCreationChecklist}
			>
				<CheckItem
					name="legalStatus"
					defaultChecked={true}
					title={t(
						'entreprise.tâches.formeJuridique.titre',
						'Choisir la forme juridique'
					)}
				/>
				{!isEI && (
					<CheckItem
						name="corporateName"
						title={t(
							'entreprise.tâches.nom.titre',
							"Trouver un nom d'entreprise"
						)}
						explanations={
							<Trans i18nKey="entreprise.tâches.nom.description">
								<SmallBody>
									<strong>La dénomination sociale</strong> est le nom de votre
									entreprise aux yeux de la loi, écrit sur tous vos documents
									administratifs. Il peut être différent de votre nom
									commercial.
								</SmallBody>
								<SmallBody>
									Il est conseillé de vérifier que le nom est disponible,
									c'est-à-dire qu'il ne porte pas atteinte à un nom déjà protégé
									par une marque, une raison sociale, un nom commercial, un nom
									de domaine Internet, etc. Vous pouvez vérifier dans la base de
									données{' '}
									<Link href="https://bases-marques.inpi.fr/">INPI</Link>.
								</SmallBody>
							</Trans>
						}
					/>
				)}

				<CheckItem
					name="corporatePurpose"
					title={t(
						'entreprise.tâches.objetSocial.titre',
						"Déterminer l'objet social"
					)}
					explanations={
						<SmallBody>
							<Trans i18nKey="entreprise.tâches.objetSocial.description">
								L'
								<strong>objet social</strong> est l'activité principale de
								l'entreprise. Une activité secondaire peut être enregistrée.
							</Trans>
						</SmallBody>
					}
				/>
				{!isAutoentrepreneur && (
					<CheckItem
						name="companyAddress"
						title={t(
							'entreprise.tâches.adresse.titre',
							'Choisir une adresse pour le siège'
						)}
						explanations={
							<Trans i18nKey="entreprise.tâches.adresse.description">
								<SmallBody>
									<strong>L'adresse</strong> est l'espace physique où votre
									entreprise sera incorporée. Dans certains lieux et certaines
									situations, vous pouvez bénéficier d'un financement public
									important (exonération de charges, de taxes, etc.).{' '}
									<Link href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F2160">
										Plus d'infos
									</Link>
								</SmallBody>
							</Trans>
						}
					/>
				)}
				{!isEI && (
					<CheckItem
						name="statut"
						title={t('entreprise.tâches.statuts.titre', 'Écrire les statuts')}
						explanations={
							<SmallBody>
								<Trans i18nKey="entreprise.tâches.statuts.description">
									Il s'agit d'un document officiel qui intègre la forme
									juridique, nomme les associés et leurs contributions au
									capital.{' '}
									<span
										style={{
											display: multipleAssociates ? 'visible' : 'none',
										}}
									>
										Dans le cas d'une création d'entreprise avec plusieurs
										associés, il est recommandé de faire appel à un juriste pour
										les rédiger.{' '}
									</span>
								</Trans>
								{['SARL', 'EURL'].includes(statut) && (
									<StatutsExample statut={statut} />
								)}
							</SmallBody>
						}
					/>
				)}
				<CheckItem
					name="openBankAccount"
					title={t(
						'entreprise.tâches.banque.titre',
						'Ouvrir un compte bancaire'
					)}
					explanations={
						<>
							<SmallBody>
								<Trans i18nKey="entreprise.tâches.banque.description.1">
									Le but d'un <strong>compte bancaire d'entreprise</strong> est
									de séparer les actifs de l'entreprise des vôtres.
								</Trans>{' '}
								{statut === 'EI' && (
									<Trans i18nKey="entreprise.tâches.banque.description.EI">
										Si son ouverture n'est pas obligatoire pour un IE, elle
										reste fortement recommandée.{' '}
									</Trans>
								)}
								<Trans i18nKey="entreprise.tâches.banque.description.2">
									Le compte d'entreprise vous permet de :
								</Trans>
							</SmallBody>
							<Ul small>
								<Trans i18nKey="entreprise.tâches.banque.description.liste">
									<Li>
										Différencier vos opérations privées et professionnelles
									</Li>
									<Li>Faciliter les déclarations fiscales</Li>
								</Trans>
							</Ul>
						</>
					}
				/>
				{!isEI && (
					<CheckItem
						name="fundsDeposit"
						title={t('entreprise.tâches.capital.titre', 'Déposer le capital')}
						explanations={
							<Trans i18nKey="entreprise.tâches.capital.description">
								<SmallBody>
									Le <strong>dépôt du capital social</strong> doit être fait au
									moment de la constitution d'une société par une personne
									agissant au nom de la société et ayant reçu des apports en
									numéraire (somme d'argent) de la part des créanciers de la
									société (actionnaire ou associé).
								</SmallBody>
								<SmallBody>
									Le dépôt consiste en un transfert d'une somme d'argent sur un
									compte bloqué auprès d'une banque ou de la{' '}
									<Link href="https://consignations.caissedesdepots.fr/entreprise/creer-votre-entreprise/creation-dentreprise-deposez-votre-capital-social">
										Caisse des dépôts et consignations
									</Link>{' '}
									ou d'un notaire, qui doit alors fournir un certificat de dépôt
									du capital.
								</SmallBody>
							</Trans>
						}
					/>
				)}
				{statut.includes('EIRL') && (
					<CheckItem
						name="declarationOfAssignement"
						title={t(
							'entreprise.tâches.affectation.titre',
							"Effectuer une déclaration d'affectation de patrimoine"
						)}
						explanations={
							<Trans i18nKey="entreprise.tâches.affectation.description">
								<SmallBody>
									La <strong>déclaration d'affectation du patrimoine</strong>{' '}
									permet de séparer le patrimoine professionnel de votre
									patrimoine personnel, qui devient alors insaisissable. Cette
									démarche est gratuite si elle est effectué au moment de la
									création d'entreprise.
								</SmallBody>
								<SmallBody>
									Pour cela, il suffit simplement de déclarer quelles biens sont
									affectés au patrimoine de votre entreprise. Tous les apports
									nécessaires à votre activité professionnelle doivent y figurer
									(par exemple : fond de commerce, marque, brevet, ou encore
									matériel professionnel). Vous pouvez vous charger vous-même de
									l'évaluation de la valeur du bien si celle ci ne dépasse pas
									les 30 000 €.
								</SmallBody>
								<SmallBody>
									<Link href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F31538">
										Plus d'informations
									</Link>
								</SmallBody>
							</Trans>
						}
					/>
				)}
				{!isEI && (
					<CheckItem
						title={t(
							'entreprise.tâches.journal.titre',
							'Publier une annonce de création dans un journal'
						)}
						name="publishCreationNotice"
						explanations={
							<Trans i18nKey="entreprise.tâches.journal.description">
								<SmallBody>
									Vous devez publier la création de votre entreprise dans un
									journal d'annonces légales (« JAL »), pour un coût de
									publication qui dépend du volume de l'annonce et des tarifs
									pratiqués par le journal choisi{' '}
								</SmallBody>
								<SmallBody>
									<Link href="https://actulegales.fr/journaux-annonces-legales">
										Trouver un journal d'annonces légales (JAL)
									</Link>
								</SmallBody>
								<SmallBody>
									Cette annonce doit contenir les informations suivantes :{' '}
								</SmallBody>
								<Ul small>
									<Li>Le nom de l'entreprise et éventuellement son acronyme</Li>
									<Li>La forme juridique</Li>
									<Li>Le capital de l'entreprise</Li>
									<Li>L'adresse du siège</Li>
									<Li>L'objet social</Li>
									<Li>La durée de l'entreprise</Li>
									<Li>
										Les noms, prénoms et adresses des dirigeants et des
										personnes ayant le pouvoir d'engager la société envers les
										tiers
									</Li>
									<Li>
										Le lieu et le numéro du RCS auprès duquel la société est
										immatriculée
									</Li>
								</Ul>
							</Trans>
						}
					/>
				)}

				<CheckItem
					name="registerCompanyOnline"
					title={t(
						'entreprise.tâches.formulaire.titre',
						'Créer mon entreprise en ligne'
					)}
					explanations={
						<Trans i18nKey="entreprise.tâches.formulaire.description">
							<SmallBody>
								Vous pouvez faire votre inscription en ligne à tout moment,
								l'enregistrer et y revenir comme vous le souhaitez.
							</SmallBody>
							<Button
								light
								size="XS"
								href={
									isAutoentrepreneur
										? 'https://www.autoentrepreneur.urssaf.fr/portail/accueil/creer-mon-auto-entreprise.html'
										: 'https://account.guichet-entreprises.fr/user/create'
								}
							>
								Faire la démarche en ligne
							</Button>
						</Trans>
					}
				/>
			</Checklist>
			<H2>
				<Emoji emoji="💭" />{' '}
				<Trans i18nKey="entreprise.tâches.titre2">
					Recommandé avant le début de l'activité
				</Trans>
			</H2>

			<Checklist>
				{!isAutoentrepreneur && (
					<CheckItem
						name="chooseCertifiedAccountant"
						title={t(
							'entreprise.tâches.comptable.titre',
							'Choisir un comptable'
						)}
						explanations={
							<SmallBody>
								<Trans i18nKey="entreprise.tâches.comptable.description">
									La gestion d'une entreprise impose un certain nombre d'
									<Link href="https://www.economie.gouv.fr/entreprises/obligations-comptables">
										obligations comptables
									</Link>
									. Il est conseillé de faire appel aux services d'un comptable
									ou d'un logiciel de comptabilité en ligne.
								</Trans>
							</SmallBody>
						}
					/>
				)}
				<CheckItem
					name="checkoutProfessionalAssuranceNeeds"
					title={t(
						'entreprise.tâches.assurance.titre',
						'Juger de la nécessité de prendre une assurance'
					)}
					explanations={
						<Trans i18nKey="entreprise.tâches.assurance.description">
							<SmallBody>
								Une PME ou un travailleur indépendant doit se protéger contre
								les principaux risques auxquels il est exposé et souscrire des
								contrats de garantie. Qu'elle soit locataire ou propriétaire de
								ses murs, l'entreprise doit assurer ses immeubles, son matériel
								professionnel, ses biens, ses matières premières, ses véhicules,
								ainsi qu'en matière de responsabilité civile de l'entreprise et
								de ses dirigeants ou en matière de perte d'exploitation.
							</SmallBody>
							<Link href="https://www.economie.gouv.fr/entreprises/assurances-obligatoires">
								Plus d'infos
							</Link>
						</Trans>
					}
				/>
			</Checklist>
			<H2>
				<Emoji emoji="🧰" /> <Trans>Ressources utiles</Trans>
			</H2>

			<Grid container spacing={2}>
				{isAutoentrepreneur && (
					<Grid item xs={12} sm={6} lg={4}>
						<Card
							title={t(
								'entreprise.ressources.simu.autoEntrepreneur.title',
								'Simulateur de revenus auto-entrepreneur'
							)}
							callToAction={{
								to: {
									pathname: sitePaths.simulateurs['auto-entrepreneur'],
									state: { fromCréer: true },
								},

								label: t(
									'entreprise.ressources.simu.autoEntrepreneur.cta',
									'Simuler les revenus'
								),
							}}
						>
							<Body>
								<Trans i18nKey="entreprise.ressources.simu.autoEntrepreneur.body">
									Simuler le montant de vos cotisations sociales et de votre
									impôt et estimez votre futur revenu net.
								</Trans>
							</Body>
						</Card>
					</Grid>
				)}
				{['EI', 'EIRL', 'EURL'].includes(statut) && (
					<Grid item xs={12} sm={6} lg={4}>
						<Card
							title={t(
								'entreprise.ressources.simu.indépendant.title',
								'Simulateur de cotisations indépendant'
							)}
							callToAction={{
								to: {
									pathname: sitePaths.simulateurs.indépendant,
									state: { fromCréer: true },
								},
								label: t(
									'entreprise.ressources.simu.indépendant.cta',
									'Simuler les cotisations'
								),
							}}
						>
							<Body>
								<Trans i18nKey="entreprise.ressources.simu.indépendant.body">
									Simuler le montant de vos cotisations sociales pour bien
									préparer votre business plan.
								</Trans>
							</Body>
						</Card>
					</Grid>
				)}
				{['SAS', 'SASU'].includes(statut) && (
					<Grid item xs={12} sm={6} lg={4}>
						<Card
							title={t(
								'entreprise.ressources.simu.assimilé.title',
								'Simulateur de rémunération pour dirigeant de SASU'
							)}
							callToAction={{
								to: {
									pathname: sitePaths.simulateurs.sasu,
									state: { fromCréer: true },
								},
								label: t(
									'entreprise.ressources.simu.assimilé.cta',
									'Simuler la rémunération'
								),
							}}
						>
							<Body>
								<Trans i18nKey="entreprise.ressources.simu.assimilé.body">
									Simuler le montant de vos cotisations sociales pour bien
									préparer votre business plan.
								</Trans>
							</Body>
						</Card>
					</Grid>
				)}
				<Grid item xs={12} sm={6} lg={4}>
					<Card
						title={t('entreprise.ressources.après.title', 'Après la création')}
						callToAction={{
							to: sitePaths.créer.après,
							label: t('entreprise.ressources.après.cta', 'Voir le glossaire'),
						}}
					>
						<Body>
							<Trans i18nKey="entreprise.ressources.après.body">
								SIREN, SIRET, code APE, KBis. Un petit glossaire des termes que
								vous pourrez (éventuellement) rencontrer après la création.
							</Trans>
						</Body>
					</Card>
				</Grid>

				{i18n.language === 'fr' && isAutoentrepreneur && (
					<Grid item xs={12} sm={6} lg={4}>
						<Card
							title="Guide pratique Urssaf"
							callToAction={{
								href: 'https://www.autoentrepreneur.urssaf.fr/portail/files/Guides/Metropole/Presentation_AE.pdf',
								label: 'Consulter le guide',
							}}
						>
							<Body>
								Des conseils pour les auto-entrepreneurs : comment préparer son
								projet pour se lancer dans la création et une présentation
								détaillée de votre protection sociale.
							</Body>
						</Card>
					</Grid>
				)}

				{isAutoentrepreneur && (
					<Grid item xs={12} sm={6} lg={4}>
						<FAQAutoEntreprneurCard />
					</Grid>
				)}

				{isAutoentrepreneur && (
					<Grid item xs={12} sm={6} lg={4}>
						<ImpotAECard />
					</Grid>
				)}
				{i18n.language === 'fr' && ['EI', 'EIRL', 'EURL'].includes(statut) && (
					<Grid item xs={12} sm={6} lg={4}>
						<Card
							title="Guide Urssaf pour les travailleur indépendant"
							callToAction={{
								href: 'https://www.urssaf.fr/portail/files/live/sites/urssaf/files/documents/Diaporama_TI_statuts_hors_AE.pdf',
								label: 'Consulter le guide',
							}}
						>
							<Body>
								Des conseils sur comment préparer son projet pour se lancer dans
								la création et une présentation détaillée de votre protection
								sociale.
							</Body>
						</Card>
					</Grid>
				)}
			</Grid>
		</FromBottom>
	)
}

type StatutsExampleProps = {
	statut: string
}

const StatutsExample = ({ statut }: StatutsExampleProps) => {
	const links = {
		SARL: 'https://bpifrance-creation.fr/file/109068/download?token=rmc93Ve3',
		EURL: 'https://bpifrance-creation.fr/file/109070/download?token=Ul-rT6Z0',
	}

	if (!(statut in links)) return null

	return (
		<Link href={links[statut as keyof typeof links]}>
			<Trans i18nKey="entreprise.tâches.statuts.exemple">
				Exemple de statuts pour votre
			</Trans>{' '}
			{statut}
		</Link>
	)
}

export const FAQAutoEntreprneurCard = () => {
	const { t } = useTranslation()
	return (
		<Card
			title={t(
				'pages.common.ressources-auto-entrepreneur.FAQ.title',
				'Questions fréquentes'
			)}
			icon={<Emoji emoji="❓" />}
			callToAction={{
				href: 'https://www.autoentrepreneur.urssaf.fr/portail/accueil/une-question/questions-frequentes.html',
				label: t(
					'pages.common.ressources-auto-entrepreneur.FAQ.cta',
					'Voir les réponses'
				),
			}}
		>
			<Body>
				<Trans i18nKey="pages.common.ressources-auto-entrepreneur.FAQ.body">
					Une liste exhaustive et maintenue à jour de toutes les questions
					fréquentes (et moins fréquentes) que l'on est amené à poser en tant
					qu'auto-entrepreneur
				</Trans>
			</Body>
		</Card>
	)
}

export const ImpotAECard = () => {
	const { t } = useTranslation()
	return (
		<Card
			title={t(
				'pages.common.ressources-auto-entrepreneur.impôt.title',
				'Comment déclarer son revenu aux impôts ?'
			)}
			icon={<Emoji emoji="📑" />}
			callToAction={{
				href: 'https://www.impots.gouv.fr/portail/professionnel/je-choisis-le-regime-du-micro-entrepreneur-auto-entrepreneur',
				label: t(
					'pages.common.ressources-auto-entrepreneur.impôt.cta',
					"Consulter l'aide"
				),
			}}
		>
			<Body>
				<Trans i18nKey="pages.common.ressources-auto-entrepreneur.impôt.body">
					Les informations officielles de l'administration fiscale concernant
					les auto-entrepreneurs et le régime de la micro-entreprise.
				</Trans>
			</Body>
		</Card>
	)
}
