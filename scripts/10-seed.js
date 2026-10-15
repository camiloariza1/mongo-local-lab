const users = [
  {
    _id: ObjectId("650000000000000000000001"),
    email: "ava.morgan@example.test",
    name: { first: "Ava", last: "Morgan" },
    status: "active",
    createdAt: ISODate("2026-01-12T09:30:00Z"),
    tags: ["newsletter", "early-access"]
  },
  {
    _id: ObjectId("650000000000000000000002"),
    email: "noah.chen@example.test",
    name: { first: "Noah", last: "Chen" },
    status: "active",
    createdAt: ISODate("2026-02-03T14:15:00Z"),
    tags: ["newsletter"]
  },
  {
    _id: ObjectId("650000000000000000000003"),
    email: "mia.patel@example.test",
    name: { first: "Mia", last: "Patel" },
    status: "paused",
    createdAt: ISODate("2026-03-22T08:00:00Z"),
    tags: []
  }
];

const orders = [
  { _id: ObjectId("660000000000000000000001"), userId: users[0]._id, status: "paid", items: [{ sku: "MUG-01", quantity: 2, unitPrice: Decimal128("9.99") }], total: Decimal128("19.98"), createdAt: ISODate("2026-04-01T10:00:00Z") },
  { _id: ObjectId("660000000000000000000002"), userId: users[0]._id, status: "shipped", items: [{ sku: "BAG-02", quantity: 1, unitPrice: Decimal128("79.50") }], total: Decimal128("79.50"), createdAt: ISODate("2026-04-02T11:30:00Z") },
  { _id: ObjectId("660000000000000000000003"), userId: users[1]._id, status: "paid", items: [{ sku: "BOOK-03", quantity: 1, unitPrice: Decimal128("24.00") }, { sku: "PEN-01", quantity: 2, unitPrice: Decimal128("2.50") }], total: Decimal128("29.00"), createdAt: ISODate("2026-04-04T16:45:00Z") },
  { _id: ObjectId("660000000000000000000004"), userId: users[2]._id, status: "cancelled", items: [{ sku: "CASE-04", quantity: 1, unitPrice: Decimal128("14.95") }], total: Decimal128("14.95"), createdAt: ISODate("2026-04-08T07:20:00Z") }
];

db.users.createIndex({ email: 1 }, { unique: true, name: "email_unique" });
db.users.insertMany(users);
db.orders.createIndex({ userId: 1, createdAt: -1 }, { name: "user_orders_recent" });
db.orders.insertMany(orders);
