import React from 'react'
import { Link } from 'react-router-dom'
import siret from './siret.jpg'

const DuringRegistration = () => (
	<>
		<h1>Registration pending</h1>
		<p>
			<a>If you have trouble completing your application, we can help.</a>
		</p>

		<h2>Administrative papers</h2>
		<p>Once your business has been officially registered, you will receive:</p>
		<ul>
			<li>
				<strong>Your Siret number</strong>
				, which identifies your company
			</li>
			<li>
				<strong>Your APE code</strong>
				, which defines your business sector
			</li>
			<li>
				<strong>Your K-bis extract</strong>
				, which certifies that your company is properly registrated
			</li>
		</ul>
		<h3>Siren and Siret</h3>
		<p>
			The Siren number identifies your company while the Siret number identifies
			each place of business operated by the same company.
		</p>
		<img src={siret} alt="Siret and siren number" />
		<h3>APE Code</h3>
		<p>
			The APE code is used to classify your company’s main operations in the
			french business nomenclature (« NAF »). It is also used to determine the
			your applicable collective agreement as well as your occupational accident
			rate.
		</p>
		<h2>Next steps to do</h2>
		<p>
			While your application is being processed, you can focus on the following
			tasks:{' '}
		</p>
		<ul className="ui__ no-bullet">
			<li>
				<label>
					<input type="checkbox" />Open a business bank account and follow the
					capital deposit procedure if needed
				</label>
			</li>
			<li>
				<label>
					<input type="checkbox" />Choose a certified accountant
				</label>
			</li>
			<li>
				<label>
					<input type="checkbox" />Check out needs of professional insurance
				</label>
			</li>
		</ul>
		<p>
			Finally, you can learn more about the social security system and simulate
			the hiring of your first employee.
			<Link to="/social-security">Simulate hiring costs</Link>
		</p>
	</>
)

export default DuringRegistration
