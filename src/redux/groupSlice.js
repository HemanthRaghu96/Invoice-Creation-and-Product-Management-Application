import { createSlice, current } from "@reduxjs/toolkit";

// Create a slice of the Redux store for managing groups

const groupSlice = createSlice({
  name: "group",
  initialState: {}, 
  reducers: {
    // Reducer to add a group to the state
    addGroup: (state, action) => {
      const { invoiceID, groupsWithProducts } = action.payload;
      // Add or update the group for the given invoice ID
      state[invoiceID] = groupsWithProducts;
    },

    // Reducer to remove a group by its invoice ID
    removeGroupByInvoiceID: (state, action) => {
      const currentState = current(state); 
      const { [action.payload]: deletedProperty, ...newState } = currentState;
      return newState;
    },
  },
});

export const { addGroup, removeGroupByInvoiceID } = groupSlice.actions;
export const selectGroup = (state) => state.group;
export default groupSlice.reducer;
