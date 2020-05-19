exports.up = function(knex) {
    return knex.schema.createTable('users', users => {
        users.increments()
        users.text('username').notNullable().unique().index() // index() makes it easier to search through usernames
        users.text('password').notNullable()
        users.text('department').notNullable()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users')
};
