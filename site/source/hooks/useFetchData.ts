import { useEffect, useState } from 'react'

export const useFetchData = <T>(url: string) => {
	const [data, setData] = useState<null | T>(null)
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		const controller = new AbortController()

		const fetchData = async () => {
			setLoading(true)
			try {
				const response = await fetch(url, {
					signal: controller.signal,
				})

				if (response.ok) {
					const resData = (await response.json()) as T
					setData(resData)
				}
				setLoading(false)
			} catch (err) {
				if (err instanceof Error && err.name !== 'AbortError') {
					throw err
				}
			}
		}

		void fetchData()

		return () => {
			controller.abort()
		}
	}, [url])

	return { data, loading }
}
