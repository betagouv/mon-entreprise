/* @flow */
import { compose } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import selectors from 'Selectors/progressSelectors'
import Header from '../Header/Header'
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
			<Header />
			<nav className="navigation">
				<ul>
					<li>
						<NavOpener
							to="/company"
							title={
								<>
									Company formation {emoji('🏗️')}{' '}
									{companyProgress === 100 && emoji('🌞')}
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
															<NavLink to="/company/legal-status/multiple-associates">
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
															<NavLink to="/company/legal-status/microenterprise">
																Micro-enterprise
															</NavLink>
														</li>
														<li>
															<NavLink to="/company/legal-status/pick-legal-status">
																Possible status list
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
															<NavLink to="/company/create-microenterprise">
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
							Social security {emoji('💶')}{' '}
							{estimationProgress === 100 && emoji('🌞')}
							<Progress percent={estimationProgress} />
						</NavLink>
					</li>
					<li>
						<NavLink to="/hiring-process">
							Hiring process {emoji('🤝')}{' '}
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
