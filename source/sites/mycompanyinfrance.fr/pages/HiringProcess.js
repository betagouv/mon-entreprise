/* @flow */
import React from 'react'
import { Link } from 'react-router-dom'
import { CheckItem, Checklist } from 'Ui/Checklist'

const HiringProcess = () => (
	<>
		<h1>Hiring process checklist</h1>
		<p>All the necessary steps to hire your first employee </p>
		<Checklist>
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
							More information (french)
						</a>
					</p>
				}
			/>
			<CheckItem
				name="dpae"
				title="Declare your hiring to the social administration"
				explanations={
					<p>
						This can be done though the form called DPAE, must be completed
						within 8 days before any hiring, and can{' '}
						<a
							href="https://www.due.urssaf.fr/declarant/index.jsf"
							target="_blank">
							be done online
						</a>
					</p>
				}
			/>
			<CheckItem
				name="paySoftware"
				title="Choose a payslip software"
				explanations={
					<p>
						With less than 20 employees, payslips and declarations can be
						handled online by the{' '}
						<a href="http://www.letese.urssaf.fr" target="_blank">
							Tese (french)
						</a>. In any case, you can use{' '}
						<a
							href="http://www.dsn-info.fr/convention-charte.htm"
							target="_blank">
							private payslip software (french)
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
							More info
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
							Find your pension institute
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
						TODO
						{/* Covering a legal basic care basket */}
						{/* Expliquer les deux contrats de complémentaire santé (soins et prévoyance) */}
					</p>
				}
			/>
			<CheckItem
				name="workMedicine"
				title="Register to a work medicine office"
				explanations={<p> Plan an initial appointment for each new hire</p>}
			/>
		</Checklist>
		<h2>Then each month</h2>
		<p>
			Your have to compute the individual social contributions (use a pay
			software as described above), then declare them through the DSN, and
			deliver a standardised payslip to your employee.
		</p>
		<Link className="ui__ button" to="/social-security">
			Get an example payslip
		</Link>
	</>
)

export default HiringProcess
