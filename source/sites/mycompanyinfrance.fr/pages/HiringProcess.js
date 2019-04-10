/* @flow */
import {
	checkHiringItem,
	initializeHiringChecklist
} from 'Actions/hiringChecklistAction'
import { React, T } from 'Components'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose } from 'ramda'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import { CheckItem, Checklist } from 'Ui/Checklist'

const HiringProcess = ({
	onChecklistInitialization,
	sitePaths,
	onItemCheck,
	hiringChecklist,
	t
}) => (
	<Animate.fromBottom>
		<Helmet>
			<title>
				{t(['embauche.tâches.page.titre', `Les formalités pour embaucher`])}
			</title>
			<meta
				name="description"
				content={t(
					'embauche.tâches.page.description',
					`Toutes les démarches nécessaires à l'embauche de votre premier salarié.`
				)}
			/>
		</Helmet>
		<h1>
			<T k="embauche.tâches.titre">Les formalités pour embaucher</T>
		</h1>
		<p>
			<T k="embauche.tâches.description">
				Toutes les étapes nécessaires à l'embauche de votre premier employé.
			</T>
		</p>
		<Checklist
			onInitialization={onChecklistInitialization}
			onItemCheck={onItemCheck}
			defaultChecked={hiringChecklist}>
			<CheckItem
				name="contract"
				title={
					<T k="embauche.tâches.contrat.titre">
						Signer un contrat de travail avec votre employé
					</T>
				}
				explanations={
					<p>
						<a
							className="ui__ button"
							href="https://www.service-public.fr/particuliers/vosdroits/N19871"
							target="_blank">
							{' '}
							<T>Plus d'informations</T>
						</a>
					</p>
				}
			/>
			<CheckItem
				name="dpae"
				title={
					<T k="embauche.tâches.dpae.titre">
						Déclarez votre embauche à l'administration sociale
					</T>
				}
				explanations={
					<p>
						<T k="embauche.tâches.dpae.description">
							Ceci peut être fait par le biais du formulaire appelé DPAE, doit
							être complété dans les 8 jours avant toute embauche, et peut{' '}
							<a
								href="https://www.due.urssaf.fr/declarant/index.jsf"
								target="_blank">
								être effectué en ligne
							</a>
							.
						</T>
					</p>
				}
			/>
			<CheckItem
				name="paySoftware"
				title={
					<T k="embauche.tâches.logiciel de paie.titre">
						Choisir un logiciel de paie
					</T>
				}
				explanations={
					<p>
						<T k="embauche.tâches.logiciel de paie.description">
							Les fiches de paie et les déclarations peuvent être traitées en
							ligne gratuitement par le{' '}
							<a href="http://www.letese.urssaf.fr" target="_blank">
								Tese (Fr)
							</a>
							. Vous pouvez aussi utiliser un{' '}
							<a
								href="http://www.dsn-info.fr/convention-charte.htm"
								target="_blank">
								logiciel de paie privé.
							</a>
						</T>
					</p>
				}
			/>
			<CheckItem
				name="registre"
				title={
					<T k="embauche.tâches.registre.titre">
						Tenir un registre des employés à jour
					</T>
				}
				explanations={
					<p>
						<a
							href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F1784"
							className="ui__ button"
							target="_blank">
							<T>Plus d'informations</T>
						</a>
					</p>
				}
			/>
			<CheckItem
				name="complementaryPension"
				title={
					<T k="embauche.tâches.pension.titre">
						Prendre contact avec l'institution de prévoyance complémentaire
						obligatoire qui vous est assignée
					</T>
				}
				explanations={
					<p>
						<a
							href="https://www.espace-entreprise.agirc-arrco.fr/simape/#/donneesDep"
							className="ui__ button"
							target="_blank">
							<T k="embauche.tâches.pension.description">
								Trouvez votre institut de prévoyance
							</T>
						</a>
						{/* // The AGIRC-ARRCO complementary pension is mandatory. Those are only federations,{' '} */}
					</p>
				}
			/>
			<CheckItem
				name="complementaryHealth"
				title={
					<T k="embauche.tâches.complémentaire santé.titre">
						Choisir une complémentaire santé
					</T>
				}
				explanations={
					<p>
						<T k="embauche.tâches.complémentaire santé.description">
							Vous devez couvrir vos salariés avec l'assurance complémentaire
							santé privée de votre choix (aussi appelée "mutuelle"), pour
							autant qu'elle offre un ensemble de garanties minimales.
							L'employeur doit payer au moins la moitié du forfait.
						</T>
					</p>
				}
			/>
			<CheckItem
				name="workMedicine"
				title={
					<T k="embauche.tâches.medecine.titre">
						S'inscrire à un bureau de médecine du travail
					</T>
				}
				explanations={
					<p>
						<T k="embauche.tâches.medecine.description">
							N'oubliez pas de planifier un rendez-vous initial pour chaque
							nouvelle embauche.
						</T>
					</p>
				}
			/>
		</Checklist>
		<T k="embauche.chaque mois">
			<h2>Tous les mois</h2>
			<ul>
				<li>
					Calculer les cotisations sociales individuelles (à l'aide du logiciel
					de paie choisi)
				</li>
				<li>
					Déclarer les contributions par le biais de la DSN, le nouveau système
					de déclaration en ligne
				</li>
				<li>Remettre la fiche de paie à votre employé</li>
			</ul>
			<Link className="ui__ button" to={sitePaths.sécuritéSociale.salarié}>
				Obtenir un exemple de fiche de paie
			</Link>
		</T>
	</Animate.fromBottom>
)

export default compose(
	withTranslation(),
	withSitePaths,
	connect(
		state => ({ hiringChecklist: state.inFranceApp.hiringChecklist }),
		{
			onChecklistInitialization: initializeHiringChecklist,
			onItemCheck: checkHiringItem
		}
	)
)(HiringProcess)
