export default {
	removeItem: function(...args) {
		try {
			return window.localStorage.removeItem(...args)
		} catch (error) {
			if (error.name === 'SecurityError') {
				console.warn(
					'[localStorage] Unable to remove item due to security settings'
				)
			}
			return null
		}
	},
	getItem: function(...args) {
		try {
			return window.localStorage.getItem(...args)
		} catch (error) {
			if (error.name === 'SecurityError') {
				console.warn(
					'[localStorage] Unable to get item due to security settings'
				)
			}
			return null
		}
	},
	setItem: function(...args) {
		try {
			return window.localStorage.setItem(...args)
		} catch (error) {
			if (error.name === 'SecurityError') {
				console.warn(
					'[localStorage] Unable to set item due to security settings'
				)
			}
			return null
		}
	}
}
