import React, { useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Skeleton from 'Components/ui/Skeleton'
import { Etablissement, fetchCompanyDetails } from '../api/sirene'

type Company = {
	denomination: string
	prenom_usuel: string
	nom: string
	date_creation: string
	etablissement_siege: {
		libelle_commune: string
		code_postal: string
	}
}

export default function CompanyDetails({ siren, denomination }: Etablissement) {
	const { i18n } = useTranslation()
	const DateFormatter = useMemo(
		() =>
			new Intl.DateTimeFormat(i18n.language, {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			}),
		[i18n.language]
	)
	const [company, setCompany] = useState<Company>()
	useEffect(() => {
		fetchCompanyDetails(siren).then(setCompany)
	}, [siren])

	return (
		<>
			<h3>
				{denomination || company ? (
					<>
						{denomination ||
							(company &&
								(company.denomination ||
									company.prenom_usuel + ' ' + company.nom))}{' '}
						<small>({siren})</small>
					</>
				) : (
					<Skeleton width={400} />
				)}
			</h3>

			<p className="ui__ notice">
				<Trans>Crée le</Trans>{' '}
				<strong>
					{company ? (
						DateFormatter.format(new Date(company.date_creation))
					) : (
						<Skeleton width={80} />
					)}
				</strong>
				,&nbsp;
				{company ? (
					company.etablissement_siege ? (
						<>
							<Trans>domiciliée à</Trans>{' '}
							<strong>{company.etablissement_siege.libelle_commune}</strong> (
							{company.etablissement_siege.code_postal})
						</>
					) : (
						<Trans>domiciliation inconnue</Trans>
					)
				) : (
					<Skeleton width={100} />
				)}
			</p>
		</>
	)
}
