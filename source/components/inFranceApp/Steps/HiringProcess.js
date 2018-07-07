/* @flow */
import React from 'react'
import Checklist from 'InFrance/Checklist'
import { Link } from 'react-router-dom'

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
				Declare the hiring process <strong>8 days before</strong>. It's called{' '}
				<em>la DPAE</em>, and can be{' '}
				<a href="https://www.due.urssaf.fr/declarant/index.jsf" target="_blank">
					done online{' '}
				</a>{' '}
				(french)
			</p>
		),
		paySoftware: (
			<p>
				With less than 20 employees, payslips and declarations can be done
				online by the{' '}
				<a href="www.letese.urssaf.fr" target="_blank">
					TESE (french)
				</a>. In any case, you can use{' '}
				<a href="http://www.dsn-info.fr/convention-charte.htm" target="_blank">
					private software (french)
				</a>
			</p>
		),
		payslip: (
			<p>
				Give a standardised payslip to your employee
				<Link className="ui__ button" to="/social-security">
					Get an example payslip
				</Link>
			</p>
		),
		dsn: (
			<p>
				Send these data through the centralized declaration system called{' '}
				<em>la DSN</em>
			</p>
		),
		registre: (
			<p>
				The employer must keep a staff register.{' '}
				<a
					href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F1784"
					target="_blank">
					More info
				</a>{' '}
				(french)
			</p>
		),
		complementaryPension: (
			<p>
				The AGIRC-ARRCO complementary pension is mandatory. Those are only
				federations,{' '}
				<a
					href="https://www.espace-entreprise.agirc-arrco.fr/simape/#/donneesDep<Paste>"
					target="_blank">
					find your assigned pension institution
				</a>{' '}
				and contact them
			</p>
		),
		complementaryHealth: (
			<p>
				You must pay at least half of a private complementary health insurance.
				The choice is yours, but it must cover a legal basic care basket
			</p>
		),
		workMedicine: (
			<p>
				You must register to a work medicine office, and plan an initial
				appointment for each new hire
			</p>
		)
	},

	conclusion: ''
})
