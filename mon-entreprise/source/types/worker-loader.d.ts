declare module '*.worker.js' {
	class WebpackWorker extends Worker {
		constructor()
	}

	export default WebpackWorker
}
