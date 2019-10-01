/* @flow */
import { React, T } from 'Components'
import withSitePaths from 'Components/utils/withSitePaths'
import companySvg from 'Images/company.svg'
import estimateSvg from 'Images/estimate.svg'
import hiringSvg from 'Images/hiring.svg'
import { compose } from 'ramda'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import './Navigation.css'
import NavOpener from './NavOpener'
import SideBar from './SideBar'

type OwnProps = {}
type Props = OwnProps & {
	companyProgress: number,
	estimationProgress: number,
	sitePaths: Object,
	hiringProgress: number,
	companyStatusChoice: string
}
const Navigation = ({ sitePaths, companyStatusChoice }: Props) => {
	const { t } = useTranslation()
	return (
		<SideBar>
			<div className="navigation__container">
				<nav className="navigation">
					<ul>
						<li>
							<NavLink to="/" exact className="navigationItem">
								<T>Accueil</T>
							</NavLink>
						</li>
						<li>
							<NavOpener
								to={sitePaths.entreprise.index}
								exact={false}
								title={
									<>
										<T>Mon entreprise</T>
										<img
											style={{ height: '2.5rem', marginBottom: '-0.8rem' }}
											src={companySvg}
										/>
									</>
								}>
								<ul>
									<li>
										<NavOpener title={t('Créer mon entreprise')}>
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
																		sitePaths.entreprise.statutJuridique
																			.soleProprietorship
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
																	to={
																		sitePaths.entreprise.statutJuridique.liste
																	}>
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
																? sitePaths.entreprise.créer(
																		companyStatusChoice
																  )
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
																<NavLink
																	to={sitePaths.entreprise.créer('EIRL')}>
																	EIRL
																</NavLink>
															</li>
															<li>
																<NavLink
																	to={sitePaths.entreprise.créer('EURL')}>
																	EURL
																</NavLink>
															</li>
															<li>
																<NavLink to={sitePaths.entreprise.créer('SA')}>
																	SA
																</NavLink>
															</li>
															<li>
																<NavLink
																	to={sitePaths.entreprise.créer('SARL')}>
																	SARL
																</NavLink>
															</li>
															<li>
																<NavLink to={sitePaths.entreprise.créer('SAS')}>
																	SAS
																</NavLink>
															</li>
															<li>
																<NavLink
																	to={sitePaths.entreprise.créer('SASU')}>
																	SASU
																</NavLink>
															</li>
														</ul>
													</NavOpener>
												</li>
												<li>
													<NavLink to={sitePaths.entreprise.après}>
														<T k="entreprise.tâches.ensuite">
															Après la création
														</T>
													</NavLink>
												</li>
											</ul>
										</NavOpener>
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
									<li>
										<NavOpener
											to={sitePaths.sécuritéSociale.selection}
											title={<T>Rémunération du dirigeant</T>}>
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
														<T>Comparer les régimes</T>
													</NavLink>
												</li>
											</ul>
										</NavOpener>
									</li>
									<li>
										<NavLink exact to={sitePaths.sécuritéSociale.salarié}>
											<T>Simulateur de salaire</T>
										</NavLink>
									</li>
									<li>
										<NavLink exact to={sitePaths.documentation.exemples}>
											<T>Exemples de simulation de salaire</T>
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
						<li>
							<NavLink to={sitePaths.documentation.index}>
								<T>Documentation</T>
							</NavLink>
						</li>
					</ul>
				</nav>
			</div>
		</SideBar>
	)
}

export default (compose(
	withSitePaths,
	connect(
		state => ({
			companyStatusChoice: state.inFranceApp.companyStatusChoice
		}),
		{}
	)
)(Navigation): React$ComponentType<OwnProps>)
