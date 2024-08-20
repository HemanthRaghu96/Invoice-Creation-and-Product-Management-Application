import { createSlice, current } from "@reduxjs/toolkit";
import calculateTotal from "../utils/calculateTotal";

const initialState = [];

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    addInvoice: (state, action) => {
      state.push(action.payload);
    },
    deleteInvoice: (state, action) => {
      return state.filter((invoice) => invoice.id !== action.payload);
    },
    updateInvoice: (state, action) => {
      const index = state.findIndex(
        (invoice) => invoice.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload.updatedInvoice;
      }
    },
    updateInvoiceTotal: (state, action) => {
      const { items, invoiceID } = action.payload;
      const requiredInvoiceIdx = state.findIndex(
        (invoice) => invoice.id === invoiceID
      );
      const requiredInvoice = current(state)[requiredInvoiceIdx];
      const amount = calculateTotal(
        items,
        requiredInvoice.taxRate,
        requiredInvoice.discountRate
      );
      state[requiredInvoiceIdx] = { ...requiredInvoice, ...amount };
    },
  },
});

export const { addInvoice, deleteInvoice, updateInvoice, updateInvoiceTotal } =
  invoicesSlice.actions;

export const selectInvoiceList = (state) => state.invoices;

export default invoicesSlice.reducer;
