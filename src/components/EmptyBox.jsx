import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

// Component to display a message when there are no items to show
export default function EmptyBox() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{ height: "100vh" }}
    >
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKLjXZjT11b7Gc8amoq844ElbeayCWr_EzVg&s"
        alt="Empty"
        className="img-fluid mb-4 shadow-lg rounded-lg"
        style={{ maxWidth: "250px" }}
      />
      <h2 className="text-muted">No Items!</h2>
      <Link to="/">Go back Home</Link>
    </div>
  );
}
