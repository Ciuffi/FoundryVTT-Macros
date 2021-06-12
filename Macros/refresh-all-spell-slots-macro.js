const lastArg = args[args.length - 1];
const tactor = game.actors.get(lastArg.actor._id);

const updateObj = new Object()

Object.entries(tactor.data.data.spells).forEach(([key, val]) => {
    if (val.max !== 0) {
        val.value = val.max
        updateObj[key] = val
    }
})

tactor.update(updateObj)
ui.notifications.info("You feel empowered and refreshed.")