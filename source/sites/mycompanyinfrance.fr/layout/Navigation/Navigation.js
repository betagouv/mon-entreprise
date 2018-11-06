/* @flow */
import { compose } from 'ramda'
import { React, T } from 'Components'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import selectors from 'Selectors/progressSelectors'
import companySvg from '../../images/company.svg'
import estimateSvg from '../../images/estimate.svg'
import hiringSvg from '../../images/hiring.svg'
import './Navigation.css'
import NavOpener from './NavOpener'
import SideBar from './SideBar'

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
	companyStatusChoice: string
}
const StepsHeader = ({
	companyProgress,
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
							to="/company"
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
									<NavOpener title="Register a new company">
										<ul>
											<li>
												<NavOpener
													to="/company/legal-status"
													title="Legal status guide">
													<ul>
														<li>
															<NavLink to="/company/legal-status/number-of-associates">
																Number of associates
															</NavLink>
														</li>
														<li>
															<NavLink to="/company/legal-status/director-status">
																Director status
															</NavLink>
														</li>
														<li>
															<NavLink to="/company/legal-status/liability">
																Liability
															</NavLink>
														</li>
														<li>
															<NavLink to="/company/legal-status/minority-director">
																Minority director
															</NavLink>
														</li>
														<li>
															<NavLink to="/company/legal-status/micro-enterprise">
																Micro-enterprise
															</NavLink>
														</li>
														<li>
															<NavLink to="/company/legal-status/list">
																Status list
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
															? `/company/create-${companyStatusChoice}`
															: null
													}
													title="Creation process checklist">
													<ul>
														<li>
															<NavLink to="/company/create-micro-enterprise">
																Micro-enterprise
															</NavLink>
														</li>
														<li>
															<NavLink to="/company/create-EI">EI</NavLink>
														</li>
														<li>
															<NavLink to="/company/create-EIRL">EIRL</NavLink>
														</li>
														<li>
															<NavLink to="/company/create-EURL">EURL</NavLink>
														</li>
														<li>
															<NavLink to="/company/create-SA">SA</NavLink>
														</li>
														<li>
															<NavLink to="/company/create-SARL">SARL</NavLink>
														</li>
														<li>
															<NavLink to="/company/create-SAS">SAS</NavLink>
														</li>
														<li>
															<NavLink to="/company/create-SASU">SASU</NavLink>
														</li>
														<li>
															<NavLink to="/company/create-SNC">SNC</NavLink>
														</li>
													</ul>
												</NavOpener>
											</li>
											<li>
												<NavLink to="/company/after-registration">
													After registration
												</NavLink>
											</li>
										</ul>
									</NavOpener>
								</li>
								<li>
									<NavLink to="/company/find">Find an existing company</NavLink>
								</li>
							</ul>
						</NavOpener>
					</li>
					<li>
						<NavLink exact to="/social-security">
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
						<NavLink to="/hiring-process">
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
	connect(
		state => ({
			...selectors(state),
			companyStatusChoice: state.inFranceApp.companyStatusChoice
		}),
		{}
	)
)(StepsHeader)
