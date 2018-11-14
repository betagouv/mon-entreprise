/* @flow */
import { React, T } from 'Components'
import { compose } from 'ramda'
import emoji from 'react-easy-emoji'
import { withI18n } from 'react-i18next'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import selectors from 'Selectors/progressSelectors'
import companySvg from '../../images/company.svg'
import estimateSvg from '../../images/estimate.svg'
import hiringSvg from '../../images/hiring.svg'
import sitePaths from '../../sitePaths'
import './Navigation.css'
import NavOpener from './NavOpener'
import SideBar from './SideBar'
import type { TFunction } from 'react-i18next'

const Progress = ({ percent }) => (
	<div className="progress">
		<div
			className="bar"
			style={{
				width: `${percent}%`
			}}
		/>
	</div>
)
type Props = {
	companyProgress: number,
	estimationProgress: number,
	hiringProgress: number,
	companyStatusChoice: string,
	t: TFunction
}
const StepsHeader = ({
	companyProgress,
	t,
	estimationProgress,
	hiringProgress,
	companyStatusChoice
}: Props) => (
	<SideBar>
		<div className="navigation__container">
			<nav className="navigation">
				<ul>
					<li>
						<NavOpener
							to={sitePaths().entreprise.index}
							exact={false}
							title={
								<>
									<T>Votre entreprise</T>
									<img
										style={{ height: '2.5rem', marginBottom: '-0.8rem' }}
										src={companySvg}
									/>
									<Progress percent={companyProgress} />
								</>
							}>
							<ul>
								<li>
									<NavOpener title={t('Créer votre entreprise')}>
										<ul>
											<li>
												<NavOpener
													to={sitePaths().entreprise.statusJuridique}
													title={t('Guide du statut juridique')}>
													<ul>
														<li>
															<NavLink
																to={
																	sitePaths().entreprise.statusJuridique
																		.multipleAssociates
																}>
																<T>Nombre d'associés</T>
															</NavLink>
														</li>
														<li>
															<NavLink
																to={
																	sitePaths().entreprise.statusJuridique
																		.directorStatus
																}>
																<T>Status du dirigeant</T>
															</NavLink>
														</li>
														<li>
															<NavLink
																to={
																	sitePaths().entreprise.statusJuridique
																		.liability
																}>
																<T>Responsabilité</T>
															</NavLink>
														</li>
														<li>
															<NavLink
																to={
																	sitePaths().entreprise.statusJuridique
																		.minorityDirector
																}>
																<T>Gérant majoritaire ou minoritaire</T>
															</NavLink>
														</li>
														<li>
															<NavLink
																to={
																	sitePaths().entreprise.statusJuridique
																		.microEnterprise
																}>
																<T>Micro-entreprise ou EI</T>
															</NavLink>
														</li>
														<li>
															<NavLink
																to={
																	sitePaths().entreprise.statusJuridique.liste
																}>
																<T>Liste des status</T>
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
															? sitePaths().entreprise.créer(
																	companyStatusChoice
															  )
															: null
													}
													title={t('Démarches de création')}>
													<ul>
														<li>
															<NavLink
																to={sitePaths().entreprise.créer(
																	'micro-enterprise'
																)}>
																<T>Micro-entreprise</T>
															</NavLink>
														</li>
														<li>
															<NavLink to={sitePaths().entreprise.créer('EI')}>
																EI
															</NavLink>
														</li>
														<li>
															<NavLink
																to={sitePaths().entreprise.créer('EIRL')}>
																EIRL
															</NavLink>
														</li>
														<li>
															<NavLink
																to={sitePaths().entreprise.créer('EURL')}>
																EURL
															</NavLink>
														</li>
														<li>
															<NavLink to={sitePaths().entreprise.créer('SA')}>
																SA
															</NavLink>
														</li>
														<li>
															<NavLink
																to={sitePaths().entreprise.créer('SARL')}>
																SARL
															</NavLink>
														</li>
														<li>
															<NavLink to={sitePaths().entreprise.créer('SAS')}>
																SAS
															</NavLink>
														</li>
														<li>
															<NavLink
																to={sitePaths().entreprise.créer('SASU')}>
																SASU
															</NavLink>
														</li>
														<li>
															<NavLink to={sitePaths().entreprise.créer('SNC')}>
																SNC
															</NavLink>
														</li>
													</ul>
												</NavOpener>
											</li>
											<li>
												<NavLink to={sitePaths().entreprise.après}>
													<T k="entreprise.tâches.ensuite">Après la création</T>
												</NavLink>
											</li>
										</ul>
									</NavOpener>
								</li>
								<li>
									<NavLink to={sitePaths().entreprise.trouver}>
										<T k="trouver.titre">Retrouver votre entreprise</T>
									</NavLink>
								</li>
							</ul>
						</NavOpener>
					</li>
					<li>
						<NavLink exact to={sitePaths().sécuritéSociale.index}>
							<T>Protection sociale</T>
							<img
								style={{ height: '2.5rem', marginBottom: '-0.8rem' }}
								src={estimateSvg}
							/>
							{estimationProgress === 100 && emoji('🌞')}
							<Progress percent={estimationProgress} />
						</NavLink>
					</li>
					<li>
						<NavLink to={sitePaths().démarcheEmbauche.index}>
							<T>Embauche</T>
							<img
								style={{ height: '2.5rem', marginBottom: '-0.8rem' }}
								src={hiringSvg}
							/>
							{hiringProgress === 100 && emoji('🌞')}
							<Progress percent={hiringProgress} />
						</NavLink>
					</li>
				</ul>
			</nav>
		</div>
	</SideBar>
)

export default compose(
	withRouter,
	withI18n(),
	connect(
		state => ({
			...selectors(state),
			companyStatusChoice: state.inFranceApp.companyStatusChoice
		}),
		{}
	)
)(StepsHeader)
