import axios from 'axios'
import { store } from '../reducers/store'
import { a_setAuth } from '../redux/Auth/actions'
import { a_setError } from '../redux/Error/actions'
import { disconnectFromSocket, socket } from '../utils/socket'
import NavigationProvider from './NavigationProvider'
const SERVER_URL = 'http://ser.multiverse.plus/api'

/**
 * Request function to get data from server
 * @param method {string} request method
 * @param r_path {string} api endpoint
 * @param attr {Object} request parameters
 * @param config {Object} request configurations
 * @param success {function} handle server response
 * @param failFunc {function} custom server error handler
 */
export default async function sendRequest({
	method = 'get',
	r_path = '/',
	attr = null,
	config = {
		headers: {
			Authorization: 'Bearer ' + store.getState().userReducer.auth
		}
	},
	success = (res) => console.log(res),
	failFunc = null,
	full_res = false
}) {
	try {
		let response = null
		if (method !== 'get') {
			response = await axios[method](SERVER_URL + r_path, attr, config)
		}
		else {
			response = await axios.get(SERVER_URL + r_path, config)
		}
		if (full_res) {
			success(response)
		} else {
			success(response.data)
		}
	} catch (err) {
		const { response } = err
		// console.log(response.data)
		// console.log(response)
		console.log('error in path -->', r_path)
		if (!response || response.status === 500) {
			store.dispatch(a_setError(true))
			if (failFunc) {
				failFunc('Server error')
			}
		} else if (response.status === 401) {
			store.dispatch(a_setAuth(null))
			NavigationProvider.logoutNavigation()
		} else {
			if (failFunc) {
				failFunc(response.data)
			} else {
				console.log(response)
			}
		}
	}
}
