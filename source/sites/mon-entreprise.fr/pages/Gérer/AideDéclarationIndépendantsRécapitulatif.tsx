import CompanyDetails from 'Components/CompanyDetails'
import { formatValue } from 'Engine/format'
import React from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { situationSelector } from 'Selectors/analyseSelectors'
import { Results } from './AideDéclarationIndépentantsResult'

export function AideDéclarationIndépendantsRécapitulatif() {
	const situation = useSelector(situationSelector)
	const siren = useSelector(
		(state: RootState) => state.inFranceApp.existingCompany?.siren
	)

	return (
		<>
			<h1>
				<Trans>Aide à la déclaration de revenus au titre de l'année 2019</Trans>
			</h1>

			<p>
				Ce document atteste de votre bonne foi concernant votre déclaration
				selon les éléments transmis.
			</p>

			<h2>
				<Trans>Récapitulatif</Trans>
			</h2>

			<SimpleField
				label="Rémunération totale"
				dottedName={'dirigeant . rémunération totale'}
				unit="€"
			/>

			{siren && <CompanyDetails siren={siren} />}

			<SimpleField
				label="Nature de votre activité"
				dottedName={
					"aide déclaration revenu indépendant 2019 . nature de l'activité"
				}
				unit="text"
			/>

			<SimpleField
				label="Vous êtes bénéficiaire du RSA ou de la prime d’activité"
				dottedName={'situation personnelle . RSA'}
			/>

			{!situation[
				"situation personnelle . domiciliation fiscale à l'étranger"
			] && (
				<>
					<SimpleField
						label="Vous avez perçu des indemnités journalières de maladie, maternité ou paternité au titre de votre activité indépendante"
						dottedName={'dirigeant . indépendant . IJSS'}
					/>

					<SimpleField
						label="Le montant total brut de toutes vos indemnités journalières est de"
						dottedName={'dirigeant . indépendant . IJSS . total'}
						unit="€"
					/>

					<SimpleField
						label="Le montant brut des indemnités journalières imposables perçues est de"
						dottedName={'dirigeant . indépendant . IJSS . imposable'}
						unit="€"
					/>
				</>
			)}

			<SimpleField
				label="Vous avez un conjoint collaborateur"
				dottedName={'dirigeant . indépendant . conjoint collaborateur'}
			/>

			<SimpleField
				label="Il cotise sur la base"
				dottedName={
					'dirigeant . indépendant . conjoint collaborateur . assiette'
				}
				unit="text"
			/>

			<SimpleField
				label="Vous êtes titulaire d’une pension d’invalidité à titre de travailleur indépendant"
				dottedName={
					'dirigeant . indépendant . cotisations et contributions . exonérations . invalidité'
				}
			/>

			<SimpleField
				label="La résidence fiscale est située à l'étranger"
				dottedName={
					"situation personnelle . domiciliation fiscale à l'étranger"
				}
			/>

			<SimpleField
				label="Vous avez perçu des revenus à l'étranger dans le cadre de votre activité"
				dottedName={'dirigeant . indépendant . revenus étrangers'}
			/>

			<Results récapitulatif={false} />
		</>
	)
}

type SimpleFieldProps = {
	label?: string
	dottedName: string
	unit?: string
}
function SimpleField({ label, dottedName, unit }: SimpleFieldProps) {
	const situation = useSelector(situationSelector)
	const value = situation[dottedName]
	return value ? (
		<p>
			<span>
				<Trans>{label}</Trans>
			</span>{' '}
			<span>
				{value !== null &&
					unit === '€' &&
					' : ' +
						formatValue({
							value: value || 0,
							language: 'fr',
							unit: '€',
							maximumFractionDigits: 0
						})}

				{value !== null && unit === 'text' && ' : ' + value}
			</span>
		</p>
	) : (
		<></>
	)
}
