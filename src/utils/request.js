import axios from 'axios'
import { store } from '../reducers/store'
import { setAuth, setError } from '../actions/userActions'
import { disconnectFromSocket, socket } from './socket'
import NavigationProvider from './NavigationProvider'

const SERVER_URL = 'https://ser.univ.team/api'

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
      Authorization: `Bearer ${store.getState().userReducer.auth}`,
    },
  },
  success = res => {
    console.log(res)
  },
  failFunc = null,
  full_res = false,
}) {
  try {
    let response = null
    if (method !== 'get') {
      if (method === 'delete') {
        response = await axios.delete(SERVER_URL + r_path, {
          headers: {
            Authorization: `Bearer ${store.getState().userReducer.auth}`,
          },
          data: attr,
        })
      } else {
        response = await axios[method](SERVER_URL + r_path, attr, {
          ...config,
          headers: {
            Authorization: `Bearer ${store.getState().userReducer.auth}`,
          },
        })
      }
    } else {
      response = await axios.get(SERVER_URL + r_path, {
        ...config,
        headers: {
          Authorization: `Bearer ${store.getState().userReducer.auth}`,
        },
      })
    }
    if (full_res) {
      success(response)
    } else {
      success(response.data)
    }
  } catch (err) {
    const { response } = err
    // console.log(response.data)
    // console.log(store.getState().userReducer.auth);
    console.log('error in path -->', r_path, err)
    if (!response || response.status === 500) {
      store.dispatch(setError(true))
      if (failFunc) {
        failFunc('Server error')
      }
    } else if (response.status === 401) {
      store.dispatch(setAuth(null))
      NavigationProvider.logoutNavigation()
    } else {
      failFunc ? failFunc(response.data) : console.log(response)
    }
  }
}