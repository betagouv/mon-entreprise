import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

import './test/matchers/toEvaluate'

afterEach(() => {
	cleanup()
})
