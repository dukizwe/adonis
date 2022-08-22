import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
          protected tableName = 'posts'

          public async up() {
                    this.schema.alterTable(this.tableName, (table) => {
                              table.integer('user_id')
                                        .unsigned()
                                        .references('users.id')
                                        .onDelete('SET NULL')
                                        .onUpdate('CASCADE')
                                        .nullable()
                    })
          }

          public async down() {
                    this.schema.alterTable(this.tableName, (table) => {
                              table.dropColumn('category_id')
                    })
          }
}
