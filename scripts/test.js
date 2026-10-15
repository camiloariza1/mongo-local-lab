const testDatabase = "mongo_local_lab_test";
if (db.getName() !== testDatabase) {
  throw new Error(`Refusing to run tests against ${db.getName()}`);
}

try {
  db.dropDatabase();
  load("/lab/10-seed.js");
  const check = (condition, message) => {
    if (!condition) throw new Error(`FAIL: ${message}`);
  };

  check(db.users.countDocuments() === 3, "seeded users");
  check(db.orders.countDocuments() === 4, "seeded orders");
  check(db.users.getIndexes().some((index) => index.name === "email_unique" && index.unique), "unique email index");

  let duplicateRejected = false;
  try {
    db.users.insertOne({ email: "ava.morgan@example.test" });
  } catch (error) {
    duplicateRejected = error.code === 11000;
  }
  check(duplicateRejected, "duplicate emails are rejected");

  const totals = db.orders.aggregate([
    { $match: { status: { $in: ["paid", "shipped"] } } },
    { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } }
  ]).toArray()[0];
  check(totals.count === 3 && totals.total.toString() === "128.48", "Decimal128 aggregation");

  const probe = db.smoke_probe;
  const inserted = probe.insertOne({ label: "before" });
  probe.updateOne({ _id: inserted.insertedId }, { $set: { label: "after" } });
  check(probe.findOne({ _id: inserted.insertedId }).label === "after", "CRUD update/read");
  probe.deleteOne({ _id: inserted.insertedId });
  check(probe.countDocuments() === 0, "CRUD delete");

  const session = db.getMongo().startSession();
  try {
    session.startTransaction();
    session.getDatabase(testDatabase).transaction_probe.insertOne({ outcome: "rollback" });
    session.abortTransaction();
    check(db.transaction_probe.countDocuments() === 0, "transaction rollback");

    session.startTransaction();
    session.getDatabase(testDatabase).transaction_probe.insertOne({ outcome: "commit" });
    session.commitTransaction();
    check(db.transaction_probe.countDocuments({ outcome: "commit" }) === 1, "transaction commit");
  } finally {
    session.endSession();
  }

  print("PASS: seed, CRUD, Decimal128 aggregation, unique index, transaction rollback/commit");
} finally {
  db.dropDatabase();
}
