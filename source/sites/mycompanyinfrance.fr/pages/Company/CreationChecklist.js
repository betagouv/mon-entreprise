/* @flow */
import {
	checkCompanyCreationItem,
	initializeCompanyCreationChecklist
} from 'Actions/companyCreationChecklistActions'
import { goToCompanyStatusChoice } from 'Actions/companyStatusActions'
import { React, T } from 'Components'
import Scroll from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose } from 'ramda'
import Helmet from 'react-helmet'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as Animate from 'Ui/animate'
import { CheckItem, Checklist } from 'Ui/Checklist'
import { LANDING_LEGAL_STATUS_LIST } from '../../sitePaths'
import Page404 from '../404'
import StatusDescription from './StatusDescription'

import type { Match } from 'react-router'
import type { TFunction } from 'react-i18next'

type Props = {
	statusChooserCompleted: boolean,
	match: Match,
	onChecklistInitialization: (string, Array<string>) => void,
	onStatusChange: () => void,
	sitePaths: Object,
	onItemCheck: (name: string, checked: boolean) => void,
	t: TFunction,
	companyCreationChecklist: { [string]: boolean }
}

const CreateCompany = ({
	match,
	statusChooserCompleted,
	onChecklistInitialization,
	onItemCheck,
	sitePaths,
	companyCreationChecklist,
	onStatusChange,
	t
}: Props) => {
	const companyStatus = LANDING_LEGAL_STATUS_LIST.find(
		status => t(status) === match.params.status
	)
	const isAutoentrepreneur = [
		'auto-entrepreneur',
		'auto-entrepreneur-EIRL'
	].includes(companyStatus)
	const multipleAssociates = ['SARL', 'SAS', 'SA'].includes(companyStatus)
	const isEI = isAutoentrepreneur || ['EI', 'EIRL'].includes(companyStatus)
	if (!companyStatus) {
		return <Page404 />
	}
	const titre = isAutoentrepreneur
		? t(
				[
					'entreprise.tâches.page.autoEntrepreneur.titre',
					'Comment devenir {{autoEntrepreneur}}'
				],
				{
					autoEntrepreneur: t(companyStatus)
				}
		  )
		: t(
				[
					'entreprise.tâches.page.entreprise.titre',
					'Créer une {{companyStatus}}'
				],
				{
					companyStatus: t(companyStatus)
				}
		  )
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
										'entreprise.tâches.page.autoEntrepreneur.description',
										`La liste complète des démarches à faire pour devenir {{autoEntrepreneur}}.`
									],
									{ autoEntrepreneur: t(companyStatus) }
							  )
							: t(
									[
										'entreprise.tâches.page.description',
										`La liste complète des démarches à faire pour créer une {{companyStatus}} auprès de l'administration française.`
									],
									{ companyStatus: t(companyStatus) }
							  )
					}
				/>
			</Helmet>
			<Scroll.toTop />
			<h1>{titre}</h1>
			{!statusChooserCompleted && (
				<>
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
			<Checklist
				key={companyStatus}
				onInitialization={items =>
					onChecklistInitialization(companyStatus, items)
				}
				onItemCheck={onItemCheck}
				defaultChecked={companyCreationChecklist}>
				{!isEI && (
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
								<strong>objet social</strong> est l'activité principale de
								l'entreprise. Une activité secondaire peut être enregistrée.
							</T>
						</p>
					}
				/>
				{!isAutoentrepreneur && (
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
									important (exonération de charges, de taxes, etc.).{' '}
									<a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F2160">
										Plus d'infos
									</a>
								</p>
							</T>
						}
					/>
				)}
				{!isEI && (
					<CheckItem
						name="companyStatus"
						title={
							<T k="entreprise.tâches.statuts.titre">Écrire les statuts</T>
						}
						explanations={
							<p>
								<T k="entreprise.tâches.statuts.description">
									Il s'agit d'un document officiel qui intègre la forme
									juridique, nomme les associés et leurs contributions au
									capital.{' '}
									<span
										style={{
											display: multipleAssociates ? 'visible' : 'none'
										}}>
										Dans le cas d'une création d'entreprise avec plusieurs
										associés, il est recommandé de faire appel à un juriste pour
										les rédiger.{' '}
									</span>
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
									<T k="entreprise.tâches.banque.description.EI">
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
				{!isEI && (
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
				{companyStatus.includes('EIRL') && (
					<CheckItem
						name="declarationOfAssignement"
						title={
							<T k="entreprise.tâches.affectation.titre">
								Effectuer une déclaration d'affectation de patrimoine
							</T>
						}
						explanations={
							<T k="entreprise.tâches.affectation.description">
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
							</T>
						}
					/>
				)}
				{!isEI && (
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
					Recommandé avant le début de l'activité
				</T>
			</h2>

			<Checklist>
				{!isAutoentrepreneur && (
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
			<p
				className="ui__ answer-group"
				style={{ justifyContent: 'space-between' }}>
				<button
					onClick={onStatusChange}
					className="ui__ simple skip button left">
					← <T k="entreprise.tâches.retour">Choisir un autre statut</T>
				</button>
				<Link
					to={sitePaths.entreprise.après}
					className="ui__ simple skip button">
					<T k="entreprise.tâches.ensuite">Après la création</T> →
				</Link>
			</p>
		</Animate.fromBottom>
	)
}
export default compose(
	withNamespaces(),
	withSitePaths,
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
