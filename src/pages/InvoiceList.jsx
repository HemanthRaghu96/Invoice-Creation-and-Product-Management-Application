import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BiSolidPencil, BiTrash } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import InvoiceModal from "../components/InvoiceModal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteInvoice } from "../redux/invoicesSlice";
import { useProducts, useInvoiceListData } from "../redux/hooks";
import { deleteInvoicesFromProduct } from "../redux/productSlice";
import { updateInvoiceTotal } from "../redux/invoicesSlice";
import { removeGroupByInvoiceID } from "../redux/groupSlice";

const InvoiceList = () => {
  const { invoiceList, getOneInvoice } = useInvoiceListData();
  const isListEmpty = invoiceList.length === 0;
  const [copyId, setCopyId] = useState("");
  const navigate = useNavigate();

  // Handle the Copy Invoice button click
  const handleCopyClick = () => {
    const invoice = getOneInvoice(copyId);
    if (!invoice) {
      alert("Please enter a valid invoice ID.");
    } else {
      navigate(`/create/${copyId}`);
    }
  };

  return (
    <Row>
      <Col className="mx-auto" xs={12} md={8} lg={9}>
        <h3 className="fw-bold pb-2 pb-md-4 text-center">Swipe Assignment</h3>
        <Card className="d-flex p-3 p-md-4 my-3 my-md-4 ">
          {isListEmpty ? (
            // If there are no invoices, show a message and options to create an invoice or view products
            <div className="d-flex flex-column align-items-center">
              <h3 className="fw-bold pb-2 pb-md-4">No invoices present</h3>
              <div className="d-flex flex-column flex-lg-row gap-3 mx-auto">
                <Link to="/create">
                  <Button variant="primary">Create Invoice</Button>
                </Link>
                <ProductLink />
              </div>
            </div>
          ) : (
            // If there are invoices, display them in a table
            <div className="d-flex flex-column">
              <div className="d-flex flex-row align-items-center justify-content-between">
                <h3 className="fw-bold pb-2 pb-md-4">Invoice List</h3>
                <Link to="/create">
                  <Button variant="primary mb-2 mb-md-4">Create Invoice</Button>
                </Link>

                <ProductLink />

                <div className="d-flex gap-2">
                  <Button variant="dark mb-2 mb-md-4" onClick={handleCopyClick}>
                    Copy Invoice
                  </Button>

                  <input
                    type="text"
                    value={copyId}
                    onChange={(e) => setCopyId(e.target.value)}
                    placeholder="Enter Invoice ID to copy"
                    className="bg-white border"
                    style={{
                      height: "50px",
                    }}
                  />
                </div>
              </div>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Invoice No.</th>
                    <th>Bill To</th>
                    <th>Due Date</th>
                    <th>Total Amt.</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Render each invoice in a row */}
                  {invoiceList.map((invoice) => (
                    <InvoiceRow
                      key={invoice.id}
                      invoice={invoice}
                      navigate={navigate}
                    />
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

// Component to render a single invoice row
const InvoiceRow = ({ invoice, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { productsSize, getItemsByInvoiceId } = useProducts();

  // Update the invoice total when products or invoices change
  useEffect(() => {
    dispatch(updateInvoiceTotal({
      items: getItemsByInvoiceId(invoice.id),
      invoiceID: parseInt(invoice.id),
    }));
  }, [productsSize]);

  // Handle delete action for an invoice
  const handleDeleteClick = (invoiceId) => {
    const deletedItems = getItemsByInvoiceId(invoiceId).map(item => item.itemId);
    dispatch(deleteInvoice(invoiceId));
    dispatch(deleteInvoicesFromProduct({ itemsIds: deletedItems, invoiceId: parseInt(invoiceId) }));
    dispatch(removeGroupByInvoiceID(invoiceId));
  };

  // Navigate to the edit page for the invoice
  const handleEditClick = () => {
    navigate(`/edit/${invoice.id}`);
  };

  // Open and close the modal
  const openModal = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <tr>
      <td>{invoice.invoiceNumber}</td>
      <td className="fw-normal">{invoice.billTo}</td>
      <td className="fw-normal">{invoice.dateOfIssue}</td>
      <td className="fw-normal">
        {invoice.currency}
        {invoice.total}
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="outline-primary" onClick={handleEditClick}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiSolidPencil />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="danger" onClick={() => handleDeleteClick(invoice.id)}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiTrash />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="secondary" onClick={openModal}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BsEyeFill />
          </div>
        </Button>
      </td>
      {/* InvoiceModal component to show invoice details */}
      <InvoiceModal
        showModal={isOpen}
        closeModal={closeModal}
        info={{
          isOpen,
          id: invoice.id,
          currency: invoice.currency,
          currentDate: invoice.currentDate,
          invoiceNumber: invoice.invoiceNumber,
          dateOfIssue: invoice.dateOfIssue,
          billTo: invoice.billTo,
          billToEmail: invoice.billToEmail,
          billToAddress: invoice.billToAddress,
          billFrom: invoice.billFrom,
          billFromEmail: invoice.billFromEmail,
          billFromAddress: invoice.billFromAddress,
          notes: invoice.notes,
          total: invoice.total,
          subTotal: invoice.subTotal,
          taxRate: invoice.taxRate,
          taxAmount: invoice.taxAmount,
          discountRate: invoice.discountRate,
          discountAmount: invoice.discountAmount,
        }}
        items={getItemsByInvoiceId(invoice.id)}
        currency={invoice.currency}
        subTotal={invoice.subTotal}
        taxAmount={invoice.taxAmount}
        discountAmount={invoice.discountAmount}
        total={invoice.total}
      />
    </tr>
  );
};

// Component to provide a link to the products page
const ProductLink = () => {
  return (
    <Link to="/products">
      <Button variant="primary mb-2 mb-md-4">View Products</Button>
    </Link>
  );
};

export default InvoiceList;
