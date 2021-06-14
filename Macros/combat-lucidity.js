const theContent = `
    <div style="height: 400px;">
        <div>
            <button id="lucidity_button">Roll Lucidity</button>
        </div>
        <div id="spellDiv" style="margin: 10px auto; display: none; justify-content: center; align-items: center;">
            <h3>Spell</h3>
            <button id="lucidSpell">Roll Spell</button>
            <h4 style="font-size: 18px; margin-top: 5px; text-align: center;" id="spellResult">You're casting...</h4>
        </div>
        <div id="targetDiv" style="margin: 10px auto; display: none; justify-content: center; align-items: center;">
            <h3>Target</h3>
            <button id="lucidTarget">Roll Target</button>
            <h4 style="font-size: 18px; margin-top: 5px; text-align: center;" id="targetResult">You're targetting...</h4>
        </div>
        <div id="moveDiv" style="margin: 10px auto; display: none; justify-content: center; align-items: center;">
            <h3>Movement</h3>
            <button id="lucidMove">Roll Movement</button>
            <h4 style="font-size: 18px; margin-top: 5px; text-align: center;" id="moveResult">You're moving...</h4>
        </div>
        <div style="margin: 30px auto; display: none; justify-content: center; align-items: center;" id="lucidityResultDiv">
            <h2 id="lucidityResult">Result</h2>
        </div>
        <div style="position: absolute; bottom: 60px; width: 95%; text-align: center;">
            <button style="width: 50%" id="rollall_button">Roll All</button>
        </div>
        <div id="lucidEffect" style="display: none;"></div>
    </div>
    `
let currEffect;
let message;
const hideAllDivs = (html) => {
    html.find("div#moveDiv")[0].style.display = "none"
    html.find("div#targetDiv")[0].style.display = "none"
    html.find("div#spellDiv")[0].style.display = "none"
    html.find("div#lucidityResultDiv")[0].style.display = "none"
    message = "<div>"
    currEffect = undefined;
}

const showResult = async (html, res) => {
    html.find("h2#lucidityResult")[0].innerText = res
    html.find("div#lucidityResultDiv")[0].style.display = "flex"
    message += "Full Control\n"
}

const showMovement = (html) => {
    html.find("div#moveDiv")[0].style.display = "block"
}

const showTargetDiv = (html) => {
    html.find("div#targetDiv")[0].style.display = "block"
}

const showSpellDiv = (html) => {
    html.find("div#spellDiv")[0].style.display = "block"
}

const showRolls = async (html, effect) => {
    html.find("div#lucidEffect")[0].innerText = effect
    switch (effect) {
        case "Lucid":
            showResult(html, "Double the spells, no slots. Fire Away.")
            break;
        case "Smart":
            showResult(html, "Full Control")
            break;
        case "Average":
            showSpellDiv(html)
            break;
        case "below average":
            showSpellDiv(html)
            showTargetDiv(html)
            break;
        case "Dumb":
        case "CHAOTIC":
        default:
            showMovement(html)
            showTargetDiv(html)
            showSpellDiv(html)
            break;
    }
}

const rollAll = async (html, ele) => {

    ele.innerText = `Rolling..`

    let lucidButton = html.find('button#lucidity_button')[0]
    let moveButton = html.find('button#lucidMove')[0]
    let targetButton = html.find('button#lucidTarget')[0]
    let spellButton = html.find('button#lucidSpell')[0]

    let res = await RollLucidity(html, lucidButton)
    switch (res.effect) {
        case "Lucid":
        case "Smart":
            break;
        case "Average":
            rollSpell(html, spellButton)
            break;
        case "below average":
            rollSpell(html, spellButton)
            rollTarget(html, targetButton)
            break;
        case "Dumb":
        case "CHAOTIC":
        default:
            rollMovement(html, moveButton)
            rollTarget(html, targetButton)
            rollSpell(html, spellButton)
            break;
    }
    ele.innerText = `Reroll`

}

const RollLucidity = async (html, ele) => {
    hideAllDivs(html)
    let m = game.macros.getName("Lucidity").data.command
    let res = await eval(m)
    currEffect = res.effect
    ele.innerText = `Rolled a ${res.roll}. You feel ${res.effect}...`
    message += `Rolled a ${res.roll}. You feel ${res.effect}<br/>`
    showRolls(html, res.effect)
    return res
}

const rollMovement = async (html, ele) => {
    const r = await new Roll('1d8').roll()
    await r.toMessage(null, { rollMode: 'gmroll' })
    let result;
    switch (r.total) {
        case 1:
            result = 'North';
            break;
        case 2:
            result = 'North East';
            break;
        case 3:
            result = 'East'
            break;
        case 4:
            result = 'South East'
            break;
        case 5:
            result = "South"
            break;
        case 6:
            result = "South West"
            break;
        case 7:
            result = "West"
            break;
        case 8:
            result = "North West"
            break;
    }
    html.find("h4#moveResult")[0].innerText = `You're moving... ${result}`
    ele.innerText = `Rolled a ${r.total}. You're moving ${result}`
    message += `Rolled a ${r.total}. You're moving ${result}<br/>`
}

const rollTarget = async (html, ele) => {
    let targets = game.combat.data.combatants.map(c => c.actor.name)
    let targetSize = targets.length;
    const r = await new Roll(`1d${targetSize}`).roll()
    await r.toMessage(null, { rollMode: 'gmroll' })
    let result = targets[r.total - 1]
    html.find("h4#targetResult")[0].innerText = `You're targetting... ${result}`
    ele.innerText = `Rolled a ${r.total}. You're targetting ${result}`
    message += `Rolled a ${r.total}. You're targetting ${result}<br/>`
}

const rollSpell = async (html, ele) => {
    let maxlevel = 0;
    let minlevel = 0;
    switch (currEffect) {
        case "Lucid":
        case "Smart":
            maxlevel = 10;
            break;
        case "Average":
            maxlevel = 2;
            break;
        case "below average":
            maxlevel = 1;
        case "dumb":
            maxlevel = 0;
            break;
        case "CHAOTIC":
            maxlevel = 10;
            minlevel = 3;
            break;
        default:
            maxlevel = 0;
            break;
    }
    let spells = actor.items
        .filter(i => i.data.type === "spell" &&
            i.data.data.level <= maxlevel &&
            i.data.data.level >= minlevel)
        .map(i => i.data.name)
    let spellSize = spells.length;
    const r = await new Roll(`1d${spellSize}`).roll()
    await r.toMessage(null, { rollMode: 'gmroll' })
    let result = spells[r.total - 1]
    html.find("h4#spellResult")[0].innerText = `You're casting... ${result}`
    ele.innerText = `Rolled a ${r.total}. You're casting ${result}`
    message += `Rolled a ${r.total}. You're casting ${result}<br/>`
}

new Dialog({
    title: "Test Dialog",
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Done",
            callback: async () => {
                //private message workaround
                let currUser = game.users.find(u => u.character?._id === actor._id)
                let gm = game.users.find(u => u.isGM)
                ChatMessage.create({ content: message, whisper: [currUser, gm] })
            }
        }
    },
    default: "one",
    content: theContent,
    render: async (html) => {
        message = "<div>"
        currEffect = undefined;
        let lucidButton = html.find('button#lucidity_button')[0]
        let moveButton = html.find('button#lucidMove')[0]
        let targetButton = html.find('button#lucidTarget')[0]
        let spellButton = html.find('button#lucidSpell')[0]
        let rollAllButton = html.find('button#rollall_button')[0]
        lucidButton.onclick = async () => RollLucidity(html, lucidButton)
        moveButton.onclick = async () => rollMovement(html, moveButton)
        targetButton.onclick = async () => rollTarget(html, targetButton)
        spellButton.onclick = async () => rollSpell(html, spellButton)
        rollAllButton.onclick = async () => rollAll(html, rollAllButton)
    }
}).render(true)
