import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Worker from 'worker-loader!./SelectTauxRisque.worker.js'
const worker = new Worker()

function SelectComponent({ onChange, onSubmit, options }) {
	const [searchResults, setSearchResults] = useState()
	let submitOnChange = option => {
		option.text = +option['Taux net'].replace(',', '.')
		onChange(option.text)
		onSubmit()
	}
	const { t } = useTranslation()
	useEffect(() => {
		worker.postMessage({
			options
		})

		worker.onmessage = ({ data: results }) => setSearchResults(results)
	}, [])
	return (
		<>
			<input
				type="search"
				css={`
					padding: 0.4rem;
					margin: 0.2rem 0;
					width: 100%;
					border: 1px solid var(--lighterTextColor);
					border-radius: 0.3rem;
					color: inherit;
					font-size: inherit;
					transition: border-color 0.1s;
					position: relative;

					:focus {
						border-color: var(--color);
					}
				`}
				placeholder={t("Saisissez votre domaine d'activité")}
				onChange={e => {
					let input = e.target.value
					if (input.length < 2) {
						setSearchResults(undefined)
						return
					}
					worker.postMessage({ input })
				}}
			/>
			{searchResults && searchResults.length === 0 && (
				<p>
					<Trans>Aucun résultat</Trans>
				</p>
			)}

			{searchResults &&
				searchResults.map(option => (
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
			'https://raw.githubusercontent.com/betagouv/taux-collectifs-cotisation-atmp/master/taux-2020.json'
		)
			.then(response => {
				if (!response.ok) {
					let error = new Error(response.statusText)
					error.response = response
					throw error
				}
				return response.json()
			})
			.then(json => setOptions(json))
			.catch(
				error =>
					console.log('Erreur dans la récupération des codes risques', error) // eslint-disable-line no-console
			)
	}, [])

	if (!options) return null
	return <SelectComponent {...props} options={options} />
}
