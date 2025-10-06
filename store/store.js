import {combineReducers, configureStore} from  "@reduxjs/toolkit"
import persistReducer from "redux-persist/es/persistReducer"
import localStorage from "redux-persist/es/storage"
import authReducer from "./reducer/authReducer"
import persistStore from "redux-persist/es/persistStore"

const rootReducer = combineReducers({
        authStore : authReducer
})

const persistConfig ={
    key:'root',
    storage: localStorage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>getDefaultMiddleware({serializableCheck:false})
})


export const persistor = persistStore(store)
