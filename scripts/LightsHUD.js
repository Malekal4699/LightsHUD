import { LightDataExt } from "./LightDataExt.js";
import { tokenInformations } from "./tokenInformations.js";
import { lhConst } from "./const.js";

class LightsHUD {



  static clBanner() {
    const title =
      " _     _       _     _       _   _ _   _ ____   \n" +
      "| |   (_) __ _| |__ | |_ ___| | | | | | |  _ \\  \n" +
      "| |   | |/ _` | '_ \\| __/ __| |_| | | | | | | | \n" +
      "| |___| | (_| | | | | |_\\__ \\  _  | |_| | |_| | \n" +
      "|_____|_|\\__, |_| |_|\\__|___/_| |_|\\___/|____/  \n" +
      "         |___/                                 \n";
    console.log("%c" + title, "color:orange");
  }

  static async addLightsHUDButtons(app, html, data) {

    let tokenInfoObject = app.object.data;
    let tokenInfo = new tokenInformations(tokenInfoObject);

    // Define all three buttons
    const tbuttonLight = $(
      `<div class="control-icon LightsHUD lightSpell" title="Toggle Light Spell"><i class="fas fa-sun"></i></div>`
    );
    const tbuttonLantern = $(
      `<div class="control-icon LightsHUD lantern" title="Toggle Lantern"><i class="fas fa-lightbulb"></i></div>`
    );
    const tbuttonTorch = $(
      `<div class="control-icon LightsHUD torch" title="Toggle Torch"><i class="fas fa-fire"></i></div>`
    );

    // Get the position of the column
    const position = game.settings.get("LightsHUD", "position");

    let tokenD = app.object.document;

    const hasTopBar = !!tokenD.getBarAttribute('bar2');
    const hasBottomBar = !!tokenD.getBarAttribute('bar1');

    // Create the column
    const buttonsdiv = $(`<div class="col LightsHUD-column-${position} LightsHUD-height-${tokenD.data.height?.toString().replaceAll(".", "_")}${hasTopBar ? ' LightsHUD-top-attr' : ''}${hasBottomBar ? ' LightsHUD-bottom-attr' : ''}"></div>`);

    // Wrap the previous icons
    let newdiv = '<div class="LightsHUD-container"></div>';
    html.find(".col.left").before(newdiv);

    // Add the column
    html.find(".LightsHUD-container").prepend(buttonsdiv);

    // Get the status of the three types of lights

    let spellLight = new LightDataExt("light", "spell", false, app);
    let lanternLight = new LightDataExt("lantern", "consumable", false, app);
    let torchLight = new LightDataExt("torch", "consumable", false, app);



    let hasInventoryCheck = game.settings.get("LightsHUD", "checkAvailability");
    let consumptionCheck = game.settings.get("LightsHUD", "consumeItem");

    // Initial button state when the HUD comes up
    if (spellLight.state) tbuttonLight.addClass("active");
    if (lanternLight.state) tbuttonLantern.addClass("active");
    if (torchLight.state) tbuttonTorch.addClass("active");
    // Check the permissions to manage the lights

    if (!data.isGM && !game.settings.get("LightsHUD", "playerActivation")) {
      disableLightsHUDButton(tbuttonLight);
      disableLightsHUDButton(tbuttonLantern);
      disableLightsHUDButton(tbuttonTorch);
      return;
    }
    // If the a specific light is on, enable only that light otherwise enable all three of them
    if (spellLight.state) {
      enableLightsHUDButton(tbuttonLight);
      disableLightsHUDButton(tbuttonLantern);
      disableLightsHUDButton(tbuttonTorch);
    } else if (lanternLight.state) {
      disableLightsHUDButton(tbuttonLight);
      enableLightsHUDButton(tbuttonLantern);
      disableLightsHUDButton(tbuttonTorch);
    } else if (torchLight.state) {
      disableLightsHUDButton(tbuttonLight);
      disableLightsHUDButton(tbuttonLantern);
      enableLightsHUDButton(tbuttonTorch);
    } else enableButtonsPerSettings();



    // Returns true if the character can use the Light spell
    // This also returns true if the game system is not D&D 5e...
    function canCastLight(name) {
      let actor = game.actors.get(data.actorId);
      if (actor === undefined) return false;
      let hasLight = false;

      actor.data.items.forEach((item) => {
        if (item.type === "spell") {
          if (item.name.toLowerCase() === name) hasLight = true;
        }
      });
      return hasLight;
    }

    // Returns true if the character has a specific item in his inventory
    // This also returns true if the game system is not D&D 5e...
    function hasItem(itemToCheck) {
      let consumables;

      if (game.system.id === "dnd5e") {
        consumables = tokenInfo.itemList.filter((item) => ((item.type === "consumable") && (item.name.toLowerCase() === itemToCheck.toLowerCase()) && (item.data.quantity > 0)) ?? false);
      }
      if (game.system.id === "pf2e") {
        consumables = tokenInfo.itemList.filter((item) => (item.type === "consumable" && item.name.toLowerCase() === itemToCheck.toLowerCase() && item.data.quantity.value > 0) ?? false);
      }
      if (!consumables) return false;

      return consumables.length > 0 ? consumables : false;
    }

    async function consumeItem(item) {

      if (!item) return;
      try {
        let itemID = item[0]._id;
        let newQte;
        if (game.system.id === "dnd5e") {
          newQte = item[0].data.quantity - 1;
          if (tokenInfo.getLinked()) {
            await game.actors.get(tokenInfo.getActorID()).updateEmbeddedDocuments("Item", [{ "_id": itemID, "data.quantity": newQte, },]);
          } else {
            await game.actors.tokens[tokenInfo.getTokenID()].updateEmbeddedDocuments("Item", [{ "_id": itemID, "data.quantity": newQte, },]);
          }
        }
        if (game.system.id === "pf2e") {
          newQte = item[0].data.quantity.value - 1;
          if (tokenInfo.getLinked()) {
            await game.actors.get(tokenInfo.getActorID()).updateEmbeddedDocuments("Item", [{ "_id": itemID, "data.quantity.value": newQte, },]);
          } else {
            await game.actors.tokens[tokenInfo.getTokenID()].updateEmbeddedDocuments("Item", [{ "_id": itemID, "data.quantity.value": newQte, },]);
          }
        }
        return true;
      }
      catch (err) {
        LightsHUD.log("Error during consumption:");
        LightsHUD.log(err);
        return false;
      }
    }

    function enableLightsHUDButton(tbutton) {
      // Remove the disabled status, if any
      tbutton.find("i").removeClass("fa-disabled");
      // Install a click handler if one is not already bound
      if (!tbutton.hasClass("clickBound")) {
        tbutton.click(async (ev) => onButtonClick(ev, tbutton));
        tbutton.addClass("clickBound");
      }
    }
    // Visually and functionally disable a LightsHUD button
    function disableLightsHUDButton(tbutton) {
      tbutton.find("i").addClass("fa-disabled");
      tbutton.off("click");
      tbutton.removeClass("clickBound");
    }

    // Enable or disable buttons according to parameters
    function enableButtonsPerSettings() {

      let checkAvailability = game.settings.get("LightsHUD", "checkAvailability");
      let spellName = game.settings.get('LightsHUD', "spell.nameLightSpell").toLowerCase();
      let lantern = game.settings.get('LightsHUD', "lanternType.nameConsumableLantern").toLowerCase();
      let torch = game.settings.get('LightsHUD', "torchType.nameConsumableTorch").toLowerCase();

      let noCheck;// = game.system.id !== "dnd5e";
      if (!noCheck) noCheck = !checkAvailability;

      if (noCheck || canCastLight(spellName)) {
        enableLightsHUDButton(tbuttonLight);
      } else {
        disableLightsHUDButton(tbuttonLight);
      }

      if (noCheck || hasItem(lantern)) {
        enableLightsHUDButton(tbuttonLantern);
      } else {
        disableLightsHUDButton(tbuttonLantern);
      }

      if (noCheck || hasItem(torch)) {
        enableLightsHUDButton(tbuttonTorch);
      } else {
        disableLightsHUDButton(tbuttonTorch);
      }
    }

    async function onButtonClick(ev, tbutton) {
      ev.preventDefault();
      ev.stopPropagation();

      // Are we dealing with the Light Button
      if (tbutton.hasClass("lightSpell")) {
        // Check if the token has the light spell on
        if (spellLight.state && tokenD.object.emitsLight) {
          // The token has the light spell on
          spellLight.state = false;
          await tokenD.setFlag("LightsHUD", spellLight._getFlagName(), false);
          tbuttonLight.removeClass("active");
          // Light is inactive, enable the relevant light sources according to parameters
          enableButtonsPerSettings();
          // Restore the initial light source
          updateTokenLightingV2((tokenD.getFlag("LightsHUD", "initialLightData")));
        } else {
          // The token does not have the light spell on
          spellLight.state = true;
          await tokenD.setFlag("LightsHUD", spellLight._getFlagName(), true);
          tbuttonLight.addClass("active");
          // Light is active, disable the other light sources
          disableLightsHUDButton(tbuttonLantern);
          disableLightsHUDButton(tbuttonTorch);
          // Store the lighting for later restoration
          await storeTokenLighting();
          // Enable the Light Source according to the type
          // "torch" / "pulse" / "chroma" / "wave" / "fog" / "sunburst" / "dome"
          // "emanation" / "hexa" / "ghost" / "energy" / "roiling" / "hole"
          let nBright = game.settings.get("LightsHUD", "lightBrightRadius");
          let nDim = game.settings.get("LightsHUD", "lightDimRadius");
          let nType = game.settings.get("LightsHUD", "lightType");
          switch (nType) {
            case "Type0":
              updateTokenLighting(
                nBright,
                nDim,
                "#ffffff",
                0.5,
                360,
                "none",
                5,
                5
              );
              break;
            case "Type1":
              updateTokenLighting(
                nBright,
                nDim,
                "#ffffff",
                0.5,
                360,
                "torch",
                5,
                5
              );
              break;
            case "Type2":
              updateTokenLighting(
                nBright,
                nDim,
                "#ffffff",
                0.5,
                360,
                "chroma",
                5,
                5
              );
              break;
            case "Type3":
              updateTokenLighting(
                nBright,
                nDim,
                "#ffffff",
                0.5,
                360,
                "pulse",
                5,
                5
              );
              break;
            case "Type4":
              updateTokenLighting(
                nBright,
                nDim,
                "#ffffff",
                0.5,
                360,
                "ghost",
                5,
                5
              );
              break;
            case "Type5":
              updateTokenLighting(
                nBright,
                nDim,
                "#ffffff",
                0.5,
                360,
                "emanation",
                5,
                5
              );
              break;
            case "Type6":
              updateTokenLighting(
                nBright,
                nDim,
                "#ff0000",
                0.5,
                360,
                "torch",
                5,
                5
              );
              break;
            case "Type7":
              updateTokenLighting(
                nBright,
                nDim,
                "#ff0000",
                0.5,
                360,
                "chroma",
                5,
                5
              );
              break;
            case "Type8":
              updateTokenLighting(
                nBright,
                nDim,
                "#ff0000",
                0.5,
                360,
                "pulse",
                5,
                5
              );
              break;
            case "Type9":
              updateTokenLighting(
                nBright,
                nDim,
                "#ff0000",
                0.5,
                360,
                "ghost",
                5,
                5
              );
              break;
            case "Type10":
              updateTokenLighting(
                nBright,
                nDim,
                "#ff0000",
                0.5,
                360,
                "emanation",
                5,
                5
              );
              break;
            case "Type11":
              updateTokenLighting(
                nBright,
                nDim,
                "#00ff00",
                0.5,
                360,
                "torch",
                5,
                5
              );
              break;
            case "Type12":
              updateTokenLighting(
                nBright,
                nDim,
                "#00ff00",
                0.5,
                360,
                "chroma",
                5,
                5
              );
              break;
            case "Type13":
              updateTokenLighting(
                nBright,
                nDim,
                "#00ff00",
                0.5,
                360,
                "pulse",
                5,
                5
              );
              break;
            case "Type14":
              updateTokenLighting(
                nBright,
                nDim,
                "#00ff00",
                0.5,
                360,
                "ghost",
                5,
                5
              );
              break;
            case "Type15":
              updateTokenLighting(
                nBright,
                nDim,
                "#00ff00",
                0.5,
                360,
                "emanation",
                5,
                5
              );
              break;
            case "TypeC":
              updateTokenLighting(
                nBright,
                nDim,
                game.settings.get("LightsHUD", "customLightColor"),
                game.settings.get("LightsHUD", "customLightColorIntensity"),
                360,
                game.settings.get("LightsHUD", "customlight.animationType"),
                game.settings.get("LightsHUD", "customlight.animationSpeed"),
                game.settings.get("LightsHUD", "customlight.animationIntensity")
              );
              break;
          }
        }
      }
      if (tbutton.hasClass("lantern")) {
        let consumable = game.settings.get("LightsHUD", "lanternType.nameConsumableLantern").toLowerCase() ?? false;
        let hasItemNow = hasItem(consumable);

        // Check if the token has the light spell on
        if (lanternLight.state && tokenD.object.emitsLight) {
          // The token has the light spell on
          lanternLight.state = false;
          tbuttonLantern.removeClass("active");
          await tokenD.setFlag("LightsHUD", lanternLight._getFlagName(), false);
          // Light is inactive, enable the relevant light sources according to parameters
          enableButtonsPerSettings();
          // Restore the initial light source
          updateTokenLightingV2((tokenD.getFlag("LightsHUD", "initialLightData")));
          return;
        }
        if (!lanternLight.state && ((hasInventoryCheck && !hasItemNow))) return;
        if (!lanternLight.state && ((consumptionCheck && !consumeItem(hasItemNow)))) return;
        if (!lanternLight.state) {
          disableLightsHUDButton(tbuttonTorch);
          disableLightsHUDButton(tbuttonLight);
          lanternLight.state = true;
          await tokenD.setFlag("LightsHUD", lanternLight._getFlagName(), true);
          tbuttonLantern.addClass("active");
          // Store the lighting for later restoration
          await storeTokenLighting();
          // Enable the Light Source according to the type
          // "torch" / "pulse" / "chroma" / "wave" / "fog" / "sunburst" / "dome"
          // "emanation" / "hexa" / "ghost" / "energy" / "roiling" / "hole"
          let nBright = game.settings.get("LightsHUD", "lanternBrightRadius");
          let nDim = game.settings.get("LightsHUD", "lanternDimRadius");
          let nType = game.settings.get("LightsHUD", "lanternType");
          switch (nType) {
            case "Type0":
              updateTokenLighting(
                nBright,
                nDim,
                "#ffffff",
                0.5,
                360,
                "none",
                5,
                5
              );
              break;
            case "Type1":
              updateTokenLighting(
                nBright,
                nDim,
                "#ffffff",
                0.8,
                360,
                "torch",
                5,
                5
              );
              break;
            case "Type2":
              updateTokenLighting(
                nBright,
                nDim,
                "#ffffff",
                0.5,
                360,
                "torch",
                5,
                5
              );
              break;
            case "Type3":
              updateTokenLighting(
                nBright,
                nDim,
                "#ffffff",
                0.2,
                360,
                "torch",
                5,
                5
              );
              break;
            case "Type4":
              updateTokenLighting(
                nBright,
                nDim,
                "#ffffff",
                0.8,
                360,
                "torch",
                5,
                5
              );
              break;
            case "Type5":
              updateTokenLighting(
                nBright,
                nDim,

                "#ffffff",
                0.5,
                360,
                "torch",
                5,
                5
              );
              break;
            case "Type6":
              updateTokenLighting(
                nBright,
                nDim,
                "#ffffff",
                0.2,
                360,
                "torch",
                5,
                5
              );
              break;
            case "Type7":
              updateTokenLighting(
                nBright,
                nDim,
                "#ffffff",
                0.8,
                60,
                "torch",
                5,
                5
              );
              break;
            case "Type8":
              updateTokenLighting(
                nBright,
                nDim,
                "#ffffff",
                0.5,
                60,
                "torch",
                5,
                5
              );
              break;
            case "Type9":
              updateTokenLighting(
                nBright,
                nDim,
                "#ffffff",
                0.2,
                60,
                "torch",
                5,
                5
              );
              break;
            case "TypeC":
              updateTokenLighting(
                nBright,
                nDim,
                game.settings.get("LightsHUD", "customLightColor"),
                game.settings.get("LightsHUD", "customLightColorIntensity"),
                360,
                game.settings.get("LightsHUD", "customlight.animationType"),
                game.settings.get("LightsHUD", "customlight.animationSpeed"),
                game.settings.get("LightsHUD", "customlight.animationIntensity")
              );
              break;
          }
        }
      }
      if (tbutton.hasClass("torch")) {
        let consumable = game.settings.get("LightsHUD", "torchType.nameConsumableTorch").toLowerCase() ?? false;
        let hasItemNow = hasItem(consumable);

        // Check if the token has the light spell on
        if (torchLight.state && tokenD.object.emitsLight) {
          // The token has the light spell on
          torchLight.state = false;
          await tokenD.setFlag("LightsHUD", torchLight._getFlagName(), false);
          tbuttonTorch.removeClass("active");
          // Light is inactive, enable the relevant light sources according to parameters
          enableButtonsPerSettings();
          // Restore the initial light source
          updateTokenLightingV2(tokenD.getFlag("LightsHUD", "initialLightData"));
          return;
        }
        if (!torchLight.state && ((hasInventoryCheck && !hasItemNow))) return;
        if (!torchLight.state && ((consumptionCheck && !consumeItem(hasItemNow)))) return;
        if (!torchLight.state) {
          disableLightsHUDButton(tbuttonLantern);
          disableLightsHUDButton(tbuttonLight);
          torchLight.state = true;
          await tokenD.setFlag("LightsHUD", torchLight._getFlagName(), true);
          tbuttonTorch.addClass("active");

          // Store the lighting for later restoration
          await storeTokenLighting();
          // Enable the Light Source according to the type
          // "torch" / "pulse" / "chroma" / "wave" / "fog" / "sunburst" / "dome"
          // "emanation" / "hexa" / "ghost" / "energy" / "roiling" / "hole"
          let nBright = game.settings.get("LightsHUD", "torchBrightRadius");
          let nDim = game.settings.get("LightsHUD", "torchDimRadius");
          let nType = game.settings.get("LightsHUD", "torchType");
          switch (nType) {
            case "Type0":
              updateTokenLightingLong(
                nBright,
                nDim,
                "#fee071",
                0.5,
                360,
                "none",
                5,
                5
              );
              break;
            case "Type1":
              updateTokenLighting(
                nBright,
                nDim,
                "#fee071",
                0.8,
                360,
                "torch",
                5,
                5
              );
              break;
            case "Type2":
              updateTokenLighting(
                nBright,
                nDim,
                "#fee071",
                0.5,
                360,
                "torch",
                5,
                5
              );
              break;
            case "Type3":
              updateTokenLighting(
                nBright,
                nDim,
                "#fee071",
                0.2,
                360,
                "torch",
                5,
                5
              );
              break;
            case "TypeC":
              updateTokenLighting(
                nBright,
                nDim,
                game.settings.get("LightsHUD", "customTorchColor"),
                game.settings.get("LightsHUD", "customTorchColorIntensity"),
                360,
                game.settings.get("LightsHUD", "customTorchAnimationType"),
                game.settings.get("LightsHUD", "customTorchAnimationSpeed"),
                game.settings.get("LightsHUD", "customTorchAnimationIntensity")
              );
              break;
          }
        }
      }
    }
    // Update the relevant light parameters of a token
    async function updateTokenLightingV2(lightData) {
      if (!lightData) {
        await app.object.document.update({ light: { bright: 0, dim: 0 } });
      }
      await app.object.document.update({ light: lightData });

    }

    function updateTokenLighting(
      bright,
      dim,
      lightColor,
      colorIntensity,
      angle,
      animationType,
      animationSpeed,
      animationIntensity
    ) {
      app.object.document.update({
        light: {
          bright: bright,
          dim: dim,
          alpha: colorIntensity,
          color: lightColor,
          angle: angle,
          animation: {
            type: animationType,
            speed: animationSpeed,
            intensity: animationIntensity,
          },
        },
      });
    }
    // Store the initial status of illumination for the token to restore if all light sources are extinguished
    async function storeTokenLighting() {

      const tokenData = app.object.data;
      const tokenFlags = app.object.document;


      if (!(game.settings.get("LightsHUD", "preservePreviousLightData"))) {
        await tokenFlags.unsetFlag("LightsHUD", "initialLightData")
        return;
      };

      try {
        await tokenFlags.setFlag("LightsHUD", "initialLightData", await duplicate(tokenData.light));
      } catch (error) {
        LightsHUD.log("Error storing LightData: ", error);
        return;
      }

    }
    /*
     * Returns the first GM id.
     */
    function firstGM() {
      let i;

      for (i = 0; i < game.users.entities.length; i++) {
        if (
          game.users.entities[i].data.role >= 4 &&
          game.users.entities[i].active
        )
          return game.users.entities[i].data._id;
      }
      ui.notifications.error("No GM available for Dancing Lights!");
    }

    async function sendRequest(req) {
      req.sceneId = canvas.scene._id;
      req.tokenId = app.object.id;

      if (!data.isGM) {
        req.addressTo = firstGM();
        game.socket.emit("module.torch", req);
      } else {
        LightsHUD.handleSocketRequest(req);
      }
    }

    // Finally insert the buttons in the column
    html.find(".col.LightsHUD-column-" + position).prepend(tbuttonTorch);
    html.find(".col.LightsHUD-column-" + position).prepend(tbuttonLantern);
    html.find(".col.LightsHUD-column-" + position).prepend(tbuttonLight);
  }

  static log(data, ...arg) {
    if (this.debug()) console.log("LightsHUD | ", data, arg);
  }

  static async handleSocketRequest(req) {
    if (req.addressTo === undefined || req.addressTo === game.user._id) {
      let scn = game.scenes.get(req.sceneId);
      let tkn = scn.data.tokens.find(({ _id }) => _id === req.tokenId);
      let dltoks = [];

      switch (req.requestType) {
        case "removeDancingLights":
          scn.data.tokens.forEach((tok) => {
            if (
              tok.actorId === tkn.actorId &&
              tok.name === "Dancing Light" &&
              tok.light.dim === 20 &&
              tok.light.bright === 10
            ) {
              dltoks.push(scn.getEmbeddedEntity("Token", tok._id)._id);
            }
          });
          await scn.deleteEmbeddedEntity("Token", dltoks);
          break;
      }
    }
  }

  static debug() {
    let isDebug = game.settings.get("LightsHUD", "debug");
    if (isDebug) CONFIG.debug.hooks = false;
    if (!isDebug) CONFIG.debug.hooks = false;

    return isDebug;
  }
}

Hooks.on("ready", () => {
  Hooks.on("renderTokenHUD", (app, html, data) => {
    if (game.settings.get("colorsettings", "showWarning")) {
      ui.notifications.notify("A module is missing the color picker library. For best results, please install and enable the Lib-Color Settings module.", "warning");
    }
  console.log("ColorSettings | initializing fallback mode");
  LightsHUD.addLightsHUDButtons(app, html, data);
  });
});
Hooks.on("renderControlsReference", (app, html, data) => {
  html
    .find("div")
    .first()
    .append(
      '<h3>LightsHUD</h3><ol class="hotkey-list"><li><h4>' +
      game.i18n.localize("LightsHUD.turnOffAllLights") +
      '</h4><div class="keys">' +
      game.i18n.localize("LightsHUD.holdCtrlOnClick") +
      "</div></li></ol>"
    );
});
// game.socket.on("module.torch", (request) => {
//   LightsHUD.handleSocketRequest(request);
//});
Hooks.once("init", () => {
  game.settings.register("colorsettings", "showWarning", {
    config: true,
    type: Boolean,
    default: false,
    name: "Show Error",
    hint: "Enable or disable error if main module missing."
  });
  if (window?.Ardittristan?.initialColorSettingRun === undefined) {
    if (game.modules.has("colorsettings")) {
      if (game.modules.get("colorsettings").active) {
        return;
      } else {
        game.settings.register("colorsettings", "autoEnable", {
          config: false,
          type: Boolean,
          default: true
        });
        Hooks.once("canvasReady", () => {
          if (game.user.isGM && game.settings.get("colorsettings", "autoEnable")) {
            Dialog.confirm({
              title: "Enable Color Settings module?",
              content: "<p>You seem to have Color Settings installed already, do you want to enable it?</p>",
              yes: () => game.settings.set("core", ModuleManagement.CONFIG_SETTING, {
                ...game.settings.get("core", ModuleManagement.CONFIG_SETTING),
                ...{ colorsettings: true }
              }),
              no: () => game.settings.set("colorsettings", "autoEnable", false),
              defaultYes: false
            });
          }
        });
      }
    }


  }

  game.settings.register("LightsHUD", "position", {
    name: game.i18n.localize("LightsHUD.position.name"),
    hint: game.i18n.localize("LightsHUD.position.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "left",
    choices: {
      left: game.i18n.localize("LightsHUD.position.left"),
      right: game.i18n.localize("LightsHUD.position.right"),
      top: game.i18n.localize("LightsHUD.position.top"),
      bottom: game.i18n.localize("LightsHUD.position.bottom"),
    },
  });
  game.settings.register("LightsHUD", "playerActivation", {
    name: game.i18n.localize("LightsHUD.playerActivation.name"),
    hint: game.i18n.localize("LightsHUD.playerActivation.hint"),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register("LightsHUD", "preservePreviousLightData", {
    name: "Preserve light data.",
    hint: "When activating a light thru the HUD, preserve the token's light settings and restore them back on deactivating it.",
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register("LightsHUD", "checkAvailability", {
    name: game.i18n.localize("LightsHUD.checkAvailability.name"),
    hint: game.i18n.localize("LightsHUD.checkAvailability.hint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register("LightsHUD", "consumeItem", {
    name: game.i18n.localize("LightsHUD.consumeItem.name"),
    hint: game.i18n.localize("LightsHUD.consumeItem.hint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register("LightsHUD", "spell.nameLightSpell", {
    name: game.i18n.localize("LightsHUD.spell.nameLightSpell.name"),
    hint: game.i18n.localize("LightsHUD.spell.nameLightSpell.hint"),
    scope: "world",
    config: true,
    default: "Light",
    type: String,
  });

  game.settings.register("LightsHUD", "torchType.nameConsumableTorch", {
    name: game.i18n.localize("LightsHUD.torchType.nameConsumableTorch.name"),
    hint: game.i18n.localize("LightsHUD.torchType.nameConsumableTorch.hint"),
    scope: "world",
    config: true,
    default: "Torch",
    type: String,
  });

  game.settings.register("LightsHUD", "lanternType.nameConsumableLantern", {
    name: game.i18n.localize("LightsHUD.lanternType.nameConsumableLantern.name"),
    hint: game.i18n.localize("LightsHUD.lanternType.nameConsumableLantern.hint"),
    scope: "world",
    config: true,
    default: "Oil (flask)",
    type: String,
  });


  // Light Parameters
  
  registerSetting("LightsHUD","lightBrightRadius","world",true,20,Number);

  game.settings.register("LightsHUD", "lightDimRadius", {
    name: game.i18n.localize("LightsHUD.lightDimRadius.name"),
    hint: game.i18n.localize("LightsHUD.lightDimRadius.hint"),
    scope: "world",
    config: true,
    default: 40,
    type: Number,
  });

  game.settings.register("LightsHUD", "lightType", {
    name: game.i18n.localize("LightsHUD.lightType.name"),
    hint: game.i18n.localize("LightsHUD.lightType.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "Type1",
    choices: {
      Type0: game.i18n.localize("LightsHUD.lightType.type0"),
      Type1: game.i18n.localize("LightsHUD.lightType.type1"),
      Type2: game.i18n.localize("LightsHUD.lightType.type2"),
      Type3: game.i18n.localize("LightsHUD.lightType.type3"),
      Type4: game.i18n.localize("LightsHUD.lightType.type4"),
      Type5: game.i18n.localize("LightsHUD.lightType.type5"),
      Type6: game.i18n.localize("LightsHUD.lightType.type6"),
      Type7: game.i18n.localize("LightsHUD.lightType.type7"),
      Type8: game.i18n.localize("LightsHUD.lightType.type8"),
      Type9: game.i18n.localize("LightsHUD.lightType.type9"),
      Type10: game.i18n.localize("LightsHUD.lightType.type10"),
      Type11: game.i18n.localize("LightsHUD.lightType.type11"),
      Type12: game.i18n.localize("LightsHUD.lightType.type12"),
      Type13: game.i18n.localize("LightsHUD.lightType.type13"),
      Type14: game.i18n.localize("LightsHUD.lightType.type14"),
      Type15: game.i18n.localize("LightsHUD.lightType.type15"),
      TypeC: game.i18n.localize("LightsHUD.lightType.typeC"),
    },
  });

  game.settings.register("LightsHUD", "customLightColorIntensity", {
    name: game.i18n.localize("LightsHUD.lightType.customIntensity.name"),
    hint: game.i18n.localize("LightsHUD.lightType.customIntensity.hint"),
    scope: "world",
    config: true,
    restricted: true,
    type: Number,
    default: 0.5,
    range: {
      min: 0.0,
      step: 0.05,
      max: 1,
    },
  });
  game.settings.register("LightsHUD", "customlight.animationType", {
    name: game.i18n.localize("LightsHUD.lightType.customAnimationType.name"),
    hint: game.i18n.localize("LightsHUD.lightType.customAnimationType.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "none",
    choices: {
      none: game.i18n.localize("LightsHUD.animationType.none"),
      torch: game.i18n.localize("LightsHUD.animationType.torch"),
      pulse: game.i18n.localize("LightsHUD.animationType.pulse"),
      chroma: game.i18n.localize("LightsHUD.animationType.chroma"),
      wave: game.i18n.localize("LightsHUD.animationType.wave"),
      fog: game.i18n.localize("LightsHUD.animationType.fog"),
      sunburst: game.i18n.localize("LightsHUD.animationType.sunburst"),
      dome: game.i18n.localize("LightsHUD.animationType.dome"),
      emanation: game.i18n.localize("LightsHUD.animationType.emanation"),
      hexa: game.i18n.localize("LightsHUD.animationType.hexa"),
      ghost: game.i18n.localize("LightsHUD.animationType.ghost"),
      energy: game.i18n.localize("LightsHUD.animationType.energy"),
      roiling: game.i18n.localize("LightsHUD.animationType.roiling"),
      hole: game.i18n.localize("LightsHUD.animationType.hole"),
    },
  });
  game.settings.register("LightsHUD", "customlight.animationSpeed", {
    name: game.i18n.localize("LightsHUD.lightType.customAnimationSpeed.name"),
    hint: game.i18n.localize("LightsHUD.lightType.customAnimationSpeed.hint"),
    scope: "world",
    config: true,
    restricted: true,
    type: Number,
    default: 5,
    range: {
      min: 1,
      step: 1,
      max: 10,
    },
  });
  game.settings.register("LightsHUD", "customlight.animationIntensity", {
    name: game.i18n.localize(
      "LightsHUD.lightType.customAnimationIntensity.name"
    ),
    hint: game.i18n.localize(
      "LightsHUD.lightType.customAnimationIntensity.hint"
    ),
    scope: "world",
    config: true,
    restricted: true,
    type: Number,
    default: 5,
    range: {
      min: 1,
      step: 1,
      max: 10,
    },
  });
  // Lantern Parameters
  game.settings.register("LightsHUD", "lanternBrightRadius", {
    name: game.i18n.localize("LightsHUD.lanternBrightRadius.name"),
    hint: game.i18n.localize("LightsHUD.lanternBrightRadius.hint"),
    scope: "world",
    config: true,
    default: 20,
    type: Number,
  });
  game.settings.register("LightsHUD", "lanternDimRadius", {
    name: game.i18n.localize("LightsHUD.lanternDimRadius.name"),
    hint: game.i18n.localize("LightsHUD.lanternDimRadius.hint"),
    scope: "world",
    config: true,
    default: 40,
    type: Number,
  });
  game.settings.register("LightsHUD", "lanternType", {
    name: game.i18n.localize("LightsHUD.lanternType.name"),
    hint: game.i18n.localize("LightsHUD.lanternType.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "Type1",
    choices: {
      Type0: game.i18n.localize("LightsHUD.lanternType.type0"),
      Type1: game.i18n.localize("LightsHUD.lanternType.type1"),
      Type2: game.i18n.localize("LightsHUD.lanternType.type2"),
      Type3: game.i18n.localize("LightsHUD.lanternType.type3"),
      Type4: game.i18n.localize("LightsHUD.lanternType.type4"),
      Type5: game.i18n.localize("LightsHUD.lanternType.type5"),
      Type6: game.i18n.localize("LightsHUD.lanternType.type6"),
      Type7: game.i18n.localize("LightsHUD.lanternType.type7"),
      Type8: game.i18n.localize("LightsHUD.lanternType.type8"),
      Type9: game.i18n.localize("LightsHUD.lanternType.type9"),
      TypeC: game.i18n.localize("LightsHUD.lanternType.typeC"),
    },
  });

  game.settings.register("LightsHUD", "customLanternColorIntensity", {
    name: game.i18n.localize("LightsHUD.lanternType.customIntensity.name"),
    hint: game.i18n.localize("LightsHUD.lanternType.customIntensity.hint"),
    scope: "world",
    config: true,
    restricted: true,
    type: Number,
    default: 0.5,
    range: {
      min: 0.0,
      step: 0.05,
      max: 1,
    },
  });
  game.settings.register("LightsHUD", "customLanternAnimationType", {
    name: game.i18n.localize("LightsHUD.lanternType.customAnimationType.name"),
    hint: game.i18n.localize("LightsHUD.lanternType.customAnimationType.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "none",
    choices: {
      none: game.i18n.localize("LightsHUD.animationType.none"),
      torch: game.i18n.localize("LightsHUD.animationType.torch"),
      pulse: game.i18n.localize("LightsHUD.animationType.pulse"),
      chroma: game.i18n.localize("LightsHUD.animationType.chroma"),
      wave: game.i18n.localize("LightsHUD.animationType.wave"),
      fog: game.i18n.localize("LightsHUD.animationType.fog"),
      sunburst: game.i18n.localize("LightsHUD.animationType.sunburst"),
      dome: game.i18n.localize("LightsHUD.animationType.dome"),
      emanation: game.i18n.localize("LightsHUD.animationType.emanation"),
      hexa: game.i18n.localize("LightsHUD.animationType.hexa"),
      ghost: game.i18n.localize("LightsHUD.animationType.ghost"),
      energy: game.i18n.localize("LightsHUD.animationType.energy"),
      roiling: game.i18n.localize("LightsHUD.animationType.roiling"),
      hole: game.i18n.localize("LightsHUD.animationType.hole"),
    },
  });
  game.settings.register("LightsHUD", "customLanternAnimationSpeed", {
    name: game.i18n.localize("LightsHUD.lanternType.customAnimationSpeed.name"),
    hint: game.i18n.localize("LightsHUD.lanternType.customAnimationSpeed.hint"),
    scope: "world",
    config: true,
    restricted: true,
    type: Number,
    default: 5,
    range: {
      min: 1,
      step: 1,
      max: 10,
    },
  });
  game.settings.register("LightsHUD", "customLanternAnimationIntensity", {
    name: game.i18n.localize(
      "LightsHUD.lanternType.customAnimationIntensity.name"
    ),
    hint: game.i18n.localize(
      "LightsHUD.lanternType.customAnimationIntensity.hint"
    ),
    scope: "world",
    config: true,
    restricted: true,
    type: Number,
    default: 5,
    range: {
      min: 1,
      step: 1,
      max: 10,
    },
  });
  // Torch Parameters
  game.settings.register("LightsHUD", "torchBrightRadius", {
    name: game.i18n.localize("LightsHUD.torchBrightRadius.name"),
    hint: game.i18n.localize("LightsHUD.torchBrightRadius.hint"),
    scope: "world",
    config: true,
    default: 20,
    type: Number,
  });
  game.settings.register("LightsHUD", "torchDimRadius", {
    name: game.i18n.localize("LightsHUD.torchDimRadius.name"),
    hint: game.i18n.localize("LightsHUD.torchDimRadius.hint"),
    scope: "world",
    config: true,
    default: 40,
    type: Number,
  });
  game.settings.register("LightsHUD", "torchType", {
    name: game.i18n.localize("LightsHUD.torchType.name"),
    hint: game.i18n.localize("LightsHUD.torchType.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "Type1",
    choices: {
      Type0: game.i18n.localize("LightsHUD.torchType.type0"),
      Type1: game.i18n.localize("LightsHUD.torchType.type1"),
      Type2: game.i18n.localize("LightsHUD.torchType.type2"),
      Type3: game.i18n.localize("LightsHUD.torchType.type3"),
      TypeC: game.i18n.localize("LightsHUD.lanternType.typeC")
    },
  });

new window.Ardittristan.ColorSetting("LightsHUD", "customLightColor", {
    name:game.i18n.localize("LightsHUD.lightType.customColor.name"),           // The name of the setting in the settings menu
    hint: game.i18n.localize("LightsHUD.lightType.customColor.hint"),        // A description of the registered setting and its behavior
    label: "Custom Light Spell Color",              // The text label used in the button
    restricted: true,                  // Restrict this setting to gamemaster only?
    defaultColor: lhConst.predefinedColors["Daylight (warm)"],          // The default color of the setting
    scope: "world",                    // The scope of the setting
    onChange: (value) => {},            // A callback function which triggers when the setting is changed
    insertAfter: "LightsHUD.lightType"   // If supplied it will place the setting after the supplied setting
});

new window.Ardittristan.ColorSetting("LightsHUD", "customLanternColor", {
  name:game.i18n.localize("LightsHUD.lanternType.customColor.name"),           // The name of the setting in the settings menu
  hint: game.i18n.localize("LightsHUD.lanternType.customColor.hint"),        // A description of the registered setting and its behavior
  label: "Custom Lantern Light Color",              // The text label used in the button
  restricted: true,                  // Restrict this setting to gamemaster only?
  defaultColor: lhConst.predefinedColors["Candles, Torches"],          // The default color of the setting
  scope: "world",                    // The scope of the setting
  onChange: (value) => {},            // A callback function which triggers when the setting is changed
  insertAfter: "LightsHUD.lanternType"   // If supplied it will place the setting after the supplied setting
});

new window.Ardittristan.ColorSetting("LightsHUD", "customTorchColor", {
  name:game.i18n.localize("LightsHUD.torchType.customColor.name"),           // The name of the setting in the settings menu
  hint: game.i18n.localize("LightsHUD.torchType.customColor.hint"),        // A description of the registered setting and its behavior
  label: "Custom Torch Light Color",              // The text label used in the button
  restricted: true,                  // Restrict this setting to gamemaster only?
  defaultColor: lhConst.predefinedColors["Candles, Torches"],          // The default color of the setting
  scope: "world",                    // The scope of the setting
  onChange: (value) => {},            // A callback function which triggers when the setting is changed
  insertAfter: "LightsHUD.torchType"   // If supplied it will place the setting after the supplied setting
});

  game.settings.register("LightsHUD", "customTorchColorIntensity", {
    name: game.i18n.localize("LightsHUD.torchType.customIntensity.name"),
    hint: game.i18n.localize("LightsHUD.torchType.customIntensity.hint"),
    scope: "world",
    config: true,
    restricted: true,
    type: Number,
    default: 0.5,
    range: {
      min: 0.0,
      step: 0.05,
      max: 1,
    },
  });
  game.settings.register("LightsHUD", "customTorchAnimationType", {
    name: game.i18n.localize("LightsHUD.torchType.customAnimationType.name"),
    hint: game.i18n.localize("LightsHUD.torchType.customAnimationType.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "none",
    choices: {
      none: game.i18n.localize("LightsHUD.animationType.none"),
      torch: game.i18n.localize("LightsHUD.animationType.torch"),
      pulse: game.i18n.localize("LightsHUD.animationType.pulse"),
      chroma: game.i18n.localize("LightsHUD.animationType.chroma"),
      wave: game.i18n.localize("LightsHUD.animationType.wave"),
      fog: game.i18n.localize("LightsHUD.animationType.fog"),
      sunburst: game.i18n.localize("LightsHUD.animationType.sunburst"),
      dome: game.i18n.localize("LightsHUD.animationType.dome"),
      emanation: game.i18n.localize("LightsHUD.animationType.emanation"),
      hexa: game.i18n.localize("LightsHUD.animationType.hexa"),
      ghost: game.i18n.localize("LightsHUD.animationType.ghost"),
      energy: game.i18n.localize("LightsHUD.animationType.energy"),
      roiling: game.i18n.localize("LightsHUD.animationType.roiling"),
      hole: game.i18n.localize("LightsHUD.animationType.hole"),
    },
  });
  game.settings.register("LightsHUD", "customTorchAnimationSpeed", {
    name: game.i18n.localize("LightsHUD.torchType.customAnimationSpeed.name"),
    hint: game.i18n.localize("LightsHUD.torchType.customAnimationSpeed.hint"),
    scope: "world",
    config: true,
    restricted: true,
    type: Number,
    default: 5,
    range: {
      min: 1,
      step: 1,
      max: 10,
    },
  });
  game.settings.register("LightsHUD", "customTorchAnimationIntensity", {
    name: game.i18n.localize(
      "LightsHUD.torchType.customAnimationIntensity.name"
    ),
    hint: game.i18n.localize(
      "LightsHUD.torchType.customAnimationIntensity.hint"
    ),
    scope: "world",
    config: true,
    restricted: true,
    type: Number,
    default: 5,
    range: {
      min: 1,
      step: 1,
      max: 10,
    },
  });

  game.settings.register("LightsHUD", "debug", {
    name: "Debug",
    hint: "Enable Debug.",
    scope: "world",
    config: true,
    restricted: true,
    type: Boolean,
    default: false,
  });

  LightsHUD.debug();
  LightsHUD.clBanner();
});

function registerSetting(moduleName, settingKey, scope = "world", config = "true", defaultValue, type = String) {
  game.settings.register(moduleName, settingKey, {
    name: game.i18n.localize(`${moduleName}.${settingKey}.name`),
    hint: game.i18n.localize(`${moduleName}.${settingKey}.hint`),
    scope: scope,
    config: config,
    default: defaultValue,
    type: type,
  });
}

function renderConfig(_, html) {
  let prefix = "LightsHUD";

  const lightTypeSelect = html.find(`select[name="${prefix}.lightType"]`);

  const dependentLightSettings = [
    { node: 'input', name: 'customLightColor' },
    { node: 'input', name: 'customLightColorIntensity' },
    { node: 'select', name: 'customlight.animationType' },
    { node: 'input', name: 'customlight.animationSpeed' },
    { node: 'input', name: 'customlight.animationIntensity' }
  ]

  function updateLightSettings() {
    const mode = lightTypeSelect.val();
    const isCustom = mode === 'TypeC';
    dependentLightSettings.forEach(setting => {
      const name = `${prefix}.${setting.name}`
      html.find(`${setting.node}[name="${name}"]`).prop("disabled", !isCustom);
    })
  }

  lightTypeSelect.change(updateLightSettings);

  const lanternTypeSelect = html.find(`select[name="${prefix}.lanternType"]`);

  const dependentLanternSettings = [
    { node: 'input', name: 'customLanternColor' },
    { node: 'input', name: 'customLanternColorIntensity' },
    { node: 'select', name: 'customLanternAnimationType' },
    { node: 'input', name: 'customLanternAnimationSpeed' },
    { node: 'input', name: 'customLanternAnimationIntensity' }
  ]

  function updateLanternSettings() {
    const mode = lanternTypeSelect.val();
    const isCustom = mode === 'TypeC';
    dependentLanternSettings.forEach(setting => {
      const name = `${prefix}.${setting.name}`
      html.find(`${setting.node}[name="${name}"]`).prop("disabled", !isCustom);
    })
  }

  lanternTypeSelect.change(updateLanternSettings);

  const torchTypeSelect = html.find(`select[name="${prefix}.torchType"]`);

  const dependentTorchSettings = [
    { node: 'input', name: 'customTorchColor' },
    { node: 'input', name: 'customTorchColorIntensity' },
    { node: 'select', name: 'customTorchAnimationType' },
    { node: 'input', name: 'customTorchAnimationSpeed' },
    { node: 'input', name: 'customTorchAnimationIntensity' }
  ]

  function updateTorchSettings() {
    const mode = torchTypeSelect.val();
    const isCustom = mode === 'TypeC';
    dependentTorchSettings.forEach(setting => {
      const name = `${prefix}.${setting.name}`
      html.find(`${setting.node}[name="${name}"]`).prop("disabled", !isCustom);
    })
  }

  torchTypeSelect.change(updateTorchSettings);

  updateLightSettings();
  updateLanternSettings();
  updateTorchSettings();
};

Hooks.on("renderSettingsConfig", renderConfig);