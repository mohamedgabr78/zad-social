import {atom} from 'recoil';

const conversationAtom = atom({
    key: 'conversationAtom',
    default: [],
});


const selectedConversationAtom = atom({
    key: 'selectedConversationAtom',
    default: {
        _id: '',
        userId: '',
        username: '',
        profilePic: '',
    },
});

export {conversationAtom, selectedConversationAtom};
