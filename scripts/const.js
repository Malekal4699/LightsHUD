export class lhConst {

    static predefinedColors = {
        "Candles, Torches" : "#a2642a",
        "Fire (orange)": "#7f4a14",
        "Fire (yellow)": "#a2642a",
        "Daylight (warm)" : "#b79471",
        "Daylight (cold)" : "#94a6bc",
        "Full Moonlight (warm) ": "#ab9c8c",
        "Full Moonlight (cold) ": "#647080",
        "Magical Fire / Neon Red" : "#800000",
        "Magical Fire (Blue) / Neon Blue ": "#000080",
        "Magical Fire (Green) / Neon Green" : "#008000",
        "Magical Fire (Purple) / Black Light (Purple)" : "#540080",
        "Reflective Gold ": "#f0be35",
        "Reflective Water" : "#6dcab4",
        "Magma" : "#c27a29"
    }
    
    static lightDataflatSchema = Object.entries((flattenObject(new foundry.data.LightData().schema)));


    }