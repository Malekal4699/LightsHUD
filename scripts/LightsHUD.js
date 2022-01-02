/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <shurd@FreeBSD.ORG> wrote this file.  As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return.        Stephen Hurd
 * ----------------------------------------------------------------------------
 * <philippe@krait.net> updated this file.  As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and you
 * think this stuff is worth it, you can buy me a beer in return, but only if
 * you promise to buy one for Stephen as well.                   Philippe Krait
 * ----------------------------------------------------------------------------
 * <alan.n.davies@gmail.com> updated this file.  As long as you retain this
 * notice you can do whatever you want with this stuff.  If we meet some day,
 * and you think this stuff is worth it, you can buy me a beer in return, but
 * only if you promise to buy one for Stephen and Philippe as well.
 * Alan Davies
 * ----------------------------------------------------------------------------
 */

class LightsHUD {

  constructor(){}

	static clBanner(){
	  const title =
    " _     _       _     _       _   _ _   _ ____   \n"+
    "| |   (_) __ _| |__ | |_ ___| | | | | | |  _ \  \n"+
    "| |   | |/ _` | '_ \| __/ __| |_| | | | | | | | \n"+
    "| |___| | (_| | | | | |_\__ \  _  | |_| | |_| | \n"+
    "|_____|_|\__, |_| |_|\__|___/_| |_|\___/|____/  \n"+
    "         |___/                                 \n";
	  console.log( "%c" + title, "color:orange" )
	}


  static async addlightshudButtons(app, html, data) {



    // Visually and functionally enable a lightshud button
    function enablelightshudButton(tbutton) {
      // Remove the disabled status, if any
      tbutton.find("i").removeClass("fa-disabled");
      // Install a click handler if one is not already bound
      if (!tbutton.hasClass("clickBound")) {
        tbutton.click(async (ev) => onButtonClick(ev, tbutton));
        tbutton.addClass("clickBound");
      }
    }

    // Visually and functionally disable a lightshud button
    function disablelightshudButton(tbutton) {
      tbutton.find("i").addClass("fa-disabled");
      tbutton.off("click");
      tbutton.removeClass("clickBound");
      tbutton.removeClass("active");
    }

    // Enable or disable buttons according to parameters
    function enableRelevantButtons() {
      // Stores if checks need to be made to enable buttons
      let noCheck = game.system.id !== "dnd5e";
      if (!noCheck)
        noCheck =
          (data.isGM && !game.settings.get("lightshud", "dmAsPlayer")) ||
          !game.settings.get("lightshud", "checkAvailability");

      if (noCheck || canCastLight()) enablelightshudButton(tbuttonLight);
      else disablelightshudButton(tbuttonLight);

      if (
        noCheck ||
        (hasItemInInventory("Oil (flask)") &&
          (hasItemInInventory("Lantern, Hooded") ||
            hasItemInInventory("Lantern, Bullseye")))
      )
        enablelightshudButton(tbuttonLantern);
      else disablelightshudButton(tbuttonLantern);

      if (noCheck || hasItemInInventory("Torch"))
        enablelightshudButton(tbuttonTorch);
      else disablelightshudButton(tbuttonTorch);
    }

    async function onButtonClick(ev, tbutton) {
      ev.preventDefault();
      ev.stopPropagation();

      let tokenD = app.object.document;
      // Are we dealing with the Light Button
      if (tbutton === tbuttonLight) {
        // Check if the token has the light spell on
        if (statusLight) {
          // The token has the light spell on
          statusLight = false;
          await tokenD.setFlag("lightshud", "statusLight", false);
          tbuttonLight.removeClass("active");
          // Light is inactive, enable the relevant light sources according to parameters
          enableRelevantButtons();
          // Restore the initial light source
          updateTokenLighting(
            tokenD.getFlag("lightshud", "InitialBrightRadius"),
            tokenD.getFlag("lightshud", "InitialDimRadius"),
            tokenD.getFlag("lightshud", "InitialLightColor"),
            tokenD.getFlag("lightshud", "InitialColorIntensity"),
            tokenD.getFlag("lightshud", "Initiallight.angle"),
            tokenD.getFlag("lightshud", "InitialAnimationType"),
            tokenD.getFlag("lightshud", "InitialAnimationSpeed"),
            tokenD.getFlag("lightshud", "InitialAnimationIntensity")
          );
        } else {
          // The token does not have the light spell on
          statusLight = true;
          await tokenD.setFlag("lightshud", "statusLight", true);
          tbuttonLight.addClass("active");
          // Light is active, disable the other light sources
          disablelightshudButton(tbuttonLantern);
          disablelightshudButton(tbuttonTorch);
          // Store the lighting for later restoration
          await storeTokenLighting();
          // Enable the Light Source according to the type
          // "torch" / "pulse" / "chroma" / "wave" / "fog" / "sunburst" / "dome"
          // "emanation" / "hexa" / "ghost" / "energy" / "roiling" / "hole"
          let nBright = game.settings.get("lightshud", "lightBrightRadius");
          let nDim = game.settings.get("lightshud", "lightDimRadius");
          let nType = game.settings.get("lightshud", "lightType");
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
                game.settings.get("lightshud", "customLightColor"),
                game.settings.get("lightshud", "customLightColorIntensity"),
                360,
                game.settings.get("lightshud", "customlight.animationType"),
                game.settings.get("lightshud", "customlight.animationSpeed"),
                game.settings.get(
                  "lightshud",
                  "customlight.animationIntensity"
                )
              );
              break;
          }
        }
        // Or are we dealing with the Lantern Button
      }
      if (tbutton === tbuttonLantern) {
        // Check if the token has the lantern on
        if (statusLantern) {
          // The token has the light spell on

          statusLantern = false;
          await tokenD.setFlag("lightshud", "statusLantern", false);
          tbuttonLantern.removeClass("active");
          // Lantern is inactive, enable the relevant light sources according to parameters
          enableRelevantButtons();
          // Restore the initial light source
          updateTokenLighting(
            tokenD.getFlag("lightshud", "InitialBrightRadius"),
            tokenD.getFlag("lightshud", "InitialDimRadius"),
            tokenD.getFlag("lightshud", "InitialLightColor"),
            tokenD.getFlag("lightshud", "InitialColorIntensity"),
            tokenD.getFlag("lightshud", "Initiallight.angle"),
            tokenD.getFlag("lightshud", "InitialAnimationType"),
            tokenD.getFlag("lightshud", "InitialAnimationSpeed"),
            tokenD.getFlag("lightshud", "InitialAnimationIntensity")
          );
        } else {
          // The token does not have the lantern on

          // Checks whether the character can consume an oil flask
          if (consumeItem("Oil (flask)")) {
            statusLantern = true;
            await tokenD.setFlag("lightshud", "statusLantern", true);
            tbuttonLantern.addClass("active");
            // Lantern is active, disable the other light sources
            disablelightshudButton(tbuttonLight);
            disablelightshudButton(tbuttonTorch);
            // Store the lighting for later restoration
            await storeTokenLighting();
            // Enable the Lantern Source according to the type
            let nBright = game.settings.get(
              "lightshud",
              "lanternBrightRadius"
            );
            let nDim = game.settings.get("lightshud", "lanternDimRadius");
            let nType = game.settings.get("lightshud", "lanternType");
            switch (nType) {
              case "Type0":
                updateTokenLighting(
                  nBright,
                  nDim,
                  "#a2642a",
                  0.7,
                  360,
                  "none",
                  10,
                  7
                );
                break;
              case "Type1":
                updateTokenLighting(
                  nBright,
                  nDim,
                  "#a2642a",
                  0.7,
                  360,
                  "torch",
                  10,
                  7
                );
                break;
              case "Type2":
                updateTokenLighting(
                  nBright,
                  nDim,
                  "#a2642a",
                  0.5,
                  360,
                  "torch",
                  10,
                  5
                );
                break;
              case "Type3":
                updateTokenLighting(
                  nBright,
                  nDim,
                  "#a2642a",
                  0.3,
                  360,
                  "torch",
                  10,
                  3
                );
                break;
              case "Type4":
                updateTokenLighting(5, 5, "#a2642a", 0.7, 360, "torch", 10, 7);
                break;
              case "Type5":
                updateTokenLighting(5, 5, "#a2642a", 0.5, 360, "torch", 10, 5);
                break;
              case "Type6":
                updateTokenLighting(5, 5, "#a2642a", 0.3, 360, "torch", 10, 3);
                break;
              case "Type7":
                updateTokenLighting(
                  nBright * 2,
                  nDim * 2,
                  "#a2642a",
                  0.7,
                  60,
                  "torch",
                  10,
                  7
                );
                break;
              case "Type8":
                updateTokenLighting(
                  nBright * 2,
                  nDim * 2,
                  "#a2642a",
                  0.5,
                  60,
                  "torch",
                  10,
                  5
                );
                break;
              case "Type9":
                updateTokenLighting(
                  nBright * 2,
                  nDim * 2,
                  "#a2642a",
                  0.3,
                  60,
                  "torch",
                  10,
                  3
                );
                break;
              case "TypeC":
                updateTokenLighting(
                  nBright,
                  nDim,
                  game.settings.get("lightshud", "customLanternColor"),
                  game.settings.get(
                    "lightshud",
                    "customLanternColorIntensity"
                  ),
                  360,
                  game.settings.get("lightshud", "customLanternAnimationType"),
                  game.settings.get(
                    "lightshud",
                    "customLanternAnimationSpeed"
                  ),
                  game.settings.get(
                    "lightshud",
                    "customLanternAnimationIntensity"
                  )
                );
                break;
            }
          } else {
            // There is no oil to consume, signal and disable the button
            ChatMessage.create({
              user: game.user._id,
              speaker: game.actors.get(data.actorId),
              content: "No Oil (flask) in Inventory !",
            });
            disablelightshudButton(tbuttonLantern);
          }
        }
        // Or are we dealing with the Torch Button
      }
      if (tbutton === tbuttonTorch) {
        // Check if the token has the torch on
        if (statusTorch) {
          // The token has the torch on

          statusTorch = false;
          await tokenD.setFlag("lightshud", "statusTorch", false);
          tbuttonTorch.removeClass("active");
          // Torch is inactive, enable the relevant light sources according to parameters
          enableRelevantButtons();
          // Restore the initial light source

          updateTokenLighting(
            tokenD.getFlag("lightshud", "InitialBrightRadius"),
            tokenD.getFlag("lightshud", "InitialDimRadius"),
            tokenD.getFlag("lightshud", "InitialLightColor"),
            tokenD.getFlag("lightshud", "InitialColorIntensity"),
            tokenD.getFlag("lightshud", "Initiallight.angle"),
            tokenD.getFlag("lightshud", "InitialAnimationType"),
            tokenD.getFlag("lightshud", "InitialAnimationSpeed"),
            tokenD.getFlag("lightshud", "InitialAnimationIntensity")
          );
        } else {
          // The token does not have the torch on

          // Checks whether the character can consume a torch
          if (consumeItem("Torch")) {
            statusTorch = true;
            await tokenD.setFlag("lightshud", "statusTorch", true);
            tbuttonTorch.addClass("active");
            // Torch is active, disable the other light sources
            disablelightshudButton(tbuttonLight);
            disablelightshudButton(tbuttonLantern);
            // Store the lighting for later restoration
            await storeTokenLighting();
            // Enable the Torch Source according to the type
            let nBright = game.settings.get("lightshud", "torchBrightRadius");
            let nDim = game.settings.get("lightshud", "torchDimRadius");
            let nType = game.settings.get("lightshud", "torchType");
            switch (nType) {
              case "Type0":
                updateTokenLighting(
                  nBright,
                  nDim,
                  "#a2642a",
                  0.7,
                  360,
                  "none",
                  5,
                  7
                );
                break;
              case "Type1":
                updateTokenLighting(
                  nBright,
                  nDim,
                  "#a2642a",
                  0.7,
                  360,
                  "torch",
                  5,
                  7
                );
                break;
              case "Type2":
                updateTokenLighting(
                  nBright,
                  nDim,
                  "#a2642a",
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
                  "#a2642a",
                  0.3,
                  360,
                  "torch",
                  5,
                  3
                );
                break;
              case "Type4":
                updateTokenLighting(
                  nBright,
                  nDim,
                  "#a22a2a",
                  0.7,
                  360,
                  "torch",
                  5,
                  7
                );
                break;
              case "Type5":
                updateTokenLighting(
                  nBright,
                  nDim,
                  "#a22a2a",
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
                  "#a22a2a",
                  0.3,
                  360,
                  "torch",
                  5,
                  3
                );
                break;
              case "Type7":
                updateTokenLighting(
                  nBright,
                  nDim,
                  "#822aa2",
                  0.7,
                  360,
                  "torch",
                  5,
                  7
                );
                break;
              case "Type8":
                updateTokenLighting(
                  nBright,
                  nDim,
                  "#822aa2",
                  0.5,
                  360,
                  "torch",
                  5,
                  5
                );
                break;
              case "Type9":
                updateTokenLighting(
                  nBright,
                  nDim,
                  "#822aa2",
                  0.3,
                  360,
                  "torch",
                  5,
                  3
                );
                break;
              case "TypeC":
                updateTokenLighting(
                  nBright,
                  nDim,
                  game.settings.get("lightshud", "customTorchColor"),
                  game.settings.get("lightshud", "customTorchColorIntensity"),
                  360,
                  game.settings.get("lightshud", "customTorchAnimationType"),
                  game.settings.get("lightshud", "customTorchAnimationSpeed"),
                  game.settings.get(
                    "lightshud",
                    "customTorchAnimationIntensity"
                  )
                );
                break;
            }
          } else {
            // There is no torch to consume, signal and disable the button
            ChatMessage.create({
              user: game.user._id,
              speaker: game.actors.get(data.actorId),
              content: "No Torch in Inventory !",
            });
            disablelightshudButton(tbuttonTorch);
          }
        }
      }
    }

    // Update the relevant light parameters of a token
    function updateTokenLighting(bright, dim, lightColor, colorIntensity, angle, animationType, animationSpeed, animationIntensity)
		{
			app.object.document.update({light:{
				bright: bright,
				dim: dim,
				alpha: colorIntensity ** 2,
				color: lightColor,
				angle: angle,
				animation: {
				type: animationType,
				speed: animationSpeed,
				intensity: animationIntensity,
				}},
			});
	}

    // Store the initial status of illumination for the token to restore if all light sources are extinguished
    async function storeTokenLighting() {
      let promises = [];
      const tokenData = app.object.data;
      const tokenFlags = app.object.document;
      promises.push(
        tokenFlags.setFlag(
          "lightshud",
          "InitialBrightRadius",
          tokenData.light.bright
        )
      );
      promises.push(
        tokenFlags.setFlag(
          "lightshud",
          "InitialDimRadius",
          tokenData.light.dim
        )
      );
      promises.push(
        tokenFlags.setFlag(
          "lightshud",
          "InitialLightColor",
          tokenData.lightColor
            ? tokenData.lightColor.toString(16).padStart(6, 0)
            : null
        )
      );
      promises.push(
        tokenFlags.setFlag(
          "lightshud",
          "InitialColorIntensity",
          Math.sqrt(tokenData.lightAlpha)
        )
      );
      promises.push(
        tokenFlags.setFlag(
          "lightshud",
          "Initiallight.angle",
          tokenData.light.angle
        )
      );
      promises.push(
        tokenFlags.setFlag(
          "lightshud",
          "InitialAnimationType",
          tokenData.light.animation.type ?? null
        )
      );
      promises.push(
        tokenFlags.setFlag(
          "lightshud",
          "InitialAnimationSpeed",
          tokenData.light.animation.speed
        )
      );
      promises.push(
        tokenFlags.setFlag(
          "lightshud",
          "InitialAnimationIntensity",
          tokenData.light.animation.intensity
        )
      );
 
      return Promise.all(promises);
    }

    // Define all three buttons
    let tbuttonLight = $(
      `<div class="control-icon lightshud" title="Toggle Light Spell"><i class="fas fa-sun"></i></div>`
    );
    let tbuttonLantern = $(
      `<div class="control-icon lightshud" title="Toggle Lantern"><i class="fas fa-lightbulb"></i></div>`
    );
    let tbuttonTorch = $(
      `<div class="control-icon lightshud" title="Toggle Torch"><i class="fas fa-fire"></i></div>`
    );

    // Get the position of the column
    let position = game.settings.get("lightshud", "position");

    // Create the column
    let buttonsdiv = $(`<div class="col lightshud-column-${position}"></div>`);
 
    // Wrap the previous icons
    let newdiv = '<div class="lightshud-container"></div>';
    html.find(".col.left").before(newdiv);

    // Add the column
    html.find(".lightshud-container").prepend(buttonsdiv);

    // Get the status of the three types of lights
    let statusLight = app.object.document.getFlag("lightshud", "statusLight");
    if (statusLight == undefined || statusLight == null) {
      statusLight = false;
      await app.object.document.setFlag("lightshud", "statusLight", false);
    }
    let statusLantern = app.object.document.getFlag(
      "lightshud",
      "statusLantern"
    );
    if (statusLantern == undefined || statusLantern == null) {
      statusLantern = false;
      await app.object.document.setFlag("lightshud", "statusLantern", false);
    }
    let statusTorch = app.object.document.getFlag("lightshud", "statusTorch");
    if (statusTorch == undefined || statusTorch == null) {
      statusTorch = false;
      await app.object.document.setFlag("lightshud", "statusTorch", false);
    }

    // Initial button state when the HUD comes up
    if (statusLight) tbuttonLight.addClass("active");
    if (statusLantern) tbuttonLantern.addClass("active");

    // Check the permissions to manage the lights
    if (
      data.isGM === true ||
      game.settings.get("lightshud", "playerActivation") === true
    ) {
      // If the a specific light is on, enable only that light otherwise enable all three of them
      if (statusLight) {
        enablelightshudButton(tbuttonLight);
        disablelightshudButton(tbuttonLantern);
        disablelightshudButton(tbuttonTorch);
        tbuttonLight.addClass("active");
      } else if (statusLantern) {
        disablelightshudButton(tbuttonLight);
        enablelightshudButton(tbuttonLantern);
        disablelightshudButton(tbuttonTorch);
        tbuttonLantern.addClass("active");
      } else if (statusTorch) {
        disablelightshudButton(tbuttonLight);
        disablelightshudButton(tbuttonLantern);
        enablelightshudButton(tbuttonTorch);
        tbuttonTorch.addClass("active");
      } else enableRelevantButtons();
    } else {
      // If no permission exists, disable all the buttons
      disablelightshudButton(tbuttonLight);
      disablelightshudButton(tbuttonLantern);
      disablelightshudButton(tbuttonTorch);
    }

    // Returns true if the character can use the Light spell
    // This also returns true if the game system is not D&D 5e...
    function canCastLight() {
      let actor = game.actors.get(data.actorId);
      if (actor === undefined) return false;
      let hasLight = false;
      actor.data.items.forEach((item) => {
        if (item.type === "spell") {
          if (item.name === "Light") hasLight = true;
        }
      });
      return hasLight;
    }

    // Returns true if the character has a specific item in his inventory
    // This also returns true if the game system is not D&D 5e...
    function hasItemInInventory(itemToCheck) {
      let actor = game.actors.get(data.actorId);
      if (actor === undefined) return false;
      let hasItem = false;
      actor.data.items.forEach((item) => {
        if (item.name.toLowerCase() === itemToCheck.toLowerCase()) {
          if (item.data.quantity > 0) hasItem = true;
        }
      });
      return hasItem;
    }

    // Returns true if either the character does not need to consume an item
    // or if he can indeed consume it (and it is actually consumed)
    function consumeItem(itemToCheck) {
      let consume = game.system.id !== "dnd5e";
      if (!consume)
        consume =
          (data.isGM && !game.settings.get("lightshud", "dmAsPlayer")) ||
          !game.settings.get("lightshud", "checkAvailability") ||
          !game.settings.get("lightshud", "consumeItem");
      if (!consume) {
        let actor = game.actors.get(data.actorId);
        if (actor === undefined) return false;
        let hasItem = false;
        actor.data.items.forEach((item, offset) => {
          if (item.name.toLowerCase() === itemToCheck.toLowerCase()) {
            if (item.data.quantity > 0) {
              hasItem = true;
              actor.updateOwnedItem({
                _id: actor.data.items[offset]._id,
                "data.quantity": actor.data.items[offset].data.quantity - 1,
              });
            }
          }
        });
        consume = hasItem;
      }
      return consume;
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
    html.find(".col.lightshud-column-" + position).prepend(tbuttonTorch);
    html.find(".col.lightshud-column-" + position).prepend(tbuttonLantern);
    html.find(".col.lightshud-column-" + position).prepend(tbuttonLight);
  }

  static log(data) {
    if (this.debug())
      console.log("lightshud | ", data);
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

  static debug(){
    let isDebug = game.settings.get("lightshud", "debug");
      if (isDebug)
        CONFIG.debug.hooks = true;
      if (!isDebug)
        CONFIG.debug.hooks = false;

      return isDebug;
  }

}


Hooks.on("ready", () => {
  Hooks.on("renderTokenHUD", (app, html, data) => {
    LightsHUD.addlightshudButtons(app, html, data);
  });
  Hooks.on("renderControlsReference", (app, html, data) => {
    html
      .find("div")
      .first()
      .append(
        '<h3>lightshud</h3><ol class="hotkey-list"><li><h4>' +
          game.i18n.localize("lightshud.turnOffAllLights") +
          '</h4><div class="keys">' +
          game.i18n.localize("lightshud.holdCtrlOnClick") +
          "</div></li></ol>"
      );
  });
  game.socket.on("module.torch", (request) => {
    LightsHUD.handleSocketRequest(request);
  });
});
Hooks.once("init", () => {
  game.settings.register("lightshud", "position", {
    name: game.i18n.localize("lightshud.position.name"),
    hint: game.i18n.localize("lightshud.position.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "left",
    choices: {
      left: game.i18n.localize("lightshud.position.left"),
      right: game.i18n.localize("lightshud.position.right"),
      top: game.i18n.localize("lightshud.position.top"),
      bottom: game.i18n.localize("lightshud.position.bottom"),
    },
  });
  game.settings.register("lightshud", "playerActivation", {
    name: game.i18n.localize("lightshud.playerActivation.name"),
    hint: game.i18n.localize("lightshud.playerActivation.hint"),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });
  if (game.system.id === "dnd5e") {
    game.settings.register("lightshud", "checkAvailability", {
      name: game.i18n.localize("lightshud.checkAvailability.name"),
      hint: game.i18n.localize("lightshud.checkAvailability.hint"),
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
    });
    game.settings.register("lightshud", "consumeItem", {
      name: game.i18n.localize("lightshud.consumeItem.name"),
      hint: game.i18n.localize("lightshud.consumeItem.hint"),
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
    });
    game.settings.register("lightshud", "dmAsPlayer", {
      name: game.i18n.localize("lightshud.dmAsPlayer.name"),
      hint: game.i18n.localize("lightshud.dmAsPlayer.hint"),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    });
  }
  // Light Parameters
  game.settings.register("lightshud", "lightBrightRadius", {
    name: game.i18n.localize("lightshud.lightBrightRadius.name"),
    hint: game.i18n.localize("lightshud.lightBrightRadius.hint"),
    scope: "world",
    config: true,
    default: 20,
    type: Number,
  });
  game.settings.register("lightshud", "lightDimRadius", {
    name: game.i18n.localize("lightshud.lightDimRadius.name"),
    hint: game.i18n.localize("lightshud.lightDimRadius.hint"),
    scope: "world",
    config: true,
    default: 40,
    type: Number,
  });
  game.settings.register("lightshud", "lightType", {
    name: game.i18n.localize("lightshud.lightType.name"),
    hint: game.i18n.localize("lightshud.lightType.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "Type1",
    choices: {
      Type0: game.i18n.localize("lightshud.lightType.type0"),
      Type1: game.i18n.localize("lightshud.lightType.type1"),
      Type2: game.i18n.localize("lightshud.lightType.type2"),
      Type3: game.i18n.localize("lightshud.lightType.type3"),
      Type4: game.i18n.localize("lightshud.lightType.type4"),
      Type5: game.i18n.localize("lightshud.lightType.type5"),
      Type6: game.i18n.localize("lightshud.lightType.type6"),
      Type7: game.i18n.localize("lightshud.lightType.type7"),
      Type8: game.i18n.localize("lightshud.lightType.type8"),
      Type9: game.i18n.localize("lightshud.lightType.type9"),
      Type10: game.i18n.localize("lightshud.lightType.type10"),
      Type11: game.i18n.localize("lightshud.lightType.type11"),
      Type12: game.i18n.localize("lightshud.lightType.type12"),
      Type13: game.i18n.localize("lightshud.lightType.type13"),
      Type14: game.i18n.localize("lightshud.lightType.type14"),
      Type15: game.i18n.localize("lightshud.lightType.type15"),
      TypeC: game.i18n.localize("lightshud.lightType.typeC"),
    },
  });
  game.settings.register("lightshud", "customLightColor", {
    name: game.i18n.localize("lightshud.lightType.customColor.name"),
    hint: game.i18n.localize("lightshud.lightType.customColor.hint"),
    scope: "world",
    config: true,
    restricted: false,
    type: String,
    default: "#a2642a",
  });
  game.settings.register("lightshud", "customLightColorIntensity", {
    name: game.i18n.localize("lightshud.lightType.customIntensity.name"),
    hint: game.i18n.localize("lightshud.lightType.customIntensity.hint"),
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
  game.settings.register("lightshud", "customlight.animationType", {
    name: game.i18n.localize("lightshud.lightType.customAnimationType.name"),
    hint: game.i18n.localize("lightshud.lightType.customAnimationType.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "none",
    choices: {
      none: game.i18n.localize("lightshud.animationType.none"),
      torch: game.i18n.localize("lightshud.animationType.torch"),
      pulse: game.i18n.localize("lightshud.animationType.pulse"),
      chroma: game.i18n.localize("lightshud.animationType.chroma"),
      wave: game.i18n.localize("lightshud.animationType.wave"),
      fog: game.i18n.localize("lightshud.animationType.fog"),
      sunburst: game.i18n.localize("lightshud.animationType.sunburst"),
      dome: game.i18n.localize("lightshud.animationType.dome"),
      emanation: game.i18n.localize("lightshud.animationType.emanation"),
      hexa: game.i18n.localize("lightshud.animationType.hexa"),
      ghost: game.i18n.localize("lightshud.animationType.ghost"),
      energy: game.i18n.localize("lightshud.animationType.energy"),
      roiling: game.i18n.localize("lightshud.animationType.roiling"),
      hole: game.i18n.localize("lightshud.animationType.hole"),
    },
  });
  game.settings.register("lightshud", "customlight.animationSpeed", {
    name: game.i18n.localize("lightshud.lightType.customAnimationSpeed.name"),
    hint: game.i18n.localize("lightshud.lightType.customAnimationSpeed.hint"),
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
  game.settings.register("lightshud", "customlight.animationIntensity", {
    name: game.i18n.localize(
      "lightshud.lightType.customAnimationIntensity.name"
    ),
    hint: game.i18n.localize(
      "lightshud.lightType.customAnimationIntensity.hint"
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
  game.settings.register("lightshud", "lanternBrightRadius", {
    name: game.i18n.localize("lightshud.lanternBrightRadius.name"),
    hint: game.i18n.localize("lightshud.lanternBrightRadius.hint"),
    scope: "world",
    config: true,
    default: 20,
    type: Number,
  });
  game.settings.register("lightshud", "lanternDimRadius", {
    name: game.i18n.localize("lightshud.lanternDimRadius.name"),
    hint: game.i18n.localize("lightshud.lanternDimRadius.hint"),
    scope: "world",
    config: true,
    default: 40,
    type: Number,
  });
  game.settings.register("lightshud", "lanternType", {
    name: game.i18n.localize("lightshud.lanternType.name"),
    hint: game.i18n.localize("lightshud.lanternType.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "Type1",
    choices: {
      Type0: game.i18n.localize("lightshud.lanternType.type0"),
      Type1: game.i18n.localize("lightshud.lanternType.type1"),
      Type2: game.i18n.localize("lightshud.lanternType.type2"),
      Type3: game.i18n.localize("lightshud.lanternType.type3"),
      Type4: game.i18n.localize("lightshud.lanternType.type4"),
      Type5: game.i18n.localize("lightshud.lanternType.type5"),
      Type6: game.i18n.localize("lightshud.lanternType.type6"),
      Type7: game.i18n.localize("lightshud.lanternType.type7"),
      Type8: game.i18n.localize("lightshud.lanternType.type8"),
      Type9: game.i18n.localize("lightshud.lanternType.type9"),
      TypeC: game.i18n.localize("lightshud.lanternType.typeC"),
    },
  });
  game.settings.register("lightshud", "customLanternColor", {
    name: game.i18n.localize("lightshud.lanternType.customColor.name"),
    hint: game.i18n.localize("lightshud.lanternType.customColor.hint"),
    scope: "world",
    config: true,
    restricted: false,
    type: String,
    default: "#a2642a",
  });
  game.settings.register("lightshud", "customLanternColorIntensity", {
    name: game.i18n.localize("lightshud.lanternType.customIntensity.name"),
    hint: game.i18n.localize("lightshud.lanternType.customIntensity.hint"),
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
  game.settings.register("lightshud", "customLanternAnimationType", {
    name: game.i18n.localize("lightshud.lanternType.customAnimationType.name"),
    hint: game.i18n.localize("lightshud.lanternType.customAnimationType.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "none",
    choices: {
      none: game.i18n.localize("lightshud.animationType.none"),
      torch: game.i18n.localize("lightshud.animationType.torch"),
      pulse: game.i18n.localize("lightshud.animationType.pulse"),
      chroma: game.i18n.localize("lightshud.animationType.chroma"),
      wave: game.i18n.localize("lightshud.animationType.wave"),
      fog: game.i18n.localize("lightshud.animationType.fog"),
      sunburst: game.i18n.localize("lightshud.animationType.sunburst"),
      dome: game.i18n.localize("lightshud.animationType.dome"),
      emanation: game.i18n.localize("lightshud.animationType.emanation"),
      hexa: game.i18n.localize("lightshud.animationType.hexa"),
      ghost: game.i18n.localize("lightshud.animationType.ghost"),
      energy: game.i18n.localize("lightshud.animationType.energy"),
      roiling: game.i18n.localize("lightshud.animationType.roiling"),
      hole: game.i18n.localize("lightshud.animationType.hole"),
    },
  });
  game.settings.register("lightshud", "customLanternAnimationSpeed", {
    name: game.i18n.localize(
      "lightshud.lanternType.customAnimationSpeed.name"
    ),
    hint: game.i18n.localize(
      "lightshud.lanternType.customAnimationSpeed.hint"
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
  game.settings.register("lightshud", "customLanternAnimationIntensity", {
    name: game.i18n.localize(
      "lightshud.lanternType.customAnimationIntensity.name"
    ),
    hint: game.i18n.localize(
      "lightshud.lanternType.customAnimationIntensity.hint"
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
  if (game.system.id === "dnd5e") {
    game.settings.register("lightshud", "nameConsumableLantern", {
      name: game.i18n.localize("lightshud.nameConsumableLantern.name"),
      hint: game.i18n.localize("lightshud.nameConsumableLantern.hint"),
      scope: "world",
      config: true,
      default: "Oil (flask)",
      type: String,
    });
  }
  // Torch Parameters
  game.settings.register("lightshud", "torchBrightRadius", {
    name: game.i18n.localize("lightshud.torchBrightRadius.name"),
    hint: game.i18n.localize("lightshud.torchBrightRadius.hint"),
    scope: "world",
    config: true,
    default: 20,
    type: Number,
  });
  game.settings.register("lightshud", "torchDimRadius", {
    name: game.i18n.localize("lightshud.torchDimRadius.name"),
    hint: game.i18n.localize("lightshud.torchDimRadius.hint"),
    scope: "world",
    config: true,
    default: 40,
    type: Number,
  });
  game.settings.register("lightshud", "torchType", {
    name: game.i18n.localize("lightshud.torchType.name"),
    hint: game.i18n.localize("lightshud.torchType.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "Type1",
    choices: {
      Type0: game.i18n.localize("lightshud.torchType.type0"),
      Type1: game.i18n.localize("lightshud.torchType.type1"),
      Type2: game.i18n.localize("lightshud.torchType.type2"),
      Type3: game.i18n.localize("lightshud.torchType.type3"),
      Type4: game.i18n.localize("lightshud.torchType.type4"),
      Type5: game.i18n.localize("lightshud.torchType.type5"),
      Type6: game.i18n.localize("lightshud.torchType.type6"),
      Type7: game.i18n.localize("lightshud.torchType.type7"),
      Type8: game.i18n.localize("lightshud.torchType.type8"),
      Type9: game.i18n.localize("lightshud.torchType.type9"),
      TypeC: game.i18n.localize("lightshud.torchType.typeC"),
    },
  });
  game.settings.register("lightshud", "customTorchColor", {
    name: game.i18n.localize("lightshud.torchType.customColor.name"),
    hint: game.i18n.localize("lightshud.torchType.customColor.hint"),
    scope: "world",
    config: true,
    restricted: false,
    type: String,
    default: "#a2642a",
  });
  game.settings.register("lightshud", "customTorchColorIntensity", {
    name: game.i18n.localize("lightshud.torchType.customIntensity.name"),
    hint: game.i18n.localize("lightshud.torchType.customIntensity.hint"),
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
  game.settings.register("lightshud", "customTorchAnimationType", {
    name: game.i18n.localize("lightshud.torchType.customAnimationType.name"),
    hint: game.i18n.localize("lightshud.torchType.customAnimationType.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "none",
    choices: {
      none: game.i18n.localize("lightshud.animationType.none"),
      torch: game.i18n.localize("lightshud.animationType.torch"),
      pulse: game.i18n.localize("lightshud.animationType.pulse"),
      chroma: game.i18n.localize("lightshud.animationType.chroma"),
      wave: game.i18n.localize("lightshud.animationType.wave"),
      fog: game.i18n.localize("lightshud.animationType.fog"),
      sunburst: game.i18n.localize("lightshud.animationType.sunburst"),
      dome: game.i18n.localize("lightshud.animationType.dome"),
      emanation: game.i18n.localize("lightshud.animationType.emanation"),
      hexa: game.i18n.localize("lightshud.animationType.hexa"),
      ghost: game.i18n.localize("lightshud.animationType.ghost"),
      energy: game.i18n.localize("lightshud.animationType.energy"),
      roiling: game.i18n.localize("lightshud.animationType.roiling"),
      hole: game.i18n.localize("lightshud.animationType.hole"),
    },
  });
  game.settings.register("lightshud", "customTorchAnimationSpeed", {
    name: game.i18n.localize("lightshud.torchType.customAnimationSpeed.name"),
    hint: game.i18n.localize("lightshud.torchType.customAnimationSpeed.hint"),
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
  game.settings.register("lightshud", "customTorchAnimationIntensity", {
    name: game.i18n.localize(
      "lightshud.torchType.customAnimationIntensity.name"
    ),
    hint: game.i18n.localize(
      "lightshud.torchType.customAnimationIntensity.hint"
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
  if (game.system.id === "dnd5e") {
    game.settings.register("lightshud", "nameConsumableTorch", {
      name: game.i18n.localize("lightshud.nameConsumableTorch.name"),
      hint: game.i18n.localize("lightshud.nameConsumableTorch.hint"),
      scope: "world",
      config: true,
      default: "Torch",
      type: String,
    });
  }
  game.settings.register("lightshud", "debug", {
    name: "Debug",
    hint: "Enable Debug.",
    scope: "world",
    config: true,
    restricted: true,
    type: Boolean,
    default: false
    });

  LightsHUD.debug();
  LightsHUD.clBanner();
  });

  