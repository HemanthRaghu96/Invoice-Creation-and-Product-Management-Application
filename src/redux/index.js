import { combineReducers } from "@reduxjs/toolkit";
import invoicesReducer from "./invoicesSlice"; 
import productsReducer from "./productSlice"
import groupReducer from "./groupSlice"
const rootReducer = combineReducers({
  invoices: invoicesReducer,
  products: productsReducer,
  group:groupReducer
});

export default rootReducer;