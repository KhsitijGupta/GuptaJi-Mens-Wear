module.exports.emailHTMLGenerator = (cart, user, address, order) => {
  const productRows = cart.items
    .map(
      (i) => `
      <tr>
        <td style="border-bottom:1px solid #e5e7eb;padding:12px 8px;font-size:14px;color:#374151;">
          ${i.name}
        </td>
        <td align="center" style="border-bottom:1px solid #e5e7eb;padding:12px 8px;font-size:14px;color:#374151;">
          ${i.quantity}
        </td>
        <td align="right" style="border-bottom:1px solid #e5e7eb;padding:12px 8px;font-size:14px;color:#374151;">
          ₹${i.price}
        </td>
        <td align="right" style="border-bottom:1px solid #e5e7eb;padding:12px 8px;font-size:14px;font-weight:600;color:#1f2937;">
          ₹${i.price * i.quantity}
        </td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Order - ${order.coId}</title>
</head>

<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 10px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">

          <!-- HEADER -->
          <tr>
            <td style="padding:24px;background:#4f46e5;color:#ffffff;text-align:center;">
              <h1 style="margin:0;font-size:24px;">Order Confirmed</h1>
              <p style="margin:6px 0 0;">Order ID: <strong>${
                order.coId
              }</strong></p>
            </td>
          </tr>

          <!-- CUSTOMER INFO -->
          <tr>
            <td style="padding:20px;">
              <h3 style="margin:0 0 10px;">Customer Details</h3>
              <p style="margin:4px 0;"><strong>Name:</strong> ${
                user.fullName
              }</p>
              <p style="margin:4px 0;"><strong>Email:</strong> ${user.email}</p>
            </td>
          </tr>

          <!-- PRODUCTS -->
          <tr>
            <td style="padding:20px;">
              <h3 style="margin-bottom:12px;">Order Items (${
                cart.items.length
              })</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <thead>
                  <tr style="background:#e5e7eb;">
                    <th align="left" style="padding:8px;">Product</th>
                    <th align="center" style="padding:8px;">Qty</th>
                    <th align="right" style="padding:8px;">Price</th>
                    <th align="right" style="padding:8px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${productRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- SHIPPING -->
          <tr>
            <td style="padding:20px;">
              <h3 style="margin-bottom:8px;">Shipping Address</h3>
              <p style="margin:0;font-size:14px;line-height:1.5;">
                <strong>${address.name}</strong><br/>
                ${address.landmark}, ${address.addressLine2 || ""}<br/>
                ${address.city}, ${address.state} - ${address.pincode}<br/>
                Phone: ${address.phone}
              </p>
            </td>
          </tr>

          <!-- SUMMARY -->
          <tr>
            <td style="padding:20px;background:#f8fafc;">
              <h3 style="margin-bottom:10px;">Order Summary</h3>
              <table width="100%" cellpadding="6" cellspacing="0">
                <tr>
                  <td>Subtotal</td>
                  <td align="right">₹${order.totalAmount}</td>
                </tr>
                <tr>
                  <td>Coins Used</td>
                  <td align="right">-${order.coinsUsed}</td>
                </tr>
                <tr>
                  <td><strong>Payable Amount</strong></td>
                  <td align="right"><strong>₹${
                    order.payableAmount
                  }</strong></td>
                </tr>
                <tr>
                  <td>Payment Method</td>
                  <td align="right">${order.paymentMethod}</td>
                </tr>
                <tr>
                  <td>Coins Earned</td>
                  <td align="right">+${order.coinsEarned}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:20px;text-align:center;font-size:13px;color:#6b7280;">
              Thanks for shopping with us.<br/>
              © ${new Date().getFullYear()} ZK Online Services
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;
};
