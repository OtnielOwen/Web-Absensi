import CONSTANT, { ROLE_KEYS } from './constant';

/** @typedef {keyof (typeof ROLE_KEYS)} RoleType */

/** @param {RoleType} role */
export function setRole(role) {
  role = ROLE_KEYS[role] || null;
  localStorage.setItem(CONSTANT.ROLE_USER, role);
}

/** @returns {RoleType} */
export function getRole() {
  const key = localStorage.getItem(CONSTANT.ROLE_USER);
  if (key === ROLE_KEYS.admin) {
    return ROLE_KEYS.admin || null;
  } else {
    return ROLE_KEYS.user || null;
  }
}
