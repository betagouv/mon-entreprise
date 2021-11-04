import {
	checkHiringItem,
	initializeHiringChecklist,
} from 'Actions/hiringChecklistAction'
import { FromBottom } from 'Components/ui/animate'
import { CheckItem, Checklist, ChecklistProps } from 'Components/ui/Checklist'
import { H1, H2, H3 } from 'DesignSystem/typography/heading'
import { Body } from 'DesignSystem/typography/paragraphs'
import { SimulatorRessourceCard } from '../Simulateurs/cards/SimulatorRessourceCard'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { connect, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { TrackPage } from '../../ATInternetTracking'

type EmbaucherProps = {
	onChecklistInitialization: ChecklistProps['onInitialization']
	onItemCheck: ChecklistProps['onItemCheck']
}

function Embaucher({ onChecklistInitialization, onItemCheck }: EmbaucherProps) {
	const { t } = useTranslation()
	const hiringChecklist = useSelector(
		(state: RootState) => state.inFranceApp.hiringChecklist
	)
	return (
		<FromBottom>
			<TrackPage name="embaucher" />
			<Helmet>
				<title>
					{t(['embauche.tâches.page.titre', 'Les formalités pour embaucher'])}
				</title>
				<meta
					name="description"
					content={t(
						'embauche.tâches.page.description',
						"Toutes les démarches nécessaires à l'embauche de votre premier salarié."
					)}
				/>
			</Helmet>
			<H1>
				<Trans i18nKey="embauche.tâches.titre">
					Les formalités pour embaucher
				</Trans>
			</H1>
			<Body>
				<Trans i18nKey="embauche.tâches.description">
					Toutes les étapes nécessaires à l'embauche de votre premier employé.
				</Trans>
			</Body>
			<Checklist
				onInitialization={onChecklistInitialization}
				onItemCheck={onItemCheck}
				defaultChecked={hiringChecklist}
			>
				<CheckItem
					name="contract"
					title={t(
						'embauche.tâches.contrat.titre',
						'Signer un contrat de travail avec votre employé'
					)}
					explanations={
						<Body>
							<a
								className="ui__ button"
								href="https://www.service-public.fr/particuliers/vosdroits/N19871"
								target="_blank"
							>
								{' '}
								<Trans>Plus d'informations</Trans>
							</a>
						</Body>
					}
				/>
				<CheckItem
					name="dpae"
					title={t(
						'embauche.tâches.dpae.titre',
						"Déclarer l'embauche à l'administration sociale"
					)}
					explanations={
						<Body>
							<Trans i18nKey="embauche.tâches.dpae.description">
								Ceci peut être fait par le biais du formulaire appelé DPAE, doit
								être complété dans les 8 jours avant toute embauche, et peut{' '}
								<a href="https://www.due.urssaf.fr" target="_blank">
									être effectué en ligne
								</a>
								.
							</Trans>
						</Body>
					}
				/>
				<CheckItem
					name="paySoftware"
					title={t(
						'embauche.tâches.logiciel de paie.titre',
						'Choisir un logiciel de paie'
					)}
					explanations={
						<Body>
							<Trans i18nKey="embauche.tâches.logiciel de paie.description">
								Les fiches de paie et les déclarations peuvent être traitées en
								ligne gratuitement par le{' '}
								<a href="http://www.letese.urssaf.fr" target="_blank">
									Tese
								</a>
								. Vous pouvez aussi utiliser un{' '}
								<a
									href="http://www.dsn-info.fr/convention-charte.htm"
									target="_blank"
								>
									logiciel de paie privé.
								</a>
							</Trans>
						</Body>
					}
				/>
				<CheckItem
					name="registre"
					title={t(
						'embauche.tâches.registre.titre',
						'Tenir un registre des employés à jour'
					)}
					explanations={
						<Body>
							<a
								href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F1784"
								className="ui__ button"
								target="_blank"
							>
								<Trans>Plus d'informations</Trans>
							</a>
						</Body>
					}
				/>
				<CheckItem
					name="complementaryPension"
					title={t(
						'embauche.tâches.pension.titre',
						"rendre contact avec l'institution de prévoyance complémentaire obligatoire qui vous est assignée"
					)}
					explanations={
						<Body>
							<a
								href="https://www.espace-entreprise.agirc-arrco.fr/simape/#/donneesDep"
								className="ui__ button"
								target="_blank"
							>
								<Trans i18nKey="embauche.tâches.pension.description">
									Trouver mon institution de prévoyance
								</Trans>
							</a>
							{/* // The AGIRC-ARRCO complementary pension is mandatory. Those are only federations,{' '} */}
						</Body>
					}
				/>
				<CheckItem
					name="complementaryHealth"
					title={t(
						'embauche.tâches.complémentaire santé.titre',
						'Choisir une complémentaire santé'
					)}
					explanations={
						<Body>
							<Trans i18nKey="embauche.tâches.complémentaire santé.description">
								Vous devez couvrir vos salariés avec l'assurance complémentaire
								santé privée de votre choix (aussi appelée "mutuelle"), pour
								autant qu'elle offre un ensemble de garanties minimales.
								L'employeur doit payer au moins la moitié du forfait.
							</Trans>
						</Body>
					}
				/>
				<CheckItem
					name="workMedicine"
					title={t(
						'embauche.tâches.medecine.titre',
						"S'inscrire à un bureau de médecine du travail"
					)}
					explanations={
						<Body>
							<Trans i18nKey="embauche.tâches.medecine.description">
								N'oubliez pas de planifier un rendez-vous initial pour chaque
								nouvelle embauche.{' '}
								<a href="https://www.service-public.fr/particuliers/vosdroits/F2211">
									Plus d'infos.
								</a>
							</Trans>
						</Body>
					}
				/>
			</Checklist>
			<Trans i18nKey="embauche.chaque mois">
				<H2>Tous les mois</H2>
				<ul>
					<li>
						Utiliser un logiciel de paie pour calculer les cotisations sociales
						et les transmettre via la déclaration sociale nominative (DSN).
						<br />
						Certaines offres de service de l’Urssaf comme le{' '}
						<a href="https://www.letese.urssaf.fr" target="_blank">
							titre emploi service entreprise (Tese)
						</a>{' '}
						ou le{' '}
						<a href="https://www.cesu.urssaf.fr" target="_blank">
							chèque emploi associatif (CEA)
						</a>{' '}
						gèrent automatiquement la transmission de la DSN pour vous.
					</li>
					<li>Remettre la fiche de paie à votre employé</li>
				</ul>
			</Trans>

			<H3 as="h2">
				<Trans>Ressources utiles</Trans>
			</H3>

			<div className="ui__ box-container">
				<SimulatorRessourceCard simulatorId="salarié" />
			</div>
		</FromBottom>
	)
}

export default connect(
	(state: RootState) => ({
		hiringChecklist: state.inFranceApp.hiringChecklist,
	}),
	{
		onChecklistInitialization: initializeHiringChecklist,
		onItemCheck: checkHiringItem,
	}
)(Embaucher)
