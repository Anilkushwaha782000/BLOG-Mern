import { createSlice } from '@reduxjs/toolkit'
const initialState={
    currentUser:null,
    error:null,
    loading:false
}
const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading=true,
            state.error=null
        },
        signInSuccess:(state,action) =>{
            state.currentUser=action.payload,
            state.error=null,
            state.loading=false
        },
        signInFailuer:(state,action)=>{
         state.loading=false,
         state.error=action.payload
        }
    }
})
export const{signInFailuer,signInStart,signInSuccess}=userSlice.actions;
export default userSlice.reducer;