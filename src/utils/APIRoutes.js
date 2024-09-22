export const baseurl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
export const registerRoute = `${baseurl}/api/auth/register`
export const loginRoute = `${baseurl}/api/auth/login`
export const setAvatarRoute = `${baseurl}/api/auth/set-avatar`
export const getAllUsersRoute = `${baseurl}/api/auth/all-users`
export const sendMessageRoute = `${baseurl}/api/messages/add-message`
export const getMessagesRoute = `${baseurl}/api/messages/get-message`