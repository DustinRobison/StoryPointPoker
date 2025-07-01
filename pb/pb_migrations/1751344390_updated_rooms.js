/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3085411453")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_0erJf20y8X` ON `rooms` (`name`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3085411453")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_sK9QKGBsQR` ON `rooms` (`name`)",
      "CREATE UNIQUE INDEX `idx_0erJf20y8X` ON `rooms` (`name`)"
    ]
  }, collection)

  return app.save(collection)
})
