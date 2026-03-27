import * as safeLocalStorage from '../../storage/safeLocalStorage'

export const feedbackLocalStorageKey = (url: string) =>
	`app::feedback::v3::${url}`

// Ask for feedback again after 4 months
export const shouldAskFeedback = (url: string) => {
	const previousFeedbackDate = safeLocalStorage.getItem(
		feedbackLocalStorageKey(url)
	)
	if (!previousFeedbackDate) {
		return true
	}

	return (
		new Date(previousFeedbackDate) <
		new Date(new Date().setMonth(new Date().getMonth() - 4))
	)
}

export const setFeedbackGivenForUrl = (url: string) => {
	safeLocalStorage.setItem(
		feedbackLocalStorageKey(url),
		JSON.stringify(new Date().toISOString())
	)
}
