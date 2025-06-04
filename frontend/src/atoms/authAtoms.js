// Desc: Atoms for the auth screen

import { atom } from 'recoil'

// This atom is used to keep track of the current screen in the auth page
const authScreenAtom = atom({
    key: 'authScreen',
    default: 'login'
})

export { authScreenAtom }