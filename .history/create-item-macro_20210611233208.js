//DAE Macro Execute, Effect Value = "Macro Name" @target @item.level

const lastArg = args[args.length - 1];
const tactor = game.actors.get(lastArg.actorId);

const itemData = game.items.find((x => x.data.name.startsWith("Felfire Bomb"))).data

/**
 * Create Flame Blade item in inventory
 */
if (args[0] === "on") {
  await tactor.createOwnedItem(itemData);
  ui.notifications.notify("A Felfire Bomb appears in your inventory")
}