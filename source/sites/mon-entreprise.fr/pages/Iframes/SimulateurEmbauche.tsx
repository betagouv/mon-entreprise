import { SitePathsContext } from 'Components/utils/SitePathsContext'
import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import { SalarySimulation } from '../Simulateurs/Salarié'

export default function IframeSimulateurEmbauche() {
	const sitePaths = useContext(SitePathsContext)
	return (
		<>
			<Helmet>
				<link rel="canonical" href={sitePaths.simulateurs.salarié} />
			</Helmet>
			<SalarySimulation />
		</>
	)
}
