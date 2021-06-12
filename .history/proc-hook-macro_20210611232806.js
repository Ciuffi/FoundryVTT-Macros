let rolldice = args[1] //(eg 1d20), set in the DAE window
let success = args[2] //(eg 5), min roll to gain the proc

//Get the caster for later use
let p_actor = game.actors.get(args[3].actorId)
//Get the item unique identifier for later use
let itemUUID = args[3].origin;
//Check to see if we have any current hooks already placed
let currHookId = p_actor.getFlag('world', 'proc-func-id')?.id

//Callback function for the onRollDice hook
async function handleProcRolls(data) {
    //Check if attack roll
    if (data.attackRoll === undefined) return
    //Make sure its the right actor
    if (p_actor.data._id !== data.actor.data._id) return
    //Make sure we hit something
    if (!data.hitTargets || data.hitTargets.size <= 0) return

    let roll = await new Roll(rolldice).roll()
    // no proc
    if (roll.total <= success) {
        return
    }
    //Proc, build the chat message in HTML.
    let item = await fromUuid(itemUUID)
    let HTMLContent = `
            <div style="display: flex; align-items: center;">
                <img style="width: 35px; height: 35px; margin-right: 5px;" src="${item.data.img}"/>
                ${p_actor.name}'s ${item.data.name} has procced!
            </div>
        `
    ChatMessage.create({ content: HTMLContent })
}

//If the item was put on, add the hook
if (args[0] === "on") {
    //Never add the hook if we already have on active
    if (currHookId !== undefined) return
    let hookId = Hooks.on('midi-qol.RollComplete', handleProcRolls)
    //Save hookID for later
    p_actor.setFlag('world', 'proc-func-id', { id: hookId })
}
//If the item was taken off, remove the hook
if (args[0] === "off") {
    //If we have no hook idea, nothing we can do
    if (currHookId === undefined) return
    Hooks.off('midi-qol.RollComplete', currHookId)
    //Unsave the hookId since the hook was removed
    p_actor.setFlag('world', 'proc-func-id', null)
}