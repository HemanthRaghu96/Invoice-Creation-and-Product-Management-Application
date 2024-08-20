import { useSelector } from "react-redux";
import { selectInvoiceList } from "./invoicesSlice";
import { selectProducts } from "./productSlice";
import { selectGroup } from "./groupSlice";

// Custom hook to manage invoice list data
export const useInvoiceListData = () => {
  // Access invoice list from the Redux store
  const invoiceList = useSelector(selectInvoiceList);

  // Function to get a single invoice by ID
  const getOneInvoice = (receivedId) => {
    return (
      invoiceList.find(
        (invoice) => invoice.id.toString() === receivedId.toString()
      ) || null
    );
  };

  const listSize = invoiceList.length;

  return {
    invoiceList,
    getOneInvoice,
    listSize,
  };
};

// Custom hook to manage products data
export const useProducts = () => {
  const products = useSelector(selectProducts);
  const productsSize = products.length;

  // Function to get items associated with a specific invoice ID
  const getItemsByInvoiceId = (invoiceID) => {
    return products.filter((product) =>
      product.invoices.includes(parseInt(invoiceID))
    );
  };

  return { products, productsSize, getItemsByInvoiceId };
};

// Custom hook to manage group data
export const useGroup = () => {
  const group = useSelector(selectGroup);

  const groupSize = Object.keys(group).length;

  // Function to get group names by invoice ID
  const getGroupsByIvoiceID = (id) => {
    return Object.keys(group[parseInt(id)] || {});
  };

  // Function to get a mapping of product IDs to group names for a specific invoice ID
  const getItemsMappedToGroups = (id) => {
    const requiredInvoice = group[parseInt(id)];
    if (!requiredInvoice) return {};

    return Object.entries(requiredInvoice).reduce(
      (result, [groupName, products]) => {
        for (const [_, ids] of Object.entries(products)) {
          result[ids] = groupName;
        }
        return result;
      },
      {}
    );
  };

  // Function to get the group data with product IDs for a specific invoice ID
  const getGroupWithProductIdsByInvoiceID = (id) => {
    return group[parseInt(id)] || {};
  };

  return {
    getGroupsByIvoiceID,
    groupSize,
    getItemsMappedToGroups,
    getGroupWithProductIdsByInvoiceID,
  };
};
