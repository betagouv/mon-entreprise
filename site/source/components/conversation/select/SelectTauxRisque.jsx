import TextField from 'DesignSystem/field/TextField'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Worker from './SelectTauxRisque.worker.js?worker'
const worker = new Worker()

console.log(worker)

function SelectComponent({ onChange, onSubmit, options, autoFocus }) {
	const [searchResults, setSearchResults] = useState()
	let submitOnChange = (option) => {
		onChange(option['Taux net'].replace(',', '.') + '%')
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
					<div
						key={JSON.stringify(option)}
						css={`
							text-align: left;
							width: 100%;
							padding: 0 0.4rem;
							border-radius: 0.3rem;
							display: flex;
							align-items: center;
							cursor: pointer;
							:hover,
							:focus {
								background-color: var(--lighterColor);
							}
							background: white;
							border-radius: 0.6rem;
							margin-top: 0.4rem;
							span {
								display: inline-block;
								margin: 0.6rem;
							}
						`}
						onClick={() => submitOnChange(option)}
					>
						<span
							css={`
								width: 65%;
								font-size: 85%;
							`}
						>
							{option['Nature du risque']}
						</span>

						<span
							css={`
								width: 10%;
								min-width: 3em;
								color: #333;
							`}
						>
							<span>{option['Taux net'] + ' %'}</span>
						</span>
						<span
							css={`
								width: 20%;
								font-size: 85%;
								background-color: #ddd;
								color: #333;
								border-radius: 0.25em;
								padding: 0.5em;
								text-align: center;
							`}
						>
							{option['Catégorie']}
						</span>
					</div>
				))}
		</>
	)
}

export default function Select(props) {
	const [options, setOptions] = useState(null)
	useEffect(() => {
		fetch(
			'https://raw.githubusercontent.com/betagouv/taux-collectifs-cotisation-atmp/master/taux-2021.json'
		)
			.then((response) => {
				if (!response.ok) {
					let error = new Error(response.statusText)
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
