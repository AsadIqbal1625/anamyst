/* Customer details rules, shared by the checkout page and the order API.
   The browser must run this BEFORE opening Razorpay: once money has been
   taken, it is too late to tell the customer their pincode is wrong. */

function clean(value, max) {
  return String(value ?? "").replace(/[<>]/g, "").trim().slice(0, max);
}

export function validateCheckoutDetails(raw) {

  const details = {
    customerName: clean(raw.customerName, 80),
    email: clean(raw.email, 100).toLowerCase(),
    phone: clean(raw.phone, 15),
    address: clean(raw.address, 300),
    city: clean(raw.city, 60),
    state: clean(raw.state, 60),
    pincode: clean(raw.pincode, 10).replace(/\D/g, ""),
  };

  let error = "";

  if (details.customerName.length < 2) {
    error = "Please enter your full name";
  } else if (
    /* commas/semicolons blocked: "a@x.com,b@y.com" must not become a
       way to send our order email to several strangers at once */
    !/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(details.email)
  ) {
    error = "Please enter a valid email address";
  } else if (!/^[0-9+\-\s()]{10,15}$/.test(details.phone)) {
    error = "Please enter a valid phone number";
  } else if (
    details.address.length < 5 ||
    !details.city ||
    !details.state
  ) {
    error = "Please enter your complete address";
  } else if (!/^\d{6}$/.test(details.pincode)) {
    error = "Please enter a valid 6-digit pincode";
  }

  return { details, error };

}
