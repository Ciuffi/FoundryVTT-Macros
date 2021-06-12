const p_actor = game.actors.get(actor._id)

const itemData = game.items.find((x => x.data.name.startsWith("Felfire Bomb"))).data

await p_actor.createOwnedItem(itemData)
ui.notifications.notify("A Felfire Bomb appears in your inventory")