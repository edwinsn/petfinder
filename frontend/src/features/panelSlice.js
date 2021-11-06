import { createSlice } from '@reduxjs/toolkit'
export const panelSlice = createSlice({
    name: 'panel', initialState: { value: { opened: false, markerData: {} } },
    reducers: {
        open: (state, action) => {
            return { value: { opened: true, markerData: action.payload.markerData } }
        },
        close: () => {
            return { value: { opened: false, markerData: {} } }
        }
    }
})

export const { open, close } = panelSlice.actions
export default panelSlice.reducer