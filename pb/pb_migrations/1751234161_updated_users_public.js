/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3409774286")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_fnTIb3IV5N` ON `users_public` (`user`)",
      "CREATE INDEX `idx_8nYH7lqque` ON `users_public` (`room`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3409774286")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_fnTIb3IV5N` ON `users_public` (`user`)"
    ]
  }, collection)

  return app.save(collection)
})
