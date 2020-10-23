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
 * @param {function} func function for which the root is sought.
 * @param {number} lowerLimit the lower point of the interval to be searched.
 * @param {number} upperLimit the upper point of the interval to be searched.
 * @param {number} errorTol the desired accuracy (convergence tolerance).
 * @param {number} maxIter the maximum number of iterations.
 * @returns an estimate for the root within accuracy.
 *
 */
export default function uniroot(
	func: (x: number) => number,
	lowerLimit: number,
	upperLimit: number,
	errorTol: number,
	maxIter: number
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
		q: number

	errorTol = errorTol || 0
	maxIter = maxIter || 1000

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
	}
}

export function modifiedNewtonRaphson(f, fp, fpp, x0, options) {
	var x1,
		y,
		yp,
		ypp,
		tol,
		maxIter,
		iter,
		yph,
		ymh,
		yp2h,
		ym2h,
		h,
		hr,
		h2r,
		verbose,
		eps,
		denom

	// Iterpret variadic forms:
	if (typeof fpp !== 'function') {
		if (typeof fp === 'function') {
			options = x0
			x0 = fpp
		} else {
			options = fpp
			x0 = fp
			fp = null
		}
		fpp = null
	}

	options = options || {}
	tol = options.tolerance === undefined ? 1e-7 : options.tolerance
	eps = options.epsilon === undefined ? 2.220446049250313e-16 : options.epsion
	maxIter = options.maxIterations === undefined ? 20 : options.maxIterations
	h = options.h === undefined ? 1e-4 : options.h
	verbose = options.verbose === undefined ? false : options.verbose
	hr = 1 / h
	h2r = hr * hr

	iter = 0
	while (iter++ < maxIter) {
		// Compute the value of the function:
		y = f(x0)

		// Compute the second derivative using a fourth order central difference:
		if (fpp) {
			yp = fp(x0)
			ypp = fpp(x0)
		} else {
			if (fp) {
				// Has first derivative specified:
				yp = fp(x0)

				// Evaluate first derivative to compute second numerically:
				yph = fp(x0 + h)
				ymh = fp(x0 - h)
				yp2h = fp(x0 + 2 * h)
				ym2h = fp(x0 - 2 * h)

				// Second derivative is first derivative of the first derivative:
				ypp = ((8 * (yph - ymh) + (ym2h - yp2h)) * hr) / 12
			} else {
				// Needs first and second numerical derivatives:
				yph = f(x0 + h)
				ymh = f(x0 - h)
				yp2h = f(x0 + 2 * h)
				ym2h = f(x0 - 2 * h)

				yp = ((8 * (yph - ymh) + (ym2h - yp2h)) * hr) / 12
				ypp = ((-30 * y + 16 * (yph + ymh) - (yp2h + ym2h)) * h2r) / 12
			}
		}

		// Check for badly conditioned first derivative (extremely small relative to function):
		if (Math.abs(yp) <= eps * Math.abs(y)) {
			if (verbose) {
				console.log(
					'Modified Newton-Raphson: failed to converged due to nearly zero first derivative'
				)
			}
			return false
		}

		denom = yp * yp - y * ypp

		if (denom === 0) {
			if (verbose) {
				console.log(
					'Modified Newton-Raphson: failed to converged due to divide by zero'
				)
			}
			return false
		}

		// Update the guess:
		x1 = x0 - (y * yp) / denom

		// Check for convergence:
		if (Math.abs(x1 - x0) <= tol * Math.abs(x1)) {
			if (verbose) {
				console.log(
					'Modified Newton-Raphson: converged to x = ' +
						x1 +
						' after ' +
						iter +
						' iterations'
				)
			}
			return x1
		}

		// Transfer update to the new guess:
		x0 = x1
	}

	if (verbose) {
		console.log(
			'Modified Newton-Raphson: Maximum iterations reached (' + maxIter + ')'
		)
	}

	return false
}

export function newtonRaphson(f, fp, x0, options) {
	var x1, y, yp, tol, maxIter, iter, yph, ymh, yp2h, ym2h, h, hr, verbose, eps

	// Iterpret variadic forms:
	if (typeof fp !== 'function') {
		options = x0
		x0 = fp
		fp = null
	}

	options = options || {}
	tol = options.tolerance === undefined ? 1e-7 : options.tolerance
	eps = options.epsilon === undefined ? 2.220446049250313e-16 : options.epsilon
	maxIter = options.maxIterations === undefined ? 20 : options.maxIterations
	h = options.h === undefined ? 1e-4 : options.h
	verbose = options.verbose === undefined ? false : options.verbose
	hr = 1 / h

	iter = 0
	while (iter++ < maxIter) {
		// Compute the value of the function:
		y = f(x0)

		if (fp) {
			yp = fp(x0)
		} else {
			// Needs numerical derivatives:
			yph = f(x0 + h)
			ymh = f(x0 - h)
			yp2h = f(x0 + 2 * h)
			ym2h = f(x0 - 2 * h)

			yp = ((ym2h - yp2h + 8 * (yph - ymh)) * hr) / 12
		}

		// Check for badly conditioned update (extremely small first deriv relative to function):
		if (Math.abs(yp) <= eps * Math.abs(y)) {
			if (verbose) {
				console.log(
					'Newton-Raphson: failed to converged due to nearly zero first derivative'
				)
			}
			return false
		}

		// Update the guess:
		x1 = x0 - y / yp

		// Check for convergence:
		if (Math.abs(x1 - x0) <= tol * Math.abs(x1)) {
			if (verbose) {
				console.log(
					'Newton-Raphson: converged to x = ' +
						x1 +
						' after ' +
						iter +
						' iterations'
				)
			}
			return x1
		}

		// Transfer update to the new guess:
		x0 = x1
	}

	if (verbose) {
		console.log('Newton-Raphson: Maximum iterations reached (' + maxIter + ')')
	}

	return false
}
