import { Card } from '@/design-system/card'
import { Select } from '@/design-system/field/Select'
import TextField from '@/design-system/field/TextField'
import { Li, Ul } from '@/design-system/typography/list'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Worker from './SelectTauxRisque.worker.js?worker'

const worker = !import.meta.env.SSR && new Worker()

const formatTauxNet = (taux) => {
	const tauxNet = parseFloat(taux.replace(',', '.'))
	if (isNaN(tauxNet)) {
		return 'Taux inconnu'
	}

	return tauxNet + ' %'
}

function SelectComponent({ onChange, onSubmit, options, autoFocus }) {
	const [searchResults, setSearchResults] = useState()
	const submitOnChange = (option) => {
		const tauxNet = parseFloat(option['Taux net'].replace(',', '.'))
		if (isNaN(tauxNet)) {
			// eslint-disable-next-line no-console
			console.error('Taux inconnu', option)
		}
		onChange(isNaN(tauxNet) ? undefined : tauxNet + '%')
		onSubmit()
	}
	const { t } = useTranslation()
	useEffect(() => {
		worker.postMessage({
			options,
		})

		worker.onmessage = ({ data: results }) => setSearchResults(results)
	}, [options])

	return (
		<>
			<TextField
				type="search"
				placeholder={t("Saisissez votre domaine d'activité")}
				autoFocus={autoFocus}
				errorMessage={
					searchResults &&
					searchResults.length === 0 && <Trans>Aucun résultat</Trans>
				}
				onChange={(input) => {
					if (input.length < 2) {
						setSearchResults(undefined)

						return
					}
					worker.postMessage({ input })
				}}
			/>

			{searchResults &&
				searchResults.map((option) => (
					<Card
						bodyAs={Wrapper}
						onPress={() => submitOnChange(option)}
						compact
						key={JSON.stringify(option)}
						css={`
							padding: 0.4rem;
							margin-top: 0.5rem;
						`}
					>
						<span
							css={`
								flex: 6;
							`}
						>
							{option['Nature du risque']}
						</span>

						<span
							css={`
								flex: 2;
								color: #333;
								font-size: 1rem;
							`}
						>
							{formatTauxNet(option['Taux net'])}
						</span>
						<span
							css={`
								flex: 4;
								background-color: #ddd;
								color: #333;
								border-radius: 0.25em;
								padding: 0.5em;
								text-align: center;
							`}
						>
							{option['Catégorie']}
						</span>
					</Card>
				))}
		</>
	)
}

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	text-align: left;
	font-size: 0.85rem;
`

export default function SelectAtmp(props) {
	const [options, setOptions] = useState(null)
	useEffect(() => {
		fetch(
			'https://raw.githubusercontent.com/betagouv/taux-collectifs-cotisation-atmp/master/taux-2021.json'
		)
			.then((response) => {
				if (!response.ok) {
					const error = new Error(response.statusText)
					error.response = response
					throw error
				}

				return response.json()
			})
			.then((json) => setOptions(json))
			.catch(
				(error) =>
					console.warn('Erreur dans la récupération des codes risques', error) // eslint-disable-line no-console
			)
	}, [])

	if (!options) return null

	return <SelectComponent {...props} options={options} />
}
