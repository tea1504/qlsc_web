import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Api from './Api'
import cookie from 'js-cookie'

export const loginAsync = createAsyncThunk('login/post', async (form) => {
  try {
    const response = await Api().post('/auth/login', form)
    return response.data
  } catch (error) {
    return error.response
  }
})

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    form: {
      username: 'admin',
      password: 'admin',
      errUsername: null,
      errPassword: null,
      isSubmitted: false,
    },
    error: null,
    token: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload
    },
    setFormUsername: (state, action) => {
      state.form.username = action.payload
    },
    setFormPassword: (state, action) => {
      state.form.password = action.payload
    },
    setFormStatus: (state, action) => {
      state.form.isSubmitted = action.payload
    },
    resetAllErr: (state) => {
      state.form.errPassword = null
      state.form.errUsername = null
      state.error = null
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      const code = action.payload.code
      if (code === 200) {
        cookie.set('jwt', action.payload.data.access_token, {
          expires: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
        })
        state.token = action.payload.data.access_token
      } else if (code === 400) {
        state.token = action.payload
        if (action.payload.errors.message) {
          action.payload.errors.message.map((err) => {
            if (err.includes('username')) state.form.errUsername = err
            else state.form.errPassword = err
          })
        } else {
          state.error = action.payload.errors
        }
      }
    })
  },
})

export const { setToken, setFormPassword, setFormUsername, setFormStatus, resetAllErr } =
  loginSlice.actions
export const selectLoginToken = (state) => state.login.token
export const selectLoginForm = (state) => state.login.form
export const selectLoginError = (state) => state.login.error
export default loginSlice.reducer
