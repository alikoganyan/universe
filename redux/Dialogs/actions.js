const types = {
	'SET_AUTH':'SET_AUTH'
}

export default types

export const a_setAuth = payload => ({
	type: types.SET_AUTH,
	payload
})
