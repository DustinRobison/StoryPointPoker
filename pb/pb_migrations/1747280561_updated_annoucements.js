/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2054683760")

  // update collection data
  unmarshal({
    "name": "announcements"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2054683760")

  // update collection data
  unmarshal({
    "name": "annoucements"
  }, collection)

  return app.save(collection)
})
