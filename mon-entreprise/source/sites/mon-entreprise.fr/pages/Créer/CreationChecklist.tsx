import {
	checkCompanyCreationItem,
	initializeCompanyCreationChecklist
} from 'Actions/companyCreationChecklistActions'
import { goToCompanyStatusChoice } from 'Actions/companyStatusActions'
import Scroll from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import { LegalStatus } from 'Selectors/companyStatusSelectors'
import GuideAutoEntrepreneurUrl from './Guide_Auto-Entrepreneur.pdf'

import * as Animate from 'Components/ui/animate'
import { CheckItem, Checklist } from 'Components/ui/Checklist'
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

	// TODO : add this logic inside selector
	const isAutoentrepreneur = statut.startsWith('auto-entrepreneur')
	const multipleAssociates = ['SARL', 'SAS', 'SA'].includes(statut)
	const isEI = isAutoentrepreneur || statut.startsWith('EI')

	const titre = isAutoentrepreneur
		? t(
				[
					'entreprise.page.autoEntrepreneur.titre',
					'Devenir {{autoEntrepreneur}}'
				],
				{
					autoEntrepreneur: statut
				}
		  )
		: t(['entreprise.page.entreprise.titre', 'Créer une {{status}}'], {
				status: statut
		  })
	return (
		<Animate.fromBottom>
			<Helmet>
				<title>{titre}</title>
				<meta
					name="description"
					content={
						isAutoentrepreneur
							? t(
									[
										'entreprise.page.autoEntrepreneur.description',
										'La liste complète des démarches à faire pour devenir {{autoEntrepreneur}}.'
									],
									{ autoEntrepreneur: t(statut) }
							  )
							: t(
									[
										'entreprise.page.description',
										"La liste complète des démarches à faire pour créer une {{statut}} auprès de l'administration française."
									],
									{ statut: t(statut) }
							  )
					}
				/>
			</Helmet>
			<Scroll.toTop />
			<div css="transform: translateY(2rem);">
				<button
					onClick={() => dispatch(goToCompanyStatusChoice())}
					className="ui__ simple small push-left button"
				>
					<Trans i18nKey="entreprise.retour">← Choisir un autre statut</Trans>
				</button>
			</div>

			<h1>{titre}</h1>
			<p>
				<StatutDescription statut={statut} />
			</p>

			<h2>
				{emoji('📋')}{' '}
				<Trans i18nKey="entreprise.tâches.titre">
					À faire pour créer votre entreprise
				</Trans>
			</h2>
			<p className="ui__ notice">
				<Trans i18nKey="entreprise.tâches.avancement">
					Utilisez cette liste pour suivre votre avancement dans les démarches.
					Votre progression est automatiquement sauvegardée dans votre
					navigateur.
				</Trans>
			</p>
			<Checklist
				key={statut}
				onInitialization={items =>
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
					title={
						<Trans i18nKey="entreprise.tâches.formeJuridique.titre">
							Choisir la forme juridique
						</Trans>
					}
				/>
				{!isEI && (
					<CheckItem
						name="corporateName"
						title={
							<Trans i18nKey="entreprise.tâches.nom.titre">
								Trouver un nom d'entreprise
							</Trans>
						}
						explanations={
							<Trans i18nKey="entreprise.tâches.nom.description">
								<p>
									<strong>La dénomination sociale</strong> est le nom de votre
									entreprise aux yeux de la loi, écrit sur tous vos documents
									administratifs. Il peut être différent de votre nom
									commercial.
								</p>
								<p>
									Il est conseillé de vérifier que le nom est disponible,
									c'est-à-dire qu'il ne porte pas atteinte à un nom déjà protégé
									par une marque, une raison sociale, un nom commercial, un nom
									de domaine Internet, etc. Vous pouvez vérifier dans la base de
									données <a href="https://bases-marques.inpi.fr/">INPI</a>.
								</p>
							</Trans>
						}
					/>
				)}

				<CheckItem
					name="corporatePurpose"
					title={
						<Trans i18nKey="entreprise.tâches.objetSocial.titre">
							Déterminer l'objet social
						</Trans>
					}
					explanations={
						<p>
							<Trans i18nKey="entreprise.tâches.objetSocial.description">
								L'
								<strong>objet social</strong> est l'activité principale de
								l'entreprise. Une activité secondaire peut être enregistrée.
							</Trans>
						</p>
					}
				/>
				{!isAutoentrepreneur && (
					<CheckItem
						name="companyAddress"
						title={
							<Trans i18nKey="entreprise.tâches.adresse.titre">
								Choisir une adresse pour le siège
							</Trans>
						}
						explanations={
							<Trans i18nKey="entreprise.tâches.adresse.description">
								<p>
									<strong>L'adresse</strong> est l'espace physique où votre
									entreprise sera incorporée. Dans certains lieux et certaines
									situations, vous pouvez bénéficier d'un financement public
									important (exonération de charges, de taxes, etc.).{' '}
									<a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F2160">
										Plus d'infos
									</a>
								</p>
							</Trans>
						}
					/>
				)}
				{!isEI && (
					<CheckItem
						name="statut"
						title={
							<Trans i18nKey="entreprise.tâches.statuts.titre">
								Écrire les statuts
							</Trans>
						}
						explanations={
							<p>
								<Trans i18nKey="entreprise.tâches.statuts.description">
									Il s'agit d'un document officiel qui intègre la forme
									juridique, nomme les associés et leurs contributions au
									capital.{' '}
									<span
										style={{
											display: multipleAssociates ? 'visible' : 'none'
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
							</p>
						}
					/>
				)}
				<CheckItem
					name="openBankAccount"
					title={
						<Trans i18nKey="entreprise.tâches.banque.titre">
							Ouvrir un compte bancaire
						</Trans>
					}
					explanations={
						<>
							<p>
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
							</p>
							<ul>
								<Trans i18nKey="entreprise.tâches.banque.description.liste">
									<li>
										Différencier vos opérations privées et professionnelles
									</li>
									<li>Faciliter les déclarations fiscales</li>
								</Trans>
							</ul>
						</>
					}
				/>
				{!isEI && (
					<CheckItem
						name="fundsDeposit"
						title={
							<Trans i18nKey="entreprise.tâches.capital.titre">
								Déposer le capital
							</Trans>
						}
						explanations={
							<Trans i18nKey="entreprise.tâches.capital.description">
								<p>
									Le <strong>dépôt du capital social</strong> doit être fait au
									moment de la constitution d'une société par une personne
									agissant au nom de la société et ayant reçu des apports en
									numéraire (somme d'argent) de la part des créanciers de la
									société (actionnaire ou associé).
								</p>
								<p>
									Le dépôt consiste en un transfert d'une somme d'argent sur un
									compte bloqué auprès d'une banque ou de la{' '}
									<a href="https://consignations.caissedesdepots.fr/entreprise/creer-votre-entreprise/creation-dentreprise-deposez-votre-capital-social">
										Caisse des dépôts et consignations
									</a>{' '}
									ou d'un notaire, qui doit alors fournir un certificat de dépôt
									du capital.
								</p>
							</Trans>
						}
					/>
				)}
				{statut.includes('EIRL') && (
					<CheckItem
						name="declarationOfAssignement"
						title={
							<Trans i18nKey="entreprise.tâches.affectation.titre">
								Effectuer une déclaration d'affectation de patrimoine
							</Trans>
						}
						explanations={
							<Trans i18nKey="entreprise.tâches.affectation.description">
								<p>
									La <strong>déclaration d'affectation du patrimoine</strong>{' '}
									permet de séparer le patrimoine professionnel de votre
									patrimoine personnel, qui devient alors insaisissable. Cette
									démarche est gratuite si elle est effectué au moment de la
									création d'entreprise.
								</p>
								<p>
									Pour cela, il suffit simplement de déclarer quelles biens sont
									affectés au patrimoine de votre entreprise. Tous les apports
									nécessaires à votre activité professionnelle doivent y figurer
									(par exemple : fond de commerce, marque, brevet, ou encore
									matériel professionnel). Vous pouvez vous charger vous-même de
									l'évaluation de la valeur du bien si celle ci ne dépasse pas
									les 30 000 €.
								</p>
								<p>
									<a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F31538">
										Plus d'informations
									</a>
								</p>
							</Trans>
						}
					/>
				)}
				{!isEI && (
					<CheckItem
						title={
							<Trans i18nKey="entreprise.tâches.journal.titre">
								Publier une annonce de création dans un journal
							</Trans>
						}
						name="publishCreationNotice"
						explanations={
							<Trans i18nKey="entreprise.tâches.journal.description">
								<p>
									Vous devez publier la création de votre entreprise dans un
									journal d'annonces légales (« JAL »), pour un coût de
									publication qui dépend du volume de l'annonce et des tarifs
									pratiqués par le journal choisi{' '}
								</p>
								<p>
									<a href="https://actulegales.fr/journaux-annonces-legales">
										Trouver un journal d'annonces légales (JAL)
									</a>
								</p>
								<p>Cette annonce doit contenir les informations suivantes : </p>
								<ul>
									<li>Le nom de l'entreprise et éventuellement son acronyme</li>
									<li>La forme juridique</li>
									<li>Le capital de l'entreprise</li>
									<li>L'adresse du siège</li>
									<li>L'objet social</li>
									<li>La durée de l'entreprise</li>
									<li>
										Les noms, prénoms et adresses des dirigeants et des
										personnes ayant le pouvoir d'engager la société envers les
										tiers
									</li>
									<li>
										Le lieu et le numéro du RCS auprès duquel la société est
										immatriculée
									</li>
								</ul>
							</Trans>
						}
					/>
				)}

				<CheckItem
					name="registerCompanyOnline"
					title={
						<Trans i18nKey="entreprise.tâches.formulaire.titre">
							Créer mon entreprise en ligne
						</Trans>
					}
					explanations={
						<Trans i18nKey="entreprise.tâches.formulaire.description">
							<p>
								Vous pouvez faire votre inscription en ligne à tout moment,
								l'enregistrer et y revenir comme vous le souhaitez.
							</p>
							<div style={{ textAlign: 'center' }}>
								<a
									className="ui__ button"
									href={
										isAutoentrepreneur
											? 'https://www.autoentrepreneur.urssaf.fr/portail/accueil/creer-mon-auto-entreprise.html'
											: 'https://account.guichet-entreprises.fr/user/create'
									}
									target="blank"
								>
									Faire la démarche en ligne
								</a>
							</div>
						</Trans>
					}
				/>
			</Checklist>
			<h2>
				{emoji('💭')}{' '}
				<Trans i18nKey="entreprise.tâches.titre2">
					Recommandé avant le début de l'activité
				</Trans>
			</h2>

			<Checklist>
				{!isAutoentrepreneur && (
					<CheckItem
						name="chooseCertifiedAccountant"
						title={
							<Trans i18nKey="entreprise.tâches.comptable.titre">
								Choisir un comptable
							</Trans>
						}
						explanations={
							<p>
								<Trans i18nKey="entreprise.tâches.comptable.description">
									La gestion d'une entreprise impose un certain nombre d'
									<a href="https://www.economie.gouv.fr/entreprises/obligations-comptables">
										obligations comptables
									</a>
									. Il est conseillé de faire appel aux services d'un comptable
									ou d'un logiciel de comptabilité en ligne.
								</Trans>
							</p>
						}
					/>
				)}
				<CheckItem
					name="checkoutProfessionalAssuranceNeeds"
					title={
						<Trans i18nKey="entreprise.tâches.assurance.titre">
							Juger de la nécessité de prendre une assurance
						</Trans>
					}
					explanations={
						<Trans i18nKey="entreprise.tâches.assurance.description">
							<p>
								Une PME ou un travailleur indépendant doit se protéger contre
								les principaux risques auxquels il est exposé et souscrire des
								contrats de garantie. Qu'elle soit locataire ou propriétaire de
								ses murs, l'entreprise doit assurer ses immeubles, son matériel
								professionnel, ses biens, ses matières premières, ses véhicules,
								ainsi qu'en matière de responsabilité civile de l'entreprise et
								de ses dirigeants ou en matière de perte d'exploitation.
							</p>
							<a href="https://www.economie.gouv.fr/entreprises/assurances-obligatoires">
								Plus d'infos
							</a>
						</Trans>
					}
				/>
			</Checklist>
			<h2>
				{emoji('🧰')} <Trans>Ressources utiles</Trans>
			</h2>
			<div className="ui__ box-container">
				{isAutoentrepreneur && (
					<Link
						className="ui__ interactive card small box lighter-bg"
						to={{
							pathname: sitePaths.simulateurs['auto-entrepreneur'],
							state: { fromCréer: true }
						}}
					>
						<Trans i18nKey="entreprise.ressources.simu.autoEntrepreneur">
							<p>Simulateur de revenus auto-entrepreneur</p>
							<p className="ui__ notice">
								Simuler le montant de vos cotisations sociales et de votre impôt
								et estimez votre futur revenu net.
							</p>
						</Trans>
					</Link>
				)}
				{['EI', 'EIRL', 'EURL'].includes(statut) && (
					<Link
						className="ui__ interactive card small box lighter-bg"
						to={{
							pathname: sitePaths.simulateurs.indépendant,
							state: { fromCréer: true }
						}}
					>
						<Trans i18nKey="entreprise.ressources.simu.indépendant">
							<p>Simulateur de cotisations indépendant</p>
							<p className="ui__ notice">
								Simuler le montant de vos cotisations sociales pour bien
								préparer votre business plan.
							</p>
						</Trans>
					</Link>
				)}
				{['SAS', 'SASU'].includes(statut) && (
					<Link
						className="ui__ interactive card small box lighter-bg"
						to={{
							pathname: sitePaths.simulateurs.SASU,
							state: { fromCréer: true }
						}}
					>
						<Trans i18nKey="entreprise.ressources.simu.assimilé">
							<p>Simulateur de rémunération pour dirigeant de SASU</p>
							<p className="ui__ notice">
								Simuler le montant de vos cotisations sociales pour bien
								préparer votre business plan.
							</p>
						</Trans>
					</Link>
				)}
				<Link
					className="ui__ interactive card small box lighter-bg"
					to={sitePaths.créer.après}
				>
					<Trans i18nKey="entreprise.ressources.après">
						<p>Après la création</p>
						<p className="ui__ notice">
							SIREN, SIRET, code APE, KBis. Un petit glossaire des termes que
							vous pourrez (éventuellement) rencontrer après la création.
						</p>
					</Trans>
				</Link>
				{isAutoentrepreneur && <RessourceAutoEntrepreneur />}
				{i18n.language === 'fr' && ['EI', 'EIRL', 'EURL'].includes(statut) && (
					<a
						target="_blank"
						className="ui__ interactive card small box lighter-bg"
						href="https://www.urssaf.fr/portail/files/live/sites/urssaf/files/documents/Guide-Travailleurs-independants.pdf"
					>
						<p>Guide Urssaf pour les travailleur indépendant</p>
						<p className="ui__ notice">
							Des conseils sur comment préparer son projet pour se lancer dans
							la création et une présentation détaillée de votre protection
							sociale.
						</p>
						<br />
						<div css="text-align: right">
							<small className="ui__ label">PDF</small>
						</div>
					</a>
				)}
			</div>
		</Animate.fromBottom>
	)
}

type StatutsExampleProps = {
	statut: string
}

const StatutsExample = ({ statut }: StatutsExampleProps) => {
	const links = {
		SARL: 'https://bpifrance-creation.fr/file/109068/download?token=rmc93Ve3',
		EURL: 'https://bpifrance-creation.fr/file/109070/download?token=Ul-rT6Z0'
	}

	if (!(statut in links)) return null

	return (
		<a target="_blank" href={links[statut as keyof typeof links]}>
			<Trans i18nKey="entreprise.tâches.statuts.exemple">
				Exemple de statuts pour votre
			</Trans>{' '}
			{statut}
		</a>
	)
}

export function RessourceAutoEntrepreneur() {
	const { i18n } = useTranslation()
	return (
		<>
			<Trans i18nKey="pages.common.ressources-auto-entrepreneur.FAQ">
				<a
					className="ui__ interactive card small box lighter-bg"
					href="https://www.autoentrepreneur.urssaf.fr/portail/accueil/une-question/questions-frequentes.html"
					target="_blank"
				>
					<p>Questions fréquentes</p>
					<p className="ui__ notice">
						Une liste exhaustive et maintenue à jour de toutes les questions
						fréquentes (et moins fréquentes) que l'on est amené à poser en tant
						qu'auto-entrepreneur
					</p>
				</a>
			</Trans>
			{i18n.language === 'fr' && (
				<a
					className="ui__ interactive card small box lighter-bg"
					href={GuideAutoEntrepreneurUrl}
					download="guide-devenir-auto-entrepreneur-en-2020"
				>
					<p>Guide pratique Urssaf</p>
					<p className="ui__ notice">
						Des conseils pour les auto-entrepreneurs : comment préparer son
						projet pour se lancer dans la création et une présentation détaillée
						de votre protection sociale.
					</p>

					<div css="text-align: right">
						<small className="ui__ label">PDF</small>
					</div>
				</a>
			)}
			<Trans i18nKey="pages.common.ressources-auto-entrepreneur.impôt">
				<a
					className="ui__ interactive card small box lighter-bg"
					target="_blank"
					href="https://www.impots.gouv.fr/portail/professionnel/je-choisis-le-regime-du-micro-entrepreneur-auto-entrepreneur"
				>
					<p>Comment déclarer son revenu aux impôts ?</p>
					<p className="ui__ notice">
						Les informations officielles de l'administration fiscale concernant
						les auto-entrepreneurs et le régime de la micro-entreprise.
					</p>
				</a>
			</Trans>
		</>
	)
}
