if (args[0] !== "each") return

console.log(args)
const asyncFunc = async () => {
    let targets = new Set([canvas.tokens.get(args[1])])
    let roll = new Roll('1d6')
    await roll.toMessage({
        flavor: "Poison Damage applied",
    });
    console.log(targets)
    const totalDamage = roll.total
    console.log("Damage: " + totalDamage)
    const damageDetail = { damage: roll.total, type: "poison" }
    MinorQOL.applyTokenDamage([{ damage: roll.total, type: "poison" }], roll.total, targets, null, new Set())
}
asyncFunc()