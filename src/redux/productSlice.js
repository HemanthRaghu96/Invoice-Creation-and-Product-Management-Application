import { createSlice, current } from "@reduxjs/toolkit";

const initialState = [];

// Create a slice of the Redux store for managing products
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Reducer to add products to the state
    addProduct: (state, action) => {
      const addedItemIDs = [];

      // Iterate over each product in the payload
      action.payload.products.forEach((cur) => {
        // Check if the product already exists in the state
        const idx = state.findIndex((prev) => prev.itemId === cur.itemId);
        if (idx !== -1) {
          // If product exists, mark it as updated and append the invoice ID
          addedItemIDs.push(cur.itemId);
          const previousProductState = current(state)[idx];
          state[idx] = {
            ...previousProductState,
            invoices: [
              ...previousProductState["invoices"],
              action.payload.invoiceID,
            ],
          };
        }
      });

      // Determine which products are new (not yet in the state)
      const receivedItems = action.payload.products
        .map((item) => {
          if (!addedItemIDs.includes(item.itemId))
            return {
              itemId: item.itemId,
              itemName: item.itemName,
              itemDescription: item.itemDescription,
              itemPrice: item.itemPrice,
              itemQuantity: item.itemQuantity,
              invoices: [action.payload.invoiceID],
            };
          return null;
        })
        .filter((item) => item !== null);
      console.log({ receivedItems });

      // Add new products to the state
      state.push(...receivedItems);
    },

    // Reducer to delete a product from the state by item ID
    deleteProduct: (state, action) => {
      return state.filter((item) => item.itemId !== action.payload);
    },

    // Reducer to update existing products or add new ones
    updateProducts: (state, action) => {
      debugger; // Debugger breakpoint
      const products = action.payload.items;
      products.forEach((item) => {
        // Find the index of the product in the state
        const index = state.findIndex(
          (product) => product.itemId === item.itemId
        );
        console.log({ index });

        if (index !== -1) {
          // If product exists, update its invoices
          const prevInvoices = current(state)[index].invoices;
          const currentInvoices = item.invoices;
          console.log({ prevInvoices, currentInvoices });

          state[index] = {
            ...item,
            invoices: [
              ...new Set([
                ...prevInvoices,
                ...currentInvoices,
                action.payload.invoiceID,
              ]),
            ],
          };
        } else {
          // If product does not exist, add it to the state
          state.push({
            itemId: item.itemId,
            itemName: item.itemName,
            itemDescription: item.itemDescription,
            itemPrice: item.itemPrice,
            itemQuantity: item.itemQuantity,
            invoices: [action.payload.invoiceID],
          });
        }
      });
    },

    // Reducer to remove specific invoices from products
    deleteInvoicesFromProduct: (state, action) => {
      const { itemsIds, invoiceId } = action.payload;

      return state
        .map((item) => {
          if (itemsIds.includes(item.itemId)) {
            // Filter out the invoice ID from the invoices array
            const updatedInvoices = item.invoices.filter(
              (invoice) => parseInt(invoice) !== invoiceId
            );
            return { ...item, invoices: updatedInvoices };
          }
          return item;
        })
        .filter((item) => item.invoices.length > 0); // Remove products with no invoices left
    },
  },
});

export default productsSlice.reducer;

export const {
  addProduct,
  deleteProduct,
  updateProducts,
  deleteInvoicesFromProduct,
} = productsSlice.actions;
export const selectProducts = (state) => state.products;
