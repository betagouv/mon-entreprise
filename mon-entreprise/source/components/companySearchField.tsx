import { useButton } from '@react-aria/button'
import { useSearchField } from '@react-aria/searchfield'
import { useSearchFieldState } from '@react-stately/searchfield'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { animated, useSpring, useTrail } from 'react-spring'
import useMeasure from 'react-use-measure'
import { Etablissement, searchDenominationOrSiren } from '../api/sirene'
import CompanyDetails from './CompanyDetails'
import InfoBulle from './ui/InfoBulle'
import { useDebounce } from './utils'

const config = { mass: 0.5, tension: 250, friction: 25 }
export function CompanySearchField(props: {
	label?: ReactNode
	onValue?: () => void
	onClear?: () => void
	onSubmit?: (établissement: Etablissement) => void
}) {
	const { t } = useTranslation()
	const searchFieldProps = {
		...props,
		label: t("Nom de l'entreprise, SIREN ou SIRET"),
		description: (
			<Trans>
				Le numéro Siret est un numéro de 14 chiffres unique pour chaque
				entreprise. Ex : 40123778000127
			</Trans>
		),
		onSubmit(value: string) {
			searchDenominationOrSiren(value).then((result) => {
				if (!result || result.length !== 1) {
					return
				}
				onSubmit(result[0])
			})
		},
		placeholder: t('Café de la gare ou 40123778000127'),
	}
	const state = useSearchFieldState(searchFieldProps)
	const inputRef = useRef<HTMLInputElement>(null)
	const clearButtonRef = useRef<HTMLButtonElement>(null)
	const { labelProps, inputProps, descriptionProps, clearButtonProps } =
		useSearchField(searchFieldProps, state, inputRef)

	const { buttonProps } = useButton(
		{ ...clearButtonProps, 'aria-label': 'Effacer la recherche' },
		clearButtonRef
	)

	const { onValue = () => {}, onClear = () => {} } = props
	useEffect(
		() => (!state.value ? onClear() : onValue()),
		[state.value, onValue, onClear]
	)

	const [ref, { width }] = useMeasure()
	const inputStyle = useSpring({
		width,
		config,
	})

	return (
		<div css={'display: flex, flex-direction: column, width: 100%'} ref={ref}>
			<label className="ui__ notice" {...labelProps}>
				{searchFieldProps.label}
			</label>{' '}
			<InfoBulle>
				<span {...descriptionProps}>{searchFieldProps.description}</span>
			</InfoBulle>
			<animated.div
				css={`
					position: relative;
					margin-top: 0.4rem;
				`}
				style={inputStyle}
			>
				<input
					className="ui__ cta"
					css={`
						width: 100%;
						margin: 0 !important;
					`}
					{...inputProps}
					ref={inputRef}
				/>
				{state.value !== '' && (
					<button
						ref={clearButtonRef}
						css={`
							position: absolute;
							padding: 0 1rem;
							right: 0;
							height: 100%;
							font-size: 2rem;
							color: var(--lighterTextColor);
							text-decoration: none;
						`}
						{...buttonProps}
					>
						×
					</button>
				)}
			</animated.div>
			<Results value={state.value} onSubmit={props.onSubmit} />
		</div>
	)
}

function useSearchCompany(value: string): [boolean, Array<Etablissement>] {
	const [result, setResult] = useState<Array<Etablissement>>([])
	const [searchPending, setSearchPending] = useState(!!value)
	useEffect(() => {
		setSearchPending(!!value)
		if (!value) {
			setResult([])
		}
	}, [value, setResult, setSearchPending])

	const debouncedValue = useDebounce(value, 300)
	useEffect(() => {
		if (!debouncedValue) {
			return
		}
		searchDenominationOrSiren(debouncedValue).then((établissements) => {
			setResult(établissements || [])
			setSearchPending(false)
		})
	}, [debouncedValue, setResult, setSearchPending])

	return [searchPending, result.slice(0, 5)]
}

function Results({
	value,
	onSubmit,
}: {
	value: string
	onSubmit: (établissement: Etablissement) => void
}) {
	const [searchPending, results] = useSearchCompany(value)

	const styles = useTrail(results.length, {
		opacity: 1,
		x: 0,
		y: 0,
		from: { opacity: 0, x: 5, y: -15 },
		config,
	})
	if (!value) {
		return null
	}

	return !results.length ? (
		<div
			className="ui__ lighter-bg"
			css={`
				display: flex;
				margin-top: 0.4rem;
				flex-direction: column;
				padding: 0.6rem 1rem 0;
				border-radius: 0.3rem;
			`}
		>
			{searchPending ? (
				<p className="ui__ notice">Recherche en cours...</p>
			) : (
				<>
					<p>Aucune entreprise correspondante trouvée</p>
					<p className="ui__  notice">
						Vous pouvez réessayer avec votre SIREN ou votre SIRET pour un
						meilleur résultat
					</p>
				</>
			)}
		</div>
	) : (
		<>
			{results.map((établissement, i) => (
				<animated.button
					key={établissement.siren}
					style={styles[i]}
					className="ui__ interactive card"
					css={`
						position: relative;
						display: flex;
						text-align: left;
						font-size: inherit;
						font-family: inherit;
						margin-top: 0.4rem;
						width: 100%;
						flex-direction: column;
						:hover > :last-child {
							transform: translateX(0.2rem);
						}
					`}
					onClick={() => onSubmit(établissement)}
				>
					<CompanyDetails {...établissement} />
					<div
						css={`
							position: absolute;
							transition: transform 0.1s;
							right: 0.1rem;
							font-size: 2rem;
							height: 100%;
							color: var(--lighterTextColor);
							display: flex;
							align-items: center;
							will-change: transform;
						`}
					>
						〉
					</div>
				</animated.button>
			))}
		</>
	)
}
