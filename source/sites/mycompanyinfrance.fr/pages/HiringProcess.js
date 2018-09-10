/* @flow */
import {
	checkHiringItem,
	initializeHiringChecklist
} from 'Actions/hiringChecklistAction'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import { CheckItem, Checklist } from 'Ui/Checklist'

const HiringProcess = ({
	onChecklistInitialization,
	onItemCheck,
	hiringChecklist
}) => (
	<Animate.fromBottom>
		<h1>Hiring process checklist</h1>
		<p>The necessary steps to hire your first employee.</p>
		<Checklist
			onInitialization={onChecklistInitialization}
			onItemCheck={onItemCheck}
			defaultChecked={hiringChecklist}>
			<CheckItem
				name="contract"
				title="Sign an employment contract with your employee"
				explanations={
					<p>
						<a
							className="ui__ button"
							href="https://www.service-public.fr/particuliers/vosdroits/N19871"
							target="_blank">
							{' '}
							More information (Fr)
						</a>
					</p>
				}
			/>
			<CheckItem
				name="dpae"
				title="Declare your hiring to the social administration"
				explanations={
					<p>
						This can be done through the form called DPAE, must be completed
						within 8 days before any hiring, and can{' '}
						<a
							href="https://www.due.urssaf.fr/declarant/index.jsf"
							target="_blank">
							be done online (Fr)
						</a>
					</p>
				}
			/>
			<CheckItem
				name="paySoftware"
				title="Choose a payslip software"
				explanations={
					<p>
						With fewer than 20 employees, payslips and declarations can be
						handled online by the{' '}
						<a href="http://www.letese.urssaf.fr" target="_blank">
							Tese (Fr)
						</a>
						. In any case, you can use{' '}
						<a
							href="http://www.dsn-info.fr/convention-charte.htm"
							target="_blank">
							private payslip software (Fr)
						</a>
					</p>
				}
			/>
			<CheckItem
				name="registre"
				title="Keep an updated staff register"
				explanations={
					<p>
						<a
							href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F1784"
							className="ui__ button"
							target="_blank">
							More information (Fr)
						</a>
					</p>
				}
			/>
			<CheckItem
				name="complementaryPension"
				title="Contact your assigned compulsory complementary pension institution"
				explanations={
					<p>
						<a
							href="https://www.espace-entreprise.agirc-arrco.fr/simape/#/donneesDep"
							className="ui__ button"
							target="_blank">
							Find your pension institute (Fr)
						</a>
						{/* // The AGIRC-ARRCO complementary pension is mandatory. Those are only federations,{' '} */}
					</p>
				}
			/>
			<CheckItem
				name="complementaryHealth"
				title="Pick a private complementary health insurance"
				explanations={
					<p>
						You must cover your employees with the private complementary health
						insurance ("complémentaire santé" or colloquially "mutuelle" in
						French) of your choice as long as it provides a set of minimum
						guarantees. The employer must pay at least half of the package.
					</p>
				}
			/>
			<CheckItem
				name="workMedicine"
				title="Register to a work medicine office"
				explanations={<p> Plan an initial appointment for each new hire.</p>}
			/>
		</Checklist>
		<h2>Then each month</h2>
		<ul>
			<li>
				Compute the individual social contributions (using the chosen payslip
				software)
			</li>
			<li>
				Declare the contributions through the DSN, the new online declaration
				system
			</li>
			<li>Deliver the standardised payslip to your employee</li>
		</ul>
		<Link className="ui__ button" to="/social-security">
			Get an example payslip
		</Link>
	</Animate.fromBottom>
)

export default connect(
	state => ({ hiringChecklist: state.inFranceApp.hiringChecklist }),
	{
		onChecklistInitialization: initializeHiringChecklist,
		onItemCheck: checkHiringItem
	}
)(HiringProcess)
