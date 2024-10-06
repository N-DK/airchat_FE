const LISTEN_EVENT = {
    NEW_PRIVATE_MESSAGE: 'newPrivateMessage',
    MESSAGE_SENT_CONFIRMATION: 'messageSentConfirmation',
    MESSAGE_READ_NOTIFICATION: 'messageReadNotification',
    MESSAGE_REACTION_NOTIFICATION: 'messageReactionNotification',
    MESSAGE_DELETE_NOTIFICATION: 'messageDeleteNotification',
    SYSTEM_NOTIFICATION: 'systemNotification',
};

const EMIT_EVENT = {
    PRIVATE_MESSAGE: 'privateMessage',
    MESSAGE_READ: 'messageRead',
    DELETE_MESSAGE: 'deleteMessage',
    MESSAGE_REACTION: 'messageReaction',
};

export { LISTEN_EVENT, EMIT_EVENT };
