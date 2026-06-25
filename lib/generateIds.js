import Counter from "../models/Counter";

async function nextNumber(name) {

  const counter =
    await Counter.findOneAndUpdate(
      { name },
      { $inc: { value: 1 } },
    {
      returnDocument: "after",
      upsert: true,
    }
    );

  return counter.value;
}

export async function generateCustomerId() {

  const num =
    await nextNumber("customer");

  return `CUS${String(num).padStart(6, "0")}`;
}

export async function generateOrderId() {

  const num =
    await nextNumber("order");

  return `ORD${String(num).padStart(6, "0")}`;
}

export async function generateInvoiceId() {

  const num =
    await nextNumber("invoice");

  return `INV${String(num).padStart(6, "0")}`;
}