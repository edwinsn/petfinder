import { configureStore } from '@reduxjs/toolkit'
import editingReducer from './features/editingSlice'
import notificationsSlice from './features/notificationsSlice'
import backupSlice from './features/recoverSlice'

export default configureStore({
    reducer: {
        editing: editingReducer,
        notifications: notificationsSlice,
        backup:backupSlice
    }
})