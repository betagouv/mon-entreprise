/* @flow */
import { React, T } from 'Components';
import withSitePaths from 'Components/utils/withSitePaths';
import { compose } from 'ramda';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import { NavLink, } from 'react-router-dom';
import {  withRouter } from "react-router";
import companySvg from '../../images/company.svg';
import estimateSvg from '../../images/estimate.svg';
import hiringSvg from '../../images/hiring.svg';
import './Navigation.css';
import NavOpener from './NavOpener';
import SideBar from './SideBar';
import type { TFunction } from 'react-i18next'

type OwnProps = {};
type Props = OwnProps & {
	companyProgress: number,
	estimationProgress: number,
	sitePaths: Object,
	hiringProgress: number,
	companyStatusChoice: string,
	t: TFunction
}
const StepsHeader = ({ t, sitePaths, companyStatusChoice }: Props) => (
	<SideBar>
		<div className="navigation__container">
			<nav className="navigation">
				<ul>
					<li>
						<NavLink to='/' exact className="navigationItem"><T>Accueil</T></NavLink>
					</li>
						<li>
						<NavOpener
							to={sitePaths.entreprise.index}
							exact={false}
							title={
								<>
									<T>Votre entreprise</T>
									<img
										style={{ height: '2.5rem', marginBottom: '-0.8rem' }}
										src={companySvg}
									/>
								</>
							}>
							<ul>
								<li>
									<NavOpener title={t('Créer votre entreprise')}>
										<ul>
											<li>
												<NavOpener
													to={sitePaths.entreprise.statutJuridique}
													title={t('Guide du statut juridique')}>
													<ul>
														<li>
															<NavLink
																to={
																	sitePaths.entreprise.statutJuridique
																		.multipleAssociates
																}>
																<T k="associés.titre">Nombre d'associés</T>
															</NavLink>
														</li>
														<li>
															<NavLink
																to={
																	sitePaths.entreprise.statutJuridique
																		.directorStatus
																}>
																<T k="statut du dirigeant.titre">
																	Statut du dirigeant
																</T>
															</NavLink>
														</li>
														<li>
															<NavLink
																to={
																	sitePaths.entreprise.statutJuridique.liability
																}>
																<T k="responsabilité.titre">Responsabilité</T>
															</NavLink>
														</li>
														<li>
															<NavLink
																to={
																	sitePaths.entreprise.statutJuridique
																		.minorityDirector
																}>
																<T k="gérant minoritaire.titre">
																	Gérant majoritaire ou minoritaire
																</T>
															</NavLink>
														</li>
														<li>
															<NavLink
																to={
																	sitePaths.entreprise.statutJuridique
																		.autoEntrepreneur
																}>
																<T k="autoentrepreneur.titre">
																	Auto-entrepreneur ou EI
																</T>
															</NavLink>
														</li>
														<li>
															<NavLink
																to={sitePaths.entreprise.statutJuridique.liste}>
																<T>Liste des statuts</T>
															</NavLink>
														</li>
													</ul>
												</NavOpener>
											</li>
											<li>
												{/* Todo remove when no choice */}
												<NavOpener
													to={
														companyStatusChoice
															? sitePaths.entreprise.créer(companyStatusChoice)
															: null
													}
													title={t('Démarches de création')}>
													<ul>
														<li>
															<NavLink
																to={sitePaths.entreprise.créer(
																	'auto-entrepreneur'
																)}>
																<T>Auto-entrepreneur</T>
															</NavLink>
														</li>
														<li>
															<NavLink to={sitePaths.entreprise.créer('EI')}>
																EI
															</NavLink>
														</li>
														<li>
															<NavLink to={sitePaths.entreprise.créer('EIRL')}>
																EIRL
															</NavLink>
														</li>
														<li>
															<NavLink to={sitePaths.entreprise.créer('EURL')}>
																EURL
															</NavLink>
														</li>
														<li>
															<NavLink to={sitePaths.entreprise.créer('SA')}>
																SA
															</NavLink>
														</li>
														<li>
															<NavLink to={sitePaths.entreprise.créer('SARL')}>
																SARL
															</NavLink>
														</li>
														<li>
															<NavLink to={sitePaths.entreprise.créer('SAS')}>
																SAS
															</NavLink>
														</li>
														<li>
															<NavLink to={sitePaths.entreprise.créer('SASU')}>
																SASU
															</NavLink>
														</li>
														<li>
															<NavLink to={sitePaths.entreprise.créer('SNC')}>
																SNC
															</NavLink>
														</li>
													</ul>
												</NavOpener>
											</li>
											<li>
												<NavLink to={sitePaths.entreprise.après}>
													<T k="entreprise.tâches.ensuite">Après la création</T>
												</NavLink>
											</li>
										</ul>
									</NavOpener>
								</li>
								<li>
									<NavLink to={sitePaths.entreprise.trouver}>
										<T k="trouver.titre">Retrouver votre entreprise</T>
									</NavLink>
								</li>
							</ul>
						</NavOpener>
					</li>
					<li>
						<NavOpener
							exact
							to={sitePaths.sécuritéSociale.index}
							title={
								<>
									<T>Protection sociale</T>
									<img
										style={{ height: '2.5rem', marginBottom: '-0.8rem' }}
										src={estimateSvg}
									/>
								</>
							}>
							<ul>
							{!['mycompanyinfrance.fr', 'mon-entreprise.fr'].includes(window.location.hostname) &&
								<li>
									<NavOpener title={<T>Statut du dirigeant</T>}>
										<ul>
											<li>
												<NavLink
													exact
													to={sitePaths.sécuritéSociale['assimilé-salarié']}>
													<T>Assimilé salarié</T>
												</NavLink>
											</li>
											<li>
												<NavLink
													exact
													to={sitePaths.sécuritéSociale.indépendant}>
													<T>Indépendant</T>
												</NavLink>
											</li>
											<li>
												<NavLink
													exact
													to={sitePaths.sécuritéSociale['auto-entrepreneur']}>
													<T>Auto-entrepreneur</T>
												</NavLink>
											</li>
											<li>
												<NavLink
													exact
													to={sitePaths.sécuritéSociale.comparaison}>
													<T>Comparaison des régimes</T>
												</NavLink>
											</li>
										</ul>
									</NavOpener>
								</li>}
								<li>
									<NavLink exact to={sitePaths.sécuritéSociale.salarié}>
										<T>Simulateur de coût d'embauche</T>
									</NavLink>
								</li>
							</ul>
						</NavOpener>
					</li>
					<li>
						<NavLink to={sitePaths.démarcheEmbauche.index}>
							<T>Embauche</T>
							<img
								style={{ height: '2.5rem', marginBottom: '-0.8rem' }}
								src={hiringSvg}
							/>
						</NavLink>
					</li>
				</ul>
			</nav>
		</div>
	</SideBar>
)

export default (compose(
	withRouter,
	withNamespaces(),
	withSitePaths,
	connect(
		state => ({
			companyStatusChoice: state.inFranceApp.companyStatusChoice
		}),
		{}
	)
)(StepsHeader): React$ComponentType<OwnProps>)
