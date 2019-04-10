const types = {
	'SET_USER': 'SET_USER'
}

export default types

export const a_setUser = payload => {
	return ({
		type: types.SET_USER,
		payload
	})
}
