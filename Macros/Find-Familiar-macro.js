if (canvas.tokens.controlled.length == 0 || canvas.tokens.controlled.length > 1) {
    ui.notifications.error("Please select a single token.");
    return;
}
let selectedActor = canvas.tokens.controlled[0].actor;

let findFamiliar = selectedActor.items.find(item => item.data.name == "Find Familiar")
if (findFamiliar == null || findFamiliar == undefined) {
    ui.notifications.error(`Sorry ${selectedActor.data.name}, but you don't have the find familiar spell. Get bent.`);
    return;
}

const playerName = selectedActor.data.name;
const playerToken = canvas.tokens.placeables.find(
    i => i.name === playerName
);
const playerX = playerToken.data.x;
const playerY = playerToken.data.y;

let conjureTarget = game.actors.getName("Lizard")

let x = []

const permissions = game.actors.filter(a => {
    const perm = a.data.permission[game.userId];
    return perm !== undefined && perm === 3
})

const inactive = permissions.filter(a => {
    let exists = game.scenes.current.tokens.some(t => {
        return t.data.actorId === a.id
    })
    return !exists
})

const dialogContent = inactive.map(a => {
    return `<option value="${a.name}">${a.name}</option>`
})

let summonCreature = false;
new Dialog({
    title: `Choose a familiar`,
    content: `
        <form>
        <div class="form-group">
        <label>Familiar:</label>
        <select id="familiar-type" name="familiar-type">
        ${dialogContent}
        </select>
        </div>
        </form>`,
    buttons: {
        summon: {
            icon: "<i class='fas fa-check'></i>",
            label: `Summon`,
            callback: () => summonCreature = true
        },
        cancelOut: {
            icon: "<i class='fas fa-times'></i>",
            label: `Cancel`
        },
    },
    default: "summon",
    close: html => {
        if (summonCreature) {
            let FamiliarType = html.find('[name="familiar-type"]')[0].value || "none";
            conjureTarget = game.actors.getName(FamiliarType);
            let updateToken = duplicate(conjureTarget.data.token);
            delete updateToken._id;
            updateToken.x = playerX + 65;
            updateToken.y = playerY;
            updateToken.bar1 = { attribute: "attributes.hp" };
            updateToken.bar2 = { attribute: "attributes.ac.value" };
            updateToken.displayName = 20;
            updateToken.displayBars = 20;
            game.scenes.current.createEmbeddedDocuments(Token.embeddedName, [updateToken])
        }
    }
}).render(true)
