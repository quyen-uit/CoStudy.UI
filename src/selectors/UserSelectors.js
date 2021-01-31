export function getUser(state) {
  return Object.keys(state.user).length > 0 ? state.user : null;
}

export function getJwtToken(state) {
  return Object.keys(state.user).length > 0 ? state.user.jwtToken : null;
}

export function getBasicInfo(state) {
  return Object.keys(state.user).length > 0 ? {id: state.user.oid, avatar: state.user.avatar.image_hash, first_name: state.first_name, last_name: state.last_name} : null;
}
