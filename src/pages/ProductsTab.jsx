import React from "react";
import { useProducts } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { IoEllipsisVertical } from "react-icons/io5";
import { TiDocument } from "react-icons/ti";
import EmptyBox from "../components/EmptyBox";
import { BiTrash } from "react-icons/bi";
import EditableField from "../components/EditableField";
import { deleteProduct, updateProducts } from "../redux/productSlice";

export default function Products() {
  // Fetch products data and size from the custom hook
  const { productsSize, products } = useProducts();
  
  // Display an empty box if there are no products
  if (productsSize === 0) return <EmptyBox />;
  
  return (
    <div className="table-responsive">
      <h1 className="text-center">Products List</h1>
      <table className="table mt-4">
        <thead className="thead-light">
          <tr>
            <th scope="col" className="text-center">Item Id</th>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Price</th>
            <th scope="col">Quantity</th>
            <th scope="col">More</th>
          </tr>
        </thead>
        <tbody>
          {/* Render a row for each product */}
          {products.map((item, i) => {
            return (
              <ProductRow
                key={item.itemId}
                name={item.itemName}
                description={item.itemDescription}
                price={item.itemPrice}
                id={item.itemId}
                quantity={item.itemQuantity}
                productIdx={i}
                invoices={item.invoices}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Component to render a single product row
function ProductRow({
  name,
  description,
  price,
  quantity,
  id,
  productIdx,
  invoices,
}) {
  const dispatch = useDispatch();
  const { products } = useProducts();

  // Function to handle product updates
  const editProduct = (e) => {
    dispatch(
      updateProducts({
        items: [{ ...products[productIdx], [e.target.name]: e.target.value }],
      })
    );
  };

  return (
    <tr>
      <td className="text-center p-0 align-middle">{id}</td>
      <td>
        <EditableField
          onItemizedItemEdit={editProduct}
          cellData={{
            type: "text",
            name: "itemName",
            placeholder: "Item name",
            value: name,
            id: id,
          }}
        />
      </td>
      <td>
        <EditableField
          onItemizedItemEdit={editProduct}
          cellData={{
            type: "text",
            name: "itemDescription",
            placeholder: "Item description",
            value: description,
            id: id,
          }}
        />
      </td>
      <td style={{ width: "8rem" }}>
        <EditableField
          onItemizedItemEdit={editProduct}
          cellData={{
            type: "number",
            name: "itemPrice",
            min: 1,
            step: "0.01",
            presicion: 2,
            value: price,
            id: id,
          }}
        />
      </td>
      <td style={{ width: "8rem" }}>
        <EditableField
          onItemizedItemEdit={editProduct}
          cellData={{
            type: "number",
            name: "itemQuantity",
            value: quantity,
            id: id,
          }}
        />
      </td>
      <td>
        <ContextMenu itemId={id} invoices={invoices} />
      </td>
    </tr>
  );
}

// Component for the context menu with actions for each product
function ContextMenu({ itemId, invoices }) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="position-relative">
      <button
        className="btn btn-light p-0 border-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoEllipsisVertical />
      </button>
      {isOpen && (
        <div
          className="position-absolute bg-white border rounded shadow mt-2"
          style={{ right: 0, zIndex: 10 }}
        >
          {/* View invoices action */}
          <button
            onClick={() => {
              alert(
                `The item ${itemId} is used in invoices - ${invoices.join(",")}`
              );
              setIsOpen(false);
            }}
            className="dropdown-item d-flex justify-content-between align-items-center"
          >
            View Invoices <TiDocument size="20px" className="text-primary" />
          </button>
          {/* Delete product action */}
          <button
            onClick={() => {
              dispatch(deleteProduct(itemId));
              setIsOpen(false);
            }}
            className="dropdown-item d-flex justify-content-between align-items-center"
          >
            Delete <BiTrash size="20px" className="text-danger" />
          </button>
        </div>
      )}
    </div>
  );
}
