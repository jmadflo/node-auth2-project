const db = require("../../database/dbConfig")

module.exports = {
  add,
  find,
  findBy,
  findById,
}

function find() {
  return db("users as u")
    .select("u.id", "u.username", "u.department")
    .orderBy("u.id")
}

function findBy(filter) {
  console.log("filter", filter)
  return db("users")
    .where(filter)
    .orderBy("users.id")
}

async function add(user) {
  try {
    const [id] = await db("users").insert(user, "id")

    return findById(id)
  } catch (error) {
    throw error
  }
}

function findById(id) {
  return db("users").where({ id }).first()
}