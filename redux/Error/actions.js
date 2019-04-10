const types = {
	'SET_ERROR': 'SET_ERROR'
}

export default types

export const a_setError = (payload) => ({
	type: types.SET_ERROR,
	payload
})
