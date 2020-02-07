export const filterAllContacts = (val, state, props, that) => {
  const { options, allContacts, userContactsAll } = state
  const { dialogs } = props
  const { active } = options
  if (active === 0 && allContacts && allContacts.length) {
    const filtredAllContacts = allContacts.filter(
      e =>
        (e.first_name &&
          e.last_name &&
          (e.first_name.toLowerCase() + e.last_name.toLowerCase()).indexOf(
            val.replace(/\s/g, '').toLowerCase(),
          ) !== -1) ||
        (e.name &&
          e.name
            .toLowerCase()
            .replace(/\s/g, '')
            .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1) ||
        (e.phone_number &&
          e.phone_number
            .toLowerCase()
            .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1),
    )
    that.setState({ filtredAllContacts: val ? filtredAllContacts : null })
  } else if (
    (active === 1 || active === 0) &&
    userContactsAll &&
    userContactsAll.length
  ) {
    const filtredAllContacts = userContactsAll.filter(
      e =>
        (e.first_name &&
          e.last_name &&
          (e.first_name.toLowerCase() + e.last_name.toLowerCase()).indexOf(
            val.replace(/\s/g, '').toLowerCase(),
          ) !== -1) ||
        (e.phone_number &&
          e.phone_number
            .toLowerCase()
            .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1),
    )
    that.setState({
      filteredUserContactsAll: val ? filtredAllContacts : null,
    })
  } else if (active === 2 && dialogs && dialogs.length) {
    const filtredGroups = dialogs.filter(
      e =>
        e.isGroup &&
        e.name &&
        e.name
          .replace(/\s/g, '')
          .toLowerCase()
          .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1,
    )
    that.setState({ filteredGroups: val ? filtredGroups : null })
  }
}

export const filterWithDepartaments = (val, state, that) => {
  const { departments } = state
  const filteredDepartments = departments.map(d => {
    const data = !!(d.data && d.data.length)
      ? d.data
      : !!(d.users_this && d.users_this.length)
      ? d.users_this
      : null
    if (data) {
      const filtredDep = data.filter(
        e =>
          (e.first_name &&
            e.last_name &&
            (e.first_name.toLowerCase() + e.last_name.toLowerCase()).indexOf(
              val.replace(/\s/g, '').toLowerCase(),
            ) !== -1) ||
          (e.name &&
            e.name
              .toLowerCase()
              .replace(/\s/g, '')
              .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1) ||
          (e.phone_number &&
            e.phone_number
              .toLowerCase()
              .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1),
      )
      const key = d.data ? 'data' : 'users_this'
      return { ...d, [key]: [...filtredDep] }
    }
    return d
  })
  that.setState({ filteredDepartments })
}

export const filterWithGroups = (val, state, that) => {
  const { groups } = state
  const filteredGroups = groups.map(g => {
    if (g.participants && g.participants.length) {
      const filtredGroup = g.participants.filter(
        e =>
          (e.first_name &&
            e.last_name &&
            (e.first_name.toLowerCase() + e.last_name.toLowerCase()).indexOf(
              val.replace(/\s/g, '').toLowerCase(),
            ) !== -1) ||
          (e.name &&
            e.name
              .toLowerCase()
              .replace(/\s/g, '')
              .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1) ||
          (e.phone_number &&
            e.phone_number
              .toLowerCase()
              .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1),
      )
      return { ...g, participants: [...filtredGroup] }
    }
    return g
  })
  that.setState({ filteredGroups })
}
