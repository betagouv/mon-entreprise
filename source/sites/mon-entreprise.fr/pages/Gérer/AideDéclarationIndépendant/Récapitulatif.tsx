import CompanyDetails from 'Components/CompanyDetails'
import { formatValue } from 'Engine/format'
import { DottedName } from 'Publicode/rules'
import React, { useRef } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { situationSelector } from 'Selectors/analyseSelectors'
import { Results } from './Result'

export function AideDéclarationIndépendantsRécapitulatif() {
	const situation = useSelector(situationSelector)
	const siren = useSelector(
		(state: RootState) => state.inFranceApp.existingCompany?.siren
	)
	const componentRef = useRef<HTMLDivElement>(null)

	return (
		<div ref={componentRef}>
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

			<SimpleField dottedName={'dirigeant . rémunération totale'} unit="€" />

			{siren && <CompanyDetails siren={siren} />}

			<SimpleField
				dottedName={
					"aide déclaration revenu indépendant 2019 . nature de l'activité"
				}
			/>

			<SimpleField dottedName={'situation personnelle . RSA'} />

			{!situation[
				"situation personnelle . domiciliation fiscale à l'étranger"
			] && (
				<>
					<SimpleField dottedName={'dirigeant . indépendant . IJSS'} />

					<SimpleField
						dottedName={'dirigeant . indépendant . IJSS . total'}
						unit="€"
					/>

					<SimpleField
						dottedName={'dirigeant . indépendant . IJSS . imposable'}
						unit="€"
					/>
				</>
			)}

			<SimpleField
				dottedName={'dirigeant . indépendant . conjoint collaborateur'}
			/>

			<SimpleField
				dottedName={
					'dirigeant . indépendant . conjoint collaborateur . assiette'
				}
			/>

			<SimpleField
				dottedName={
					'dirigeant . indépendant . cotisations et contributions . exonérations . invalidité'
				}
			/>

			<SimpleField
				dottedName={
					"situation personnelle . domiciliation fiscale à l'étranger"
				}
			/>

			<SimpleField dottedName={'dirigeant . indépendant . revenus étrangers'} />

			<Results componentRef={componentRef} />
		</div>
	)
}

type SimpleFieldProps = {
	dottedName: DottedName
	unit?: string
}
function SimpleField({ dottedName, unit }: SimpleFieldProps) {
	const situation = useSelector(situationSelector)
	const rules = useSelector((state: RootState) => state.rules)
	const value = situation[dottedName]
	return value && (value === 'oui' || unit === '€') ? (
		<p>
			<span>{rules[dottedName]?.question}</span>
			<span>
				&nbsp;
				<strong>
					{value !== null && unit === '€' ? (
						formatValue({
							value: value || 0,
							language: 'fr',
							unit: unit,
							maximumFractionDigits: 0
						})
					) : (
						<>{value}</>
					)}
				</strong>
			</span>
		</p>
	) : null
}
