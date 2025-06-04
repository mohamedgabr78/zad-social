import { atom } from "recoil";


// This atom is used to keep track of the user either there is something in the local storage or null
const userAtom = atom({
    key: 'userAtom',
    default: JSON.parse(localStorage.getItem('user-threads'))
})

export { userAtom }