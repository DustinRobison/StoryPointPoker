/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3409774286")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "date1566582015",
    "max": "",
    "min": "",
    "name": "voteTime",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3409774286")

  // remove field
  collection.fields.removeById("date1566582015")

  return app.save(collection)
})
