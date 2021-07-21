import { configureStore } from '@reduxjs/toolkit'
import editingReducer from './features/editingSlice'
import notificationsSlice from './features/notificationsSlice'

export default configureStore({
    reducer: {
        editing: editingReducer,
        notifications: notificationsSlice
    }
})