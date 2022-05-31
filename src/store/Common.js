import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Api from './Api'

const initialState = {
  data: null,
}

export const getDataAsync = createAsyncThunk('common/getdata', async (form) => {
  try {
    const response = await Api().post('getCommon', form)
    return response.data
  } catch (error) {
    return error.response
  }
})

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDataAsync.fulfilled, (state, action) => {
      console.log(action.payload)
      const code = action.payload.code
      if (code === 200) {
        state.data = action.payload.data
      }
    })
  },
})

export const { setData } = commonSlice.actions
export const selectCommonData = (state) => state.common.data
export default commonSlice.reducer
