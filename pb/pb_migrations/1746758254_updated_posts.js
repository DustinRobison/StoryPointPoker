/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1125843985")

  // remove field
  collection.fields.removeById("number1237995133")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1125843985")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number1237995133",
    "max": null,
    "min": 0,
    "name": "likes",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
