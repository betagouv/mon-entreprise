/* @flow */
import React from 'react'
import Checklist from 'InFrance/Checklist'

export default Checklist({
	name: 'hire',
	title: `Checklist to hire an employee`,
	subtitle: `
			This checklist will guide you through the legal steps to
			hire an employee.
	`,
	items: {
		contract: (
			<p>
				Sign an employment contract with your employee.{' '}
				<a
					href="https://www.service-public.fr/particuliers/vosdroits/N19871"
					target="_blank">
					More information (french)
				</a>
			</p>
		),
		dpae: (
			<p>
				Declare the hiring process <strong>8 days before</strong>. It's called
				the <em>DPAE</em>, and can be{' '}
				<a href="https://www.due.urssaf.fr/declarant/index.jsf" target="_blank">
					done online{' '}
				</a>{' '}
				(french).
			</p>
		),
		pay: (
			<>
				<p>
					Calculate and declare the social security contributions. You must
					legally produce :
				</p>
				<ul>
					<li>
						A payslip that conforms to the new simplified standard. HERE IS AN
						EXAMPLE
					</li>
					<li>
						Monthly declarations through the centralized declaration system
						called <em>DSN</em>
					</li>
				</ul>
			</>
		),
		registre: (
			<p>
				The employer must keep a staff register.{' '}
				<a
					href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F1784"
					target="_blank">
					More info{' '}
				</a>(french)
			</p>
		),
		complementaryInsurance: (
			<>
				<p>
					Some complementary insurances are <em>mandatory</em> and each employee
					must be enrolled by the employer.
				</p>
				<ul>
					<li>
						Complementary pension : ARRCO for everyone and AGIRC for "cadre"
						employees. Those are only federations,
						<a
							href="https://www.espace-entreprise.agirc-arrco.fr/simape/#/donneesDep<Paste>"
							target="_blank">
							find your mandatory private pension institution
						</a>and contact them.
					</li>
					You must pay at least half of a private complementary health
					insurance. The choice is yours, but it must cover a legal basic care
					basket.
					<li />
				</ul>
			</>
		),
		workMedicine: (
			<p>
				The employer must register a work medicine office, and plan an initial
				appointment for each new hire.
			</p>
		)
	},

	conclusion: ''
})
