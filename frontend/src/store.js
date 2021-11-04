import { configureStore } from '@reduxjs/toolkit'
import editingReducer from './features/editingSlice'
import notificationsSlice from './features/notificationsSlice'
import backupSlice from './features/recoverSlice'
import panelSlice from './features/panelSlice'

export default configureStore({
    reducer: {
        editing: editingReducer,
        notifications: notificationsSlice,
        backup: backupSlice,
        panel: panelSlice
    }
})