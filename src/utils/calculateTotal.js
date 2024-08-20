export default function calculateTotal(items, taxRate, discountRate) {
  let subTotal = 0;

  // Calculate the subtotal by summing up the price of each item multiplied by its quantity
  items.forEach((item) => {
    subTotal += parseFloat(item.itemPrice) * parseInt(item.itemQuantity);
  });

  // Calculate tax amount based on the subtotal and tax rate
  const taxAmount = parseFloat(subTotal * (taxRate / 100)).toFixed(2);

  // Calculate discount amount based on the subtotal and discount rate
  const discountAmount = parseFloat(subTotal * (discountRate / 100)).toFixed(2);

  // Calculate the total cost: subtotal - discount + tax
  const total = (
    subTotal -
    parseFloat(discountAmount) +
    parseFloat(taxAmount)
  ).toFixed(2);

  return {
    // Return formatted amounts
    subTotal: parseFloat(subTotal).toFixed(2),
    taxAmount,
    discountAmount,
    total,
  };
}
