/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3914114510")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_u8VZLXeh8z` ON `donators` (`user`)",
      "CREATE INDEX `idx_UEOWE0wMj8` ON `donators` (`stripeId`)"
    ]
  }, collection)

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3277192334",
    "max": 0,
    "min": 0,
    "name": "stripeId",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3914114510")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_u8VZLXeh8z` ON `donators` (`user`)"
    ]
  }, collection)

  // remove field
  collection.fields.removeById("text3277192334")

  return app.save(collection)
})
