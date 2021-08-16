import { createSlice } from '@reduxjs/toolkit'
export const editingSlice = createSlice({
    name: 'editing', initialState: { value: false }, reducers: {
        activate: state => {
            //console.log("5")
            state.value = true
        },
        deactivate: state => {
            //console.log("9")
            state.value = false
        }
    }
})
// Action creators are generated for each case reducer function
export const { activate, deactivate } = editingSlice.actions
export default editingSlice.reducer