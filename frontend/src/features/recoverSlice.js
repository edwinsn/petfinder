import { createSlice } from '@reduxjs/toolkit'
export const backupSlice = createSlice({
    name: 'backup', initialState: { value: false },
    reducers: {
        triggerBackup: (state, action) => {
            console.log("6")
            state.value = { ...action.payload }
        },
        addBackup: (state, action) => {
            console.log("10")
            state.value = { pointDeleted: action.payload }
        }
    }
})

export const { triggerBackup, addBackup } = backupSlice.actions
export default backupSlice.reducer