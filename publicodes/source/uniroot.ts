// We use a JavaScript implementation of the Brent method to find the root (the
// "zero") of a monotone function. There are other methods like the
// Newton-Raphson method, but they take the derivative of the function as an
// input, wich in our case is costly to calculate. The Brent method doesn't
// need to calculate the derivative.
// An interesting description of the algorithm can be found here:
// https://blogs.mathworks.com/cleve/2015/10/26/zeroin-part-2-brents-version/

/**
 * Copied from https://gist.github.com/borgar/3317728
 *
 * Searches the interval from <tt>lowerLimit</tt> to <tt>upperLimit</tt>
 * for a root (i.e., zero) of the function <tt>func</tt> with respect to
 * its first argument using Brent's method root-finding algorithm.
 *
 * Translated from zeroin.c in http://www.netlib.org/c/brent.shar.
 *
 * Copyright (c) 2012 Borgar Thorsteinsson <borgar@borgar.net>
 * MIT License, http://www.opensource.org/licenses/mit-license.php
 *
 * @param func function for which the root is sought.
 * @param lowerLimit the lower point of the interval to be searched.
 * @param upperLimit the upper point of the interval to be searched.
 * @param errorTol the desired accuracy (convergence tolerance).
 * @param maxIter the maximum number of iterations.
 * @param acceptableErrorTol return a result even if errorTol isn't reached after maxIter.
 * @returns an estimate for the root within accuracy.
 *
 */
export default function uniroot(
	func: (x: number) => number,
	lowerLimit: number,
	upperLimit: number,
	errorTol = 0,
	maxIter = 100,
	acceptableErrorTol = 0
) {
	let a = lowerLimit,
		b = upperLimit,
		c = a,
		fa = func(a),
		fb = func(b),
		fc = fa,
		actualTolerance: number,
		newStep: number, // Step at this iteration
		prevStep: number, // Distance from the last but one to the last approximation
		p: number, // Interpolation step is calculated in the form p/q; division is delayed until the last moment
		q: number,
		fallback: number | undefined = undefined

	while (maxIter-- > 0) {
		prevStep = b - a

		if (Math.abs(fc) < Math.abs(fb)) {
			// Swap data for b to be the best approximation
			;(a = b), (b = c), (c = a)
			;(fa = fb), (fb = fc), (fc = fa)
		}

		actualTolerance = 1e-15 * Math.abs(b) + errorTol / 2
		newStep = (c - b) / 2

		if (Math.abs(newStep) <= actualTolerance || fb === 0) {
			return b // Acceptable approx. is found
		}

		// Decide if the interpolation can be tried
		if (Math.abs(prevStep) >= actualTolerance && Math.abs(fa) > Math.abs(fb)) {
			// If prevStep was large enough and was in true direction, Interpolatiom may be tried
			let t1: number, t2: number
			const cb = c - b
			if (a === c) {
				// If we have only two distinct points linear interpolation can only be applied
				t1 = fb / fa
				p = cb * t1
				q = 1.0 - t1
			} else {
				// Quadric inverse interpolation
				;(q = fa / fc), (t1 = fb / fc), (t2 = fb / fa)
				p = t2 * (cb * q * (q - t1) - (b - a) * (t1 - 1))
				q = (q - 1) * (t1 - 1) * (t2 - 1)
			}

			if (p > 0) {
				q = -q // p was calculated with the opposite sign; make p positive
			} else {
				p = -p // and assign possible minus to q
			}

			if (
				p < 0.75 * cb * q - Math.abs(actualTolerance * q) / 2 &&
				p < Math.abs((prevStep * q) / 2)
			) {
				// If (b + p / q) falls in [b,c] and isn't too large it is accepted
				newStep = p / q
			}

			// If p/q is too large then the bissection procedure can reduce [b,c] range to more extent
		}

		if (Math.abs(newStep) < actualTolerance) {
			// Adjust the step to be not less than tolerance
			newStep = newStep > 0 ? actualTolerance : -actualTolerance
		}

		;(a = b), (fa = fb) // Save the previous approx.
		;(b += newStep), (fb = func(b)) // Do step to a new approxim.

		if ((fb > 0 && fc > 0) || (fb < 0 && fc < 0)) {
			;(c = a), (fc = fa) // Adjust c for it to have a sign opposite to that of b
		}

		if (Math.abs(fb) < acceptableErrorTol) {
			fallback = b
		}
	}
	return fallback
}
