import later from '@breejs/later'
import Bree, { BreeOptions } from 'bree'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { NODE_ENV } from './config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const jobs: BreeOptions['jobs'] = [
	{
		name: 'refresh-token',
		interval: 'at 2:00',
	},
	{
		name: 'daily-stand-up',
		interval: 'every weekday at 16:42',
	},
	{
		name: 'weekly-randomizer',
		interval: 'on Thursday at 17:42',
	},
]

const badJob = jobs.findIndex(
	(job) =>
		typeof job === 'object' &&
		'interval' in job &&
		// eslint-disable-next-line
		later.parse.text(job.interval).error >= 0
)
if (badJob >= 0) {
	throw new Error(`Bad interval in job n°${badJob}`)
}

const bree = new Bree({
	root: join(__dirname, 'jobs'),
	defaultExtension: NODE_ENV === 'production' ? 'js' : 'ts',
	jobs,
})

await bree.start()

export { bree }
