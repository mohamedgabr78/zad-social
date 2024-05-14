import { atom } from "recoil";

const postsAtom = atom({
	key: "postsAtom",
	default: [],
});

export {postsAtom};