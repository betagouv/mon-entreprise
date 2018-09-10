/* @flow */
import { ScrollToTop } from 'Components/utils/Scroll'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import siret from './siret.jpg'

type Props = {
	companyStatusChoice: string
}

const AfterRegistration = ({ companyStatusChoice }: Props) => (
	<Animate.fromBottom>
		<ScrollToTop />
		<h1>After registration</h1>
		<p>
			Once your {companyStatusChoice || 'company'} have been successfully
			registered, you'll have access to the following:
		</p>
		<h2>The Siret number</h2>
		<p>
			The Siren number <strong>identifies your company</strong> while the Siret
			number identifies each place of business operated by the same company. The
			Siret is composed by the Siren followed by the Establishment number.
			<br />
			<img
				src={siret}
				alt="Siret and siren number"
				style={{ maxWidth: '100%' }}
			/>
		</p>
		<h2>The APE code</h2>
		<p>
			The APE code for the <strong>business sector</strong> to which your
			company belong. The APE is used to classify your company’s main operations
			in relation to the French business nomenclature system (« NAF » code). It
			also determines the applicable collective agreement as well as the
			industrial accident rate in the field to which you or your company belong.
		</p>
		{companyStatusChoice !== 'microentreprise' && (
			<>
				<h2>The Kbis</h2>
				<p>
					It is the only official document attesting to{' '}
					<strong>the legal existence of a commercial enterprise</strong>. In
					most cases, to be opposable and authentic for administrative
					procedures, the extract must be less than 3 months old.{' '}
				</p>
				<p>
					This document is generally requested when applying for a public
					tender, opening a professional bank account, purchasing professional
					equipment from distributors, etc.
				</p>
			</>
		)}
		<p style={{ display: 'flex', justifyContent: 'space-between' }}>
			<Link to="/company" className="ui__ skip-button left">
				‹ Creation checklist
			</Link>
			<Link to="/social-security" className="ui__ skip-button">
				Go to social security ›
			</Link>
		</p>
	</Animate.fromBottom>
)

export default connect(state => ({
	companyStatusChoice: state.inFranceApp.companyStatusChoice
}))(AfterRegistration)
