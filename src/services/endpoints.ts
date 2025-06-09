
export const AUTH_ENDPOINTS ={
    POST_SIGN_IN: `/api/auth/sign-in`,
    POST_SIGN_UP: '/api/auth/sign-up',
    POST_VALIDATION_SIGN_IN: '/api/auth/sign-in/verify-otp',
    POST_VALIDATION_SIGN_UP: '/api/auth/sign-up/verify-otp',
    POST_FORGOT_PASSWORD: '/api/auth/forgot-password',
    PUT_CHANGE_PASSWORD: '/api/auth/forgot-password/change-password',
    POST_FORGOT_PASSWORD_VERIFICATION: '/api/auth/forgot-password/password-verification',
    DELETE_TOKEN_DELETE_TOKEN: '/api/auth/delete-token',
    POST_TOKEN_REFRESH_TOKEN: '/api/auth/refresh-token'
} as const;

export const USER_ENDPOINTS = {
    GET_USER: '/api/user',
    PUT_ADD_INFO_USER: '/api/user/add-info-user',
    DELETE_USER: '/api/user/delete-user',
    POST_PROMOTE: '/api/user/promote',
    PUT_UPDATE_AVATAR: '/api/user/update-avatar',
    PUT_UPDATE_FMC_TOKEN: '/api/user/update/fcn-token',
    PUT_UPDATE_NAME: '/api/user/update/name',
    PUT_UPDATE_PHONE_NUMBER: '/api/user/update/phone-number',
    PUT_UPDATE_STATUS: '/api/user/update/status',
    PUT_UPDATE_TWO_FACTOR_OFF: '/api/user/update/two-factor-disable',
    PUT_UPDATE_TWO_FACTOR_ON: '/api/user/update/two-factor-enable',
    GET_SCHOOLDATA_CHECK_VERSION: '/api/user/schooldata/check-version',
    GET_SCHOOLDATA_TIMETABLE: '/api/user/schooldata/timetable',
    POST_SCHOOLDATA_TIMETABLE: '/api/user/schooldata/timetable',
    GET_SCHOOLDATA_INFO: '/api/user/schooldata/timetable-info' 
} as const;

export const NOTATION_ENDPOINTS = {
    GET_CHECK_SCORE: '/api/notation/check-score',
    POST_NOTATION_SEND_TO_MANY: '/api/notation/send-to-many',
    POST_NOTATION_SEND_TO_ONE: '/api/notation/send-to-one'
} as const;

export const CHAT_ENDPOINTS = {
    POST_CREATE_GROUP: '/api/chat/create-group',
    POST_DELETE_CREATE_GROUP: '/api/chat/delete-groups',
    GET_ALL_GROUPS: '/api/chat/get-all-rooms',
    GET_LOAD_GROUPS: '/api/chat/load-rooms',
    GET_SEARCH_GROUPS: '/api/chat/search-groups',
    GET_ROOM_HISTORY: '/api/chat/room/get-history',
    GET_ROOM_USER: '/api/chat/room/get-room-user',
    GET_ROOM_INFO: '/api/chat/room/info',
    POST_ROOM_JOIN_ROOM: '/api/chat/room/join-room',
    POST_ROOM_KICK_MEMBER: '/api/chat/room/kick-member',
    POST_ROOM_LEAVE_ROOM: '/api/chat/room/leave-room'
} as const;

export const NOTIFICATION_ENDPOINT = {
    POST_SENT_TO_ONE: '/api/notification/send-to-one',
    POST_SENT_TO_MANY: '/api/notification/send-to-many',
    POST_SENT_BY_CONDITION: '/api/notification/send-by-condition',
    POST_SEND_BY_ACADEMIC: '/api/notification/send-by-academic',
    GET_HISTORY: '/api/notification/history',
    DELETE_NOTIFICATION_ID: '/api/notification/delete/id=',
} as const;