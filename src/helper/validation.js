export const validateEmail = (value, that) => {
  const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (emailReg.test(value)) {
    that.setState({ emailError: '' })
    return false
  }
  that.setState({ emailError: 'Неправильный электронная почта' })
  return true
}
