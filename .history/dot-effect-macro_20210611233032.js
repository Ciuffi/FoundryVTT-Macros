if (args[0] !== "each") return

const asyncFunc = async () => {
    let targets = new Set([canvas.tokens.get(args[1])])
    let roll = new Roll('1d6')
    await roll.toMessage({
        flavor: "Poison Damage applied",
    });
    MinorQOL.applyTokenDamage([{ damage: roll.total, type: "poison" }],
        roll.total, targets, null, new Set())
}
asyncFunc()