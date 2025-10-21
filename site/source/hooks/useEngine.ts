import { Rules } from '@/domaine/publicodes/Rules';
import { ModeleId } from '@/domaine/SimulationConfig'
import { engineFactory } from '@/utils/publicodes/engineFactory';
import { useEffect, useState } from 'react'

const defaultModele = 'modele-social' satisfies ModeleId

export const useEngine = (modeleId?: ModeleId) => {
	console.log('useEngine')
  const [resource, setResource] = useState(null);
	console.log('useEngine resource', resource)
  useEffect(() => {
    const _resource = wrapPromise(loadEngine(modeleId));
		console.log('useEngine _resource', _resource)
    setResource(_resource);
  }, []);

  const result = resource?.read();

	console.log('useEngine result', result)
}

// export function useEngine(modeleId?: ModeleId): Engine<DottedName> {
// 	const currentModeleId = useSelector(modeleIdSelector)!
// 	const modele = modeleId ?? currentModeleId
// 	console.log('useEngine', modeleId, currentModeleId, modele)
// 	const engine = getEngine(modele)

// 	if (!engine) {
// 		throw Promise.reject(new Error('pas de moteur'))
// 	}
// 	console.log('useEngine engine situation', engine.getSituation())

// 	return engine
// }

const loadEngine = async (modele?: ModeleId) => {
	console.log('loadEngine')
	const modeleId = modele || defaultModele
	const rules = (await import(`../../../../${modeleId}/dist/index.js`))
		.default as Rules
	const engine = engineFactory(rules)
	console.log('loadEngine engine', engine)

	return engine
}

function wrapPromise<T>(promise: Promise<T>) {
	console.log('wrapPromise')
  let status = 'pending'
  let result: T | null
	let error: unknown

	const suspender = promise.then(
    (r: T) => {
			console.log('then')
      status = 'success'
      result = r
			error = null
    },
    (e: unknown) => {
      status = 'error'
      error = e
			result = null
    }
  )

  return {
    read() {
      console.log('read', status)
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw error;
      } else if (status === 'success') {
        return result;
      }
    },
  }
}