import { createSlice } from '@reduxjs/toolkit'
export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: {
        value: {
            progress: 0,
            showProgress: false,
            showOutOfRange: false,
            showMarkerInThere: false,
            withoutConnection: false,
            feedBack: false,
            noEditable: false,
            editInstructions: false
        }
    },
    reducers: {
        showNotifications: (state, action) => {
            console.log("18")
            state.value = { ...state.value, ...action.payload }
        },
        hideNotifications: state => {
            console.log("22")
            state.value = {}
        }
    }
})

export const { showNotifications, hideNotifications } = notificationsSlice.actions
export default notificationsSlice.reducer