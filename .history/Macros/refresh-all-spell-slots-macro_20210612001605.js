const p_actor = game.actors.get(actor._id);

const updateObj = new Object()

Object.entries(p_actor.data.data.spells).forEach(([key, val]) => {
    if (val.max !== 0) {
        val.value = val.max
        updateObj[key] = val
    }
})

p_actor.update(updateObj)
ui.notifications.info("You feel empowered and refreshed.")