/* @flow */
import {
	checkCompanyCreationItem,
	initializeCompanyCreationChecklist
} from 'Actions/companyCreationChecklistActions'
import { goToCompanyStatusChoice } from 'Actions/companyStatusActions'
import { React, T } from 'Components'
import Scroll from 'Components/utils/Scroll'
import { compose } from 'ramda'
import Helmet from 'react-helmet'
import { withI18n } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as Animate from 'Ui/animate'
import { CheckItem, Checklist } from 'Ui/Checklist'
import sitePaths, { LANDING_LEGAL_STATUS_LIST } from '../../sitePaths'
import Page404 from '../404'
import StatusDescription from './StatusDescription'
import type { Match } from 'react-router'
import type { TFunction } from 'react-i18next'

type Props = {
	statusChooserCompleted: boolean,
	match: Match,
	onChecklistInitialization: (string, Array<string>) => void,
	onStatusChange: () => void,
	onItemCheck: (name: string, checked: boolean) => void,
	t: TFunction,
	companyCreationChecklist: { [string]: boolean }
}

const CreateCompany = ({
	match,
	statusChooserCompleted,
	onChecklistInitialization,
	onItemCheck,
	companyCreationChecklist,
	onStatusChange,
	t
}: Props) => {
	const companyStatus = LANDING_LEGAL_STATUS_LIST.find(
		status => t(status) === match.params.status
	)
	if (!companyStatus) {
		return <Page404 />
	}
	return (
		<Animate.fromBottom>
			<Helmet>
				<title>
					{t(['entreprise.tâches.page.titre', 'Créer une {{companyStatus}}'], {
						companyStatus: t(companyStatus)
					})}
				</title>
				<meta
					name="description"
					content={t(
						[
							'entreprise.tâches.page.description',
							`Une liste complète des démarches à faire pour vous aider à créer une {{companyStatus}} auprès de l'administration française.`
						],
						{ companyStatus: t(companyStatus) }
					)}
				/>
			</Helmet>
			<Scroll.toTop />
			<h1>
				<T k="entreprise.tâches.titre">
					Créer une {{ companyStatus: t(companyStatus) }}
				</T>
			</h1>
			{!statusChooserCompleted && (
				<>
					{' '}
					<p>
						<button className="ui__ link-button" onClick={onStatusChange}>
							<T k="formeJuridique.incertain">
								Pas convaincu par cette forme juridique ? Suivez notre guide !
							</T>
						</button>
					</p>
					<p>
						<StatusDescription status={companyStatus} />
					</p>
				</>
			)}
			<h2 style={{ fontSize: '1.5rem' }}>
				<T k="entreprise.tâches.titre1">Pour créer votre société</T>
			</h2>
			<Checklist
				key={companyStatus}
				onInitialization={items =>
					onChecklistInitialization(companyStatus, items)
				}
				onItemCheck={onItemCheck}
				defaultChecked={companyCreationChecklist}>
				{!['EI', 'EIRL', 'micro-entreprise'].includes(companyStatus) && (
					<CheckItem
						name="corporateName"
						title={
							<T k="entreprise.tâches.nom.titre">Trouver un nom d'entreprise</T>
						}
						explanations={
							<T k="entreprise.tâches.nom.description">
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
									données <a href="http://bases-marques.inpi.fr/">INPI</a>.
								</p>
							</T>
						}
					/>
				)}
				<CheckItem
					name="corporatePurpose"
					title={
						<T k="entreprise.tâches.objetSocial.titre">
							Déterminer l'objet social
						</T>
					}
					explanations={
						<p>
							<T k="entreprise.tâches.objetSocial.description">
								L'
								<strong>objet social</strong> est l'activité principale de la
								société. Une activité secondaire peut être enregistrée.
							</T>
						</p>
					}
				/>
				{companyStatus !== 'micro-entreprise' && (
					<CheckItem
						name="companyAddress"
						title={
							<T k="entreprise.tâches.adresse.titre">
								Choisir une adresse pour le siège
							</T>
						}
						explanations={
							<T k="entreprise.tâches.adresse.description">
								<p>
									<strong>L'adresse</strong> est l'espace physique où votre
									entreprise sera incorporée. Dans certains lieux et certaines
									situations, vous pouvez bénéficier d'un financement public
									important (exonération de charges, de taxes, etc.).
									<a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F2160">
										Plus d'infos
									</a>
								</p>
							</T>
						}
					/>
				)}
				{!['EI', 'EIRL', 'micro-entreprise'].includes(companyStatus) && (
					<CheckItem
						name="companyStatus"
						title={
							<T k="entreprise.tâches.statuts.titre">Écrire les statuts</T>
						}
						explanations={
							<p>
								<T k="entreprise.tâches.statuts.description">
									<strong>Les statuts</strong> de l'entreprise sont un document
									officiel qui donne le choix de la forme juridique, nomme les
									associés et leurs contributions au capital. Dans le cas où il
									y a plus d'un associé, il est recommandé de faire appel à un
									juriste pour les rédiger.{' '}
								</T>
								{['SARL', 'EURL'].includes(companyStatus) && (
									<StatutsExample companyStatus={companyStatus} />
								)}
							</p>
						}
					/>
				)}
				<CheckItem
					name="openBankAccount"
					title={
						<T k="entreprise.tâches.banque.titre">Ouvrir un compte bancaire</T>
					}
					explanations={
						<>
							<p>
								<T k="entreprise.tâches.banque.description.1">
									Le but d'un <strong>compte bancaire d'entreprise</strong> est
									de séparer les actifs de l'entreprise des vôtres.
								</T>{' '}
								{companyStatus === 'EI' && (
									<T k="entreprise.tâches.banque.EI">
										Si son ouverture n'est pas obligatoire pour un IE, elle
										reste fortement recommandée.{' '}
									</T>
								)}
								<T k="entreprise.tâches.banque.description.2">
									Le compte d'entreprise vous permet de :
								</T>
							</p>
							<ul>
								<T k="entreprise.tâches.banque.description.liste">
									<li>
										Différencier vos opérations privées et professionnelles et
										simplifier votre gestion de trésorerie
									</li>
									<li>Faciliter toute opération de contrôle fiscal.</li>
								</T>
							</ul>
						</>
					}
				/>
				{!['EI', 'EIRL', 'micro-enterprise'].includes(companyStatus) && (
					<CheckItem
						name="fundsDeposit"
						title={
							<T k="entreprise.tâches.capital.titre">Déposer le capital</T>
						}
						explanations={
							<T k="entreprise.tâches.capital.description">
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
							</T>
						}
					/>
				)}
				{!['EI', 'EIRL', 'micro-entreprise'].includes(companyStatus) && (
					<CheckItem
						title={
							<T k="entreprise.tâches.journal.titre">
								Publier une annonce de création dans un journal
							</T>
						}
						name="publishCreationNotice"
						explanations={
							<T k="entreprise.tâches.journal.description">
								<p>
									Une <strong>annonce légal de création d'entreprise</strong>{' '}
									doit être publié dans un journal d'annonces légales (« JAL »),
									pour un coût de publication qui dépend du volume de l'annonce
									et des tarifs pratiqués par le journal choisi{' '}
								</p>
								<p>
									<a href="https://actulegales.fr/journaux-annonces-legales">
										Trouver un journal d'annonces légales (JAL)
									</a>
								</p>
								<p>
									Pour une SARL ou EURL, cette annonce doit contenir les
									informations suivantes :{' '}
								</p>
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
							</T>
						}
					/>
				)}

				<CheckItem
					name="registerCompanyOnline"
					title={
						<T k="entreprise.tâches.formulaire.titre">
							Créer l'entreprise en ligne
						</T>
					}
					explanations={
						<T k="entreprise.tâches.formulaire.description">
							<p>
								Vous pouvez faire votre d'inscription en ligne à tout moment,
								l'enregistrer et y revenir comme vous le souhaitez.{' '}
							</p>
							<div style={{ textAlign: 'center' }}>
								<a
									className="ui__ button"
									href="https://account.guichet-entreprises.fr/user/create"
									target="blank">
									Faire la démarche en ligne
								</a>
							</div>
						</T>
					}
				/>
			</Checklist>
			<h2 style={{ fontSize: '1.5rem' }}>
				<T k="entreprise.tâches.titre2">
					Recommandées avant le début de l'activité
				</T>
			</h2>

			<Checklist>
				{companyStatus !== 'micro-enterprise' && (
					<CheckItem
						name="chooseCertifiedAccountant"
						title={
							<T k="entreprise.tâches.comptable.titre">
								Choisir un comptable certifié
							</T>
						}
						explanations={
							<p>
								<T k="entreprise.tâches.comptable.description">
									La gestion d'une entreprise impose un certain nombre d'
									<a href="https://www.economie.gouv.fr/entreprises/obligations-comptables">
										obligations comptables
									</a>
									. Il est conseillé de faire appel aux services d'un comptable
									ou d'un logiciel de comptabilité en ligne.
								</T>
							</p>
						}
					/>
				)}
				<CheckItem
					name="checkoutProfessionalAssuranceNeeds"
					title={
						<T k="entreprise.tâches.assurance.titre">
							Juger de la nécessité de prendre une assurance
						</T>
					}
					explanations={
						<T k="entreprise.tâches.assurance.description">
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
						</T>
					}
				/>
			</Checklist>
			<p className="ui__ notice">
				<T k="entreprise.tâches.avancement">
					Utilisez cette liste pour suivre votre avancement dans les démarches.
					Votre progression est automatiquement sauvegardée dans votre
					navigateur.
				</T>
			</p>
			<p style={{ display: 'flex', justifyContent: 'space-between' }}>
				<button onClick={onStatusChange} className="ui__ skip-button left">
					‹ <T k="entreprise.tâches.retour">Choisir un autre statut</T>
				</button>
				<Link to={sitePaths().entreprise.après} className="ui__ skip-button">
					<T k="entreprise.tâches.ensuite">Après la création</T>›
				</Link>
			</p>
		</Animate.fromBottom>
	)
}
export default compose(
	withI18n(),
	connect(
		state => ({
			companyCreationChecklist: state.inFranceApp.companyCreationChecklist,
			statusChooserCompleted:
				Object.keys(state.inFranceApp.companyLegalStatus).length !== 0
		}),
		{
			onChecklistInitialization: initializeCompanyCreationChecklist,
			onItemCheck: checkCompanyCreationItem,
			onStatusChange: goToCompanyStatusChoice
		}
	)
)(CreateCompany)

let StatutsExample = ({ companyStatus }) => (
	<a href="http://media.apce.com/file/72/3/statuts_sarl_(aout_2014).37032.72723.doc">
		<T k="entreprise.tâches.statuts.exemple">Exemple de statuts pour votre</T>
		{companyStatus}
	</a>
)
