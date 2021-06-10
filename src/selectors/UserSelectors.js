export function getUser(state) {
  return Object.keys(state.user).length > 0 ? state.user : null;
}

export function getJwtToken(state) {
  return Object.keys(state.user).length > 0 ? state.user.jwtToken : null;
}

export function getBasicInfo(state) {
  return Object.keys(state.user).length > 0 ? {call_id: state.user.call_id, email: state.user.email, id: state.user.oid, avatar: state.user.avatar.image_hash, first_name: state.user.first_name, last_name: state.user.last_name, refresh_token: state.user.refresh_token} : null;
}
