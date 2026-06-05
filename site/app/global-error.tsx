'use client'

type GlobalErrorProps = {
	error: Error & { digest?: string }
	reset: () => void
}

const langue = process.env.LANGUE === 'en' ? 'en' : 'fr'

const textes = {
	fr: { titre: 'Une erreur est survenue', réessayer: 'Réessayer' },
	en: { titre: 'An error occurred', réessayer: 'Retry' },
}[langue]

export default function GlobalError({ error, reset }: GlobalErrorProps) {
	return (
		<html lang={langue}>
			<body>
				<h1>{textes.titre}</h1>
				<p>{error.message}</p>
				<button type="button" onClick={reset}>
					{textes.réessayer}
				</button>
			</body>
		</html>
	)
}
