import ComparativeSimulation from 'Components/ComparativeSimulation'
import React from 'react'
import { Helmet } from 'react-helmet'

const SchemeComparaisonPage = () => (
	<>
		<Helmet>
			<title>
				Assimilé salarié, indépendant, micro-entreprise : comparaison des
				différents régimes
			</title>
		</Helmet>
		<h1>Comparaison des différents régimes de cotisation</h1>
		<ComparativeSimulation />
	</>
)

export default SchemeComparaisonPage
