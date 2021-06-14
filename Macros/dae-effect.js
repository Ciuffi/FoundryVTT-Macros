
(async () => {//type the name of the effect in "EFFECT NAME"

    const chaotic_icon = "https://wow.zamimg.com/images/wow/icons/large/sha_ability_rogue_bloodyeye_nightmare.jpg";
    const lucid_icon = "https://static.wikia.nocookie.net/leagueoflegends/images/d/d7/Clarity.png"
    actor = game.actors.get(actor._id)

    let item = actor.items.getName("Lucid like a mad wizard")
    if (item === undefined) {
        ui.notifications.error("you do not have Lucid like a made wizard equipped.")
    }

    let effects = [
        {
            label: "CHAOTIC",
            icon: chaotic_icon,
            origin: item.uuid
        },
        {
            label: "Dumb",
            icon: chaotic_icon,
            origin: item.uuid
        },
        {
            label: "below average",
            icon: chaotic_icon,
            origin: item.uuid
        },
        {
            label: "Average",
            icon: chaotic_icon,
            origin: item.uuid
        },
        {
            label: "Smart",
            icon: chaotic_icon,
            origin: item.uuid
        },
        {
            label: "Lucid",
            icon: lucid_icon,
            origin: item.uuid
        }
    ]

    //Remove all current lucidity effects
    effects.map(e => e.label).forEach(async (e) => {
        let rmEff = actor.effects.find(el => el.data.label === e)
        if (!rmEff) return
        let rmEffId = rmEff.data._id;
        await actor.deleteEmbeddedEntity("ActiveEffect", rmEffId);
    })

    let selectedEffect;

    //1d20 to check lucidity
    let r = await new Roll('1d20').roll()

    switch (true) {
        case r.total === 1:
            selectedEffect = effects[0]
        case r.total < 5:
            selectedEffect = effects[1];
            break;
        case r.total < 10:
            selectedEffect = effects[2];
            break;
        case r.total < 15:
            selectedEffect = effects[3];
            break;
        case r.total < 20:
            selectedEffect = effects[4];
            break;
        case r.total === 20:
            selectedEffect = effects[5];
            break;
        default:
            selectedEffect = effects[1];
            break;
    }

    //DAE needs a second to update
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    await delay(1100)

    //Add new effect
    await actor.createEmbeddedEntity("ActiveEffect", selectedEffect)

    const HTMLContent = `
            <div style="margin: 5%; justify-content: center; display: flex; align-items: center;">
                <img style="width: 30px; height: 30px; margin-right: 5px;" src="${selectedEffect.icon}"/>
                you feel ${selectedEffect.label}...
            </div>
            <div class="dice-roll">
                <div class="dice-result">
                    <div class="dice-formula">1d20</div>
                    <h4 style="padding: 2.5px 5px; font-size: 15px" class="dice-total">${r.total}</h4>
                </div>
            </div>
        `
    //Show the player and the GM the roll, no one else.
    r.toMessage({ content: HTMLContent, speaker: ChatMessage.getSpeaker({ token: actor }), user: game.user.id }, { rollMode: 'gmroll' })
    return { roll: r.total, effect: selectedEffect }
})()