actor = game.actors.get(actor._id)

let r1 = await new Roll('1d20').roll()
let r2 = await new Roll('1d20').roll()
await r1.toMessage(null, { rollMode: 'gmroll' })
await r2.toMessage(null, { rollMode: 'gmroll' })
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
await delay(2500)
ui.notifications.info("Your dice have been added to your secondary resource (whispers)")
actor.update({
    'data.resources.secondary': {
        value: r1.total,
        max: r2.total,
        lr: false,
        sr: false
    }
})