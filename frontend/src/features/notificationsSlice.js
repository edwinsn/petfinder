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
            state.value = { ...state.value, ...action.payload }
        },
        hideNotifications: state => { state.value = {} }
    }
})
// Action creators are generated for each case reducer function
export const { showNotifications, hideNotifications } = notificationsSlice.actions
export default notificationsSlice.reducer