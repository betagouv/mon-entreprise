import { React } from 'Components'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
// $FlowFixMe
import 'react-select/dist/react-select.css'
import { fetchCompanyDetails } from '../api/sirene'

export default function CompanyDetails({ siren, denomination }) {
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
	const [company, setCompany] = useState()
	useEffect(() => {
		fetchCompanyDetails(siren).then(setCompany)
	}, [siren, company])

	return (
		<>
			<h3>
				{denomination || company ? (
					<>
						{denomination ||
							company.denomination ||
							company.prenom_usuel + ' ' + company.nom}{' '}
						<small>({siren})</small>
					</>
				) : (
					<Skeleton width={400} />
				)}
			</h3>
			<small>
				Crée le{' '}
				<strong>
					{company ? (
						DateFormatter.format(new Date(company.date_creation))
					) : (
						<Skeleton width={80} />
					)}
				</strong>
				, domiciliée à{' '}
				{company ? (
					<>
						<strong>{company.etablissement_siege.libelle_commune}</strong> (
						{company.etablissement_siege.code_postal})
					</>
				) : (
					<Skeleton width={100} />
				)}
			</small>
		</>
	)
}
