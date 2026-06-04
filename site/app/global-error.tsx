'use client'

type GlobalErrorProps = {
	error: Error & { digest?: string }
	reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
	return (
		<html lang="fr">
			<body>
				<h1>Une erreur est survenue</h1>
				<p>{error.message}</p>
				<button type="button" onClick={reset}>
					Réessayer
				</button>
			</body>
		</html>
	)
}
