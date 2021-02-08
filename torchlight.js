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
 */

class TorchLight {
	static async addTorchLightButtons(app, html, data) {

		// Visually and functionally enable a torchlight button
		function enableTorchlightButton(tbutton) {
			// Remove the disabled status, if any
			tbutton.find('i').removeClass('fa-disabled');

			// If a torchlight button is clicked
			tbutton.find('i').click(async (ev) => {
				//console.log("Clicked on a Button.");
				ev.preventDefault();
				ev.stopPropagation();

				// Are we dealing with the Light Button
				if (tbutton === tbuttonLight) {
					// Check if the token has the light spell on
					if (statusLight) {
						// The token has the light spell on
						console.log("Clicked on the light button when the light is on.");
						statusLight = false;
						await app.object.setFlag("torchlight", "statusLight", false);
						tbuttonLight.removeClass("active");
						// Light is inactive, enable the relevant light sources according to parameters
						enableRelevantButtons();
						// Restore the initial light source
						updateTokenLighting(
							app.object.getFlag("torchlight", "InitialBrightRadius"),
							app.object.getFlag("torchlight", "InitialDimRadius"),
							app.object.getFlag("torchlight", "InitialLightColor"),
							app.object.getFlag("torchlight", "InitialColorIntensity"),
							app.object.getFlag("torchlight", "InitialLightAngle"),
							app.object.getFlag("torchlight", "InitialAnimationType"),
							app.object.getFlag("torchlight", "InitialAnimationSpeed"),
							app.object.getFlag("torchlight", "InitialAnimationIntensity"),
						);
					} else {
						// The token does not have the light spell on
						console.log("Clicked on the light button when the light is off.");
						statusLight = true;
						await app.object.setFlag("torchlight", "statusLight", true);
						tbuttonLight.addClass("active");
						// Light is active, disable the other light sources
						disableTorchlightButton(tbuttonLantern);
						disableTorchlightButton(tbuttonTorch);
						// Store the lighting for later restoration
						storeTokenLighting();
						// Enable the Light Source according to the type
						// "torch" / "pulse" / "chroma" / "wave" / "fog" / "sunburst" / "dome"
						// "emanation" / "hexa" / "ghost" / "energy" / "roiling" / "hole"
						let nBright = game.settings.get("torchlight", "lightBrightRadius");
						let nDim    = game.settings.get("torchlight", "lightDimRadius");
						let nType   = game.settings.get("torchlight", "lightType");
						switch (nType){
							case "Type0":
								updateTokenLighting(nBright,nDim, "#ffffff", "0.5", 360, "none", 5, 5);
								break;
							case "Type1":
								updateTokenLighting(nBright,nDim, "#ffffff", "0.5", 360, "torch", 5, 5);
								break;
							case "Type2":
								updateTokenLighting(nBright,nDim, "#ffffff", "0.5", 360, "chroma", 5, 5);
								break;
							case "Type3":
								updateTokenLighting(nBright,nDim, "#ffffff", "0.5", 360, "pulse", 5, 5);
								break;
							case "Type4":
								updateTokenLighting(nBright,nDim, "#ffffff", "0.5", 360, "ghost", 5, 5);
								break;
							case "Type5":
								updateTokenLighting(nBright,nDim, "#ffffff", "0.5", 360, "emanation", 5, 5);
								break;
							case "Type6":
								updateTokenLighting(nBright,nDim, "#ff0000", "0.5", 360, "torch", 5, 5);
								break;
							case "Type7":
								updateTokenLighting(nBright,nDim, "#ff0000", "0.5", 360, "chroma", 5, 5);
								break;
							case "Type8":
								updateTokenLighting(nBright,nDim, "#ff0000", "0.5", 360, "pulse", 5, 5);
								break;
							case "Type9":
								updateTokenLighting(nBright,nDim, "#ff0000", "0.5", 360, "ghost", 5, 5);
								break;
							case "Type10":
								updateTokenLighting(nBright,nDim, "#ff0000", "0.5", 360, "emanation", 5, 5);
								break;
							case "Type11":
								updateTokenLighting(nBright,nDim, "#00ff00", "0.5", 360, "torch", 5, 5);
								break;
							case "Type12":
								updateTokenLighting(nBright,nDim, "#00ff00", "0.5", 360, "chroma", 5, 5);
								break;
							case "Type13":
								updateTokenLighting(nBright,nDim, "#00ff00", "0.5", 360, "pulse", 5, 5);
								break;
							case "Type14":
								updateTokenLighting(nBright,nDim, "#00ff00", "0.5", 360, "ghost", 5, 5);
								break;
							case "Type15":
								updateTokenLighting(nBright,nDim, "#00ff00", "0.5", 360, "emanation", 5, 5);
								break;
						}
					}
				// Or are we dealing with the Lantern Button
				} else if (tbutton === tbuttonLantern) {
					// Check if the token has the lantern on
					if (statusLantern) {
						// The token has the light spell on
						console.log("Clicked on the lantern button when the lantern is on.");
						statusLantern = false;
						await app.object.setFlag("torchlight", "statusLantern", false);
						tbuttonLantern.removeClass("active");
						// Lantern is inactive, enable the relevant light sources according to parameters
						enableRelevantButtons();
						// Restore the initial light source
						updateTokenLighting(
							app.object.getFlag("torchlight", "InitialBrightRadius"),
							app.object.getFlag("torchlight", "InitialDimRadius"),
							app.object.getFlag("torchlight", "InitialLightColor"),
							app.object.getFlag("torchlight", "InitialColorIntensity"),
							app.object.getFlag("torchlight", "InitialLightAngle"),
							app.object.getFlag("torchlight", "InitialAnimationType"),
							app.object.getFlag("torchlight", "InitialAnimationSpeed"),
							app.object.getFlag("torchlight", "InitialAnimationIntensity"),
						);
					} else {
						// The token does not have the lantern on
						console.log("Clicked on the lantern when the lantern is off.");
						// Checks whether the character can consume an oil flask
						if (consumeItem("Oil (flask)")) {
							statusLantern = true;
							await app.object.setFlag("torchlight", "statusLantern", true);
							tbuttonLantern.addClass("active");
							// Lantern is active, disable the other light sources
							disableTorchlightButton(tbuttonLight);
							disableTorchlightButton(tbuttonTorch);
							// Store the lighting for later restoration
							storeTokenLighting();
							// Enable the Lantern Source according to the type
							let nBright = game.settings.get("torchlight", "lanternBrightRadius");
							let nDim    = game.settings.get("torchlight", "lanternDimRadius");
							let nType   = game.settings.get("torchlight", "lanternType");
							switch (nType){
								case "Type0":
									updateTokenLighting(nBright,nDim, "#a2642a", "0.7", 360, "none", 10, 7);
									break;
								case "Type1":
									updateTokenLighting(nBright,nDim, "#a2642a", "0.7", 360, "torch", 10, 7);
									break;
								case "Type2":
									updateTokenLighting(nBright,nDim, "#a2642a", "0.5", 360, "torch", 10, 5);
									break;
								case "Type3":
									updateTokenLighting(nBright,nDim, "#a2642a", "0.3", 360, "torch", 10, 3);
									break;
								case "Type4":
									updateTokenLighting(5,5, "#a2642a", "0.7", 360, "torch", 10, 7);
									break;
								case "Type5":
									updateTokenLighting(5,5, "#a2642a", "0.5", 360, "torch", 10, 5);
									break;
								case "Type6":
									updateTokenLighting(5,5, "#a2642a", "0.3", 360, "torch", 10, 3);
									break;
								case "Type7":
									updateTokenLighting(nBright*2,nDim*2, "#a2642a", "0.7", 60, "torch", 10, 7);
									break;
								case "Type8":
									updateTokenLighting(nBright*2,nDim*2, "#a2642a", "0.5", 60, "torch", 10, 5);
									break;
								case "Type9":
									updateTokenLighting(nBright*2,nDim*2, "#a2642a", "0.3", 60, "torch", 10, 3);
									break;
							}
						} else {
							// There is no oil to consume, signal and disable the button
							ChatMessage.create({
								user: game.user._id,
								speaker: game.actors.get(data.actorId),
								content: "No Oil (flask) in Inventory !"
							});
							disableTorchlightButton(tbuttonLantern);
						}
					}
				// Or are we dealing with the Torch Button
				} else if (tbutton === tbuttonTorch) {
					// Check if the token has the torch on
					if (statusTorch) {
						// The token has the torch on
						console.log("Clicked on the torch button when the torch is on.");
						statusTorch = false;
						await app.object.setFlag("torchlight", "statusTorch", false);
						tbuttonTorch.removeClass("active");
						// Torch is inactive, enable the relevant light sources according to parameters
						await enableRelevantButtons();
						// Restore the initial light source
						updateTokenLighting(
							app.object.getFlag("torchlight", "InitialBrightRadius"),
							app.object.getFlag("torchlight", "InitialDimRadius"),
							app.object.getFlag("torchlight", "InitialLightColor"),
							app.object.getFlag("torchlight", "InitialColorIntensity"),
							app.object.getFlag("torchlight", "InitialLightAngle"),
							app.object.getFlag("torchlight", "InitialAnimationType"),
							app.object.getFlag("torchlight", "InitialAnimationSpeed"),
							app.object.getFlag("torchlight", "InitialAnimationIntensity"),
						);
					} else {
						// The token does not have the torch on
						console.log("Clicked on the torch when the torch is off.");
						// Checks whether the character can consume a torch
						if (consumeItem("Torch")) {
							statusTorch = true;
							await app.object.setFlag("torchlight", "statusTorch", true);
							tbuttonTorch.addClass("active");
							// Torch is active, disable the other light sources
							disableTorchlightButton(tbuttonLight);
							disableTorchlightButton(tbuttonLantern);
							// Store the lighting for later restoration
							storeTokenLighting();
							// Enable the Torch Source according to the type
							let nBright = game.settings.get("torchlight", "torchBrightRadius");
							let nDim    = game.settings.get("torchlight", "torchDimRadius");
							let nType   = game.settings.get("torchlight", "torchType");
							switch (nType){
								case "Type0":
									updateTokenLighting(nBright,nDim, "#a2642a", "0.7", 360, "none", 5, 7);
									break;
								case "Type1":
									updateTokenLighting(nBright,nDim, "#a2642a", "0.7", 360, "torch", 5, 7);
									break;
								case "Type2":
									updateTokenLighting(nBright,nDim, "#a2642a", "0.5", 360, "torch", 5, 5);
									break;
								case "Type3":
									updateTokenLighting(nBright,nDim, "#a2642a", "0.3", 360, "torch", 5, 3);
									break;
								case "Type4":
									updateTokenLighting(nBright,nDim, "#a22a2a", "0.7", 360, "torch", 5, 7);
									break;
								case "Type5":
									updateTokenLighting(nBright,nDim, "#a22a2a", "0.5", 360, "torch", 5, 5);
									break;
								case "Type6":
									updateTokenLighting(nBright,nDim, "#a22a2a", "0.3", 360, "torch", 5, 3);
									break;
								case "Type7":
									updateTokenLighting(nBright,nDim, "#822aa2", "0.7", 360, "torch", 5, 7);
									break;
								case "Type8":
									updateTokenLighting(nBright,nDim, "#822aa2", "0.5", 360, "torch", 5, 5);
									break;
								case "Type9":
									updateTokenLighting(nBright,nDim, "#822aa2", "0.3", 360, "torch", 5, 3);
									break;
							}
						} else {
							// There is no torch to consume, signal and disable the button
							ChatMessage.create({
								user: game.user._id,
								speaker: game.actors.get(data.actorId),
								content: "No Torch in Inventory !"
							});
							disableTorchlightButton(tbuttonTorch);
						}
					}
				}
			});
		}

		// Visually and functionally disable a torchlight button
		function disableTorchlightButton(tbutton) {
			tbutton.find('i').addClass('fa-disabled');
			tbutton.find('i').off( "click" );
			tbutton.removeClass("active");
		}


		// Enable or disable buttons according to parameters
		function enableRelevantButtons() {

			// Stores if checks need to be made to enable buttons
			let noCheck = game.system.id !== 'dnd5e';
			if (!noCheck)
				noCheck = (data.isGM && !game.settings.get("torchlight", "dmAsPlayer")) || !game.settings.get("torchlight", "checkAvailability");

			if (noCheck || canCastLight())
				enableTorchlightButton(tbuttonLight);
			else
				disableTorchlightButton(tbuttonLight);

			if (noCheck || (hasItemInInventory("Oil (flask)") && (hasItemInInventory("Lantern, Hooded") || hasItemInInventory("Lantern, Bullseye"))))
				enableTorchlightButton(tbuttonLantern);
			else
				disableTorchlightButton(tbuttonLantern);

			if (noCheck || hasItemInInventory("Torch"))
				enableTorchlightButton(tbuttonTorch);
			else
				disableTorchlightButton(tbuttonTorch);

		}


		// Update the relevant light parameters of a token
		function updateTokenLighting(brightLight, dimLight, lightColor, colorIntensity, lightAngle, animationType, animationSpeed, animationIntensity) {
				const lightEffect = {
					"type": animationType,
					"speed": animationSpeed,
					"intensity": animationIntensity
				};
			app.object.update({
				brightLight: brightLight,
				dimLight: dimLight,
				lightColor: lightColor,
				lightAlpha: (colorIntensity * colorIntensity),
				lightAngle: lightAngle,
				"lightAnimation": lightEffect
			});
		}

		// Store the initial status of illumination for the token to restore if all light sources are extinguished
		function storeTokenLighting() {
			app.object.setFlag("torchlight", "InitialBrightRadius", app.object.data.brightLight);
			app.object.setFlag("torchlight", "InitialDimRadius", app.object.data.dimLight);
			app.object.setFlag("torchlight", "InitialLightColor", app.object.light.color);
			if (app.object.light.animation === undefined)
				app.object.setFlag("torchlight", "InitialColorIntensity", 0.5);
			else
				app.object.setFlag("torchlight", "InitialColorIntensity", app.object.light.alpha);
			app.object.setFlag("torchlight", "InitialLightAngle", app.object.light.angle);
			if (app.object.light.animation === undefined) {
				app.object.setFlag("torchlight", "InitialAnimationType", "none");
				app.object.setFlag("torchlight", "InitialAnimationSpeed", 5);
				app.object.setFlag("torchlight", "InitialAnimationIntensity", 5);
			} else {
				app.object.setFlag("torchlight", "InitialAnimationType", app.object.light.animation.type);
				app.object.setFlag("torchlight", "InitialAnimationSpeed", app.object.light.animation.speed);
				app.object.setFlag("torchlight", "InitialAnimationIntensity", app.object.light.animation.intensity);
			}

			console.log("Stored brightRadius:" + app.object.getFlag("torchlight", "InitialBrightRadius"));
			console.log("Stored dimRadius:" + app.object.getFlag("torchlight", "InitialDimRadius"));
			console.log("Stored lightColor:" + app.object.getFlag("torchlight", "InitialLightColor"));
			console.log("Stored light.alpha:" + app.object.getFlag("torchlight", "InitialColorIntensity"));
			console.log("Stored dimRadius:" + app.object.getFlag("torchlight", "InitialLightAngle"));
			console.log("Stored animation.type:" + app.object.getFlag("torchlight", "InitialAnimationType"));
			console.log("Stored animation.speed:" + app.object.getFlag("torchlight", "InitialAnimationSpeed"));
			console.log("Stored animation.intensity:" + app.object.getFlag("torchlight", "InitialAnimationIntensity"));
		}

		// Define all three buttons
		//let tbuttonLight   = $(`<div class="control-icon torchlight"><i class="fas fa-sun"></i></div>`);
		//let tbuttonLantern = $(`<div class="control-icon torchlight"><i class="fas fa-lightbulb"></i></div>`);
		//let tbuttonTorch   = $(`<div class="control-icon torchlight"><i class="fas fa-fire"></i></div>`);
		let tbuttonLight   = $(`<div class="control-icon torchlight" title="Toggle Light Spell"><i class="fas fa-sun"></i></div>`);
		let tbuttonLantern = $(`<div class="control-icon torchlight" title="Toggle Lantern"><i class="fas fa-lightbulb"></i></div>`);
		let tbuttonTorch   = $(`<div class="control-icon torchlight" title="Toggle Torch"><i class="fas fa-fire"></i></div>`);

		// Get the position of the column
		let position = game.settings.get('torchlight', 'position');

		// Create the column
		let buttonsdiv =  $(`<div class="col torchlight-column-${position}"></div>`);

/*
		// Wrap the previous icons
		let newdiv = '<div class="torchlight-container"></div>';
		html.find('.col.left').wrap(newdiv);

		// Add the column
		html.find('.col.left').before(buttonsdiv);
*/

		// Wrap the previous icons
		let newdiv = '<div class="torchlight-container"></div>';
		html.find('.col.left').before(newdiv);

		// Add the column
		html.find('.torchlight-container').prepend(buttonsdiv);


		console.log("Initialisation");

		// Get the status of the three types of lights
		let statusLight = app.object.getFlag("torchlight", "statusLight");
		//console.log("Initial statusLight:" + statusLight);
		if (statusLight == undefined || statusLight == null) {
			statusLight = false;
			await app.object.setFlag("torchlight", "statusLight", false);
		}
		let statusLantern = app.object.getFlag("torchlight", "statusLantern");
		//console.log("Initial statusLantern:" + statusLantern);
		if (statusLantern == undefined || statusLantern == null) {
			statusLantern = false;
			await app.object.setFlag("torchlight", "statusLantern", false);
		}
		let statusTorch = app.object.getFlag("torchlight", "statusTorch");
		//console.log("Initial statusTorch:" + statusTorch);
		if (statusTorch == undefined || statusTorch == null) {
			statusTorch = false;
			await app.object.setFlag("torchlight", "statusTorch", false);
		}
		//console.log("Initialised statusLight:" + statusLight);
		//console.log("Initialised statusLantern:" + statusLantern);
		//console.log("Initialised statusTorch:" + statusTorch);

		// Initial button state when the HUD comes up
		if (statusLight) tbuttonLight.addClass("active");
		if (statusLantern) tbuttonLantern.addClass("active");

		// Check the permissions to manage the lights
		if (data.isGM === true || game.settings.get("torchlight", "playerActivation") === true) {

			// If the a specific light is on, enable only that light otherwise enable all three of them
			if (statusLight) {
				enableTorchlightButton(tbuttonLight);
				disableTorchlightButton(tbuttonLantern);
				disableTorchlightButton(tbuttonTorch);
				tbuttonLight.addClass("active");
			} else if (statusLantern) {
				disableTorchlightButton(tbuttonLight);
				enableTorchlightButton(tbuttonLantern);
				disableTorchlightButton(tbuttonTorch);
				tbuttonLantern.addClass("active");
			} else if (statusTorch) {
				disableTorchlightButton(tbuttonLight);
				disableTorchlightButton(tbuttonLantern);
				enableTorchlightButton(tbuttonTorch);
				tbuttonTorch.addClass("active");
			} else
				enableRelevantButtons();
		} else {
			// If no permission exists, disable all the buttons
			//tbuttonLight.find('i').addClass('fa-disabled');
			//tbuttonLantern.find('i').addClass('fa-disabled');
			//tbuttonTorch.find('i').addClass('fa-disabled');
			disableTorchlightButton(tbuttonLight);
			disableTorchlightButton(tbuttonLantern);
			disableTorchlightButton(tbuttonTorch);
		}


		// Returns true if the character can use the Light spell
		// This also returns true if the game system is not D&D 5e...
		function canCastLight() {
			let actor = game.actors.get(data.actorId);
			if (actor === undefined)
				return false;
			let hasLight = false;
			actor.data.items.forEach(item => {
				if (item.type === 'spell') {
					if (item.name === 'Light')
						hasLight = true;
				}
			});
			return hasLight;
		}

		// Returns true if the character has a specific item in his inventory
		// This also returns true if the game system is not D&D 5e...
		function hasItemInInventory(itemToCheck) {
			let actor = game.actors.get(data.actorId);
			if (actor === undefined)
				return false;
			let hasItem = false;
			actor.data.items.forEach(item => {
				if (item.name.toLowerCase() === itemToCheck.toLowerCase()) {
					if (item.data.quantity > 0)
						hasItem = true;
				}
			});
			return hasItem;
		}

		// Returns true if either the character does not need to consume an item
		// or if he can indeed consume it (and it is actually consumed)
		function consumeItem(itemToCheck) {
			let consume = game.system.id !== 'dnd5e';
			if (!consume)
				consume = (data.isGM && !game.settings.get("torchlight", "dmAsPlayer")) ||
								!game.settings.get("torchlight", "checkAvailability") ||
								!game.settings.get("torchlight", "consumeItem");
			if (!consume) {
				let actor = game.actors.get(data.actorId);
				if (actor === undefined)
					return false;
				let hasItem = false;
				actor.data.items.forEach((item, offset) => {
					if (item.name.toLowerCase() === itemToCheck.toLowerCase()) {
						if (item.data.quantity > 0) {
							hasItem = true;
							actor.updateOwnedItem({"_id": actor.data.items[offset]._id, "data.quantity": actor.data.items[offset].data.quantity - 1});
						}
					}
				});
				consume = hasItem
			}
			return consume;
		}

		/*
		 * Returns the first GM id.
		 */
		function firstGM() {
			let i;

			for (i=0; i<game.users.entities.length; i++) {
				if (game.users.entities[i].data.role >= 4 && game.users.entities[i].active)
					return game.users.entities[i].data._id;
			}
			ui.notifications.error("No GM available for Dancing Lights!");
		}

		async function sendRequest(req) {
			req.sceneId = canvas.scene._id
			req.tokenId = app.object.id;

			if (!data.isGM) {
				req.addressTo = firstGM();
				game.socket.emit("module.torch", req);
			}
			else {
				TorchLight.handleSocketRequest(req);
			}
		}

		// Finally insert the buttons in the column
		html.find('.col.torchlight-column-'+position).prepend(tbuttonTorch);
		html.find('.col.torchlight-column-'+position).prepend(tbuttonLantern);
		html.find('.col.torchlight-column-'+position).prepend(tbuttonLight);
	}

	static async handleSocketRequest(req) {
		if (req.addressTo === undefined || req.addressTo === game.user._id) {
			let scn = game.scenes.get(req.sceneId);
			let tkn = scn.data.tokens.find(({_id}) => _id === req.tokenId);
			let dltoks=[];

			switch(req.requestType) {
				case 'removeDancingLights':
					scn.data.tokens.forEach(tok => {
						if (tok.actorId === tkn.actorId &&
						    tok.name === 'Dancing Light' &&
						    tok.dimLight === 20 &&
						    tok.brightLight === 10) {
							//let dltok = canvas.tokens.get(tok._id);
							dltoks.push(scn.getEmbeddedEntity("Token", tok._id)._id);
						}
					});
					await scn.deleteEmbeddedEntity("Token", dltoks);
					break;
			}
		}
	}
}

Hooks.on('ready', () => {
	Hooks.on('renderTokenHUD', (app, html, data) => { TorchLight.addTorchLightButtons(app, html, data) });
	Hooks.on('renderControlsReference', (app, html, data) => {
		html.find('div').first().append('<h3>TorchLight</h3><ol class="hotkey-list"><li><h4>'+
			game.i18n.localize("torchlight.turnOffAllLights")+
			'</h4><div class="keys">'+
			game.i18n.localize("torchlight.holdCtrlOnClick")+
			'</div></li></ol>');
	});
	game.socket.on("module.torch", request => {
		TorchLight.handleSocketRequest(request);
	});
});
Hooks.once("init", () => {
	game.settings.register('torchlight', 'position', {
		name: game.i18n.localize("torchlight.position.name"),
		hint: game.i18n.localize("torchlight.position.hint"),
		scope: "world",
		config: true,
		type: String,
		default: "left",
		choices: {
			"left": game.i18n.localize("torchlight.position.left"),
			"right": game.i18n.localize("torchlight.position.right"),
			"top": game.i18n.localize("torchlight.position.top"),
			"bottom": game.i18n.localize("torchlight.position.bottom"),
		}
	});
	game.settings.register("torchlight", "playerActivation", {
		name: game.i18n.localize("torchlight.playerActivation.name"),
		hint: game.i18n.localize("torchlight.playerActivation.hint"),
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});

	if (game.system.id === 'dnd5e') {
		game.settings.register("torchlight", "checkAvailability", {
			name: game.i18n.localize("torchlight.checkAvailability.name"),
			hint: game.i18n.localize("torchlight.checkAvailability.hint"),
			scope: "world",
			config: true,
			default: true,
			type: Boolean
		});
		game.settings.register("torchlight", "consumeItem", {
			name: game.i18n.localize("torchlight.consumeItem.name"),
			hint: game.i18n.localize("torchlight.consumeItem.hint"),
			scope: "world",
			config: true,
			default: true,
			type: Boolean
		});
		game.settings.register("torchlight", "dmAsPlayer", {
			name: game.i18n.localize("torchlight.dmAsPlayer.name"),
			hint: game.i18n.localize("torchlight.dmAsPlayer.hint"),
			scope: "world",
			config: true,
			default: false,
			type: Boolean
		});
	}

	// Light Parameters
	game.settings.register("torchlight", "lightBrightRadius", {
		name: game.i18n.localize("torchlight.lightBrightRadius.name"),
		hint: game.i18n.localize("torchlight.lightBrightRadius.hint"),
		scope: "world",
		config: true,
		default: 20,
		type: Number
	});
	game.settings.register("torchlight", "lightDimRadius", {
		name: game.i18n.localize("torchlight.lightDimRadius.name"),
		hint: game.i18n.localize("torchlight.lightDimRadius.hint"),
		scope: "world",
		config: true,
		default: 40,
		type: Number
	});
	game.settings.register('torchlight', 'lightType', {
		name: game.i18n.localize("torchlight.lightType.name"),
		hint: game.i18n.localize("torchlight.lightType.hint"),
		scope: "world",
		config: true,
		type: String,
		default: "Type1",
		choices: {
			"Type0": game.i18n.localize("torchlight.lightType.type0"),
			"Type1": game.i18n.localize("torchlight.lightType.type1"),
			"Type2": game.i18n.localize("torchlight.lightType.type2"),
			"Type3": game.i18n.localize("torchlight.lightType.type3"),
			"Type4": game.i18n.localize("torchlight.lightType.type4"),
			"Type5": game.i18n.localize("torchlight.lightType.type5"),
			"Type6": game.i18n.localize("torchlight.lightType.type6"),
			"Type7": game.i18n.localize("torchlight.lightType.type7"),
			"Type8": game.i18n.localize("torchlight.lightType.type8"),
			"Type9": game.i18n.localize("torchlight.lightType.type9"),
			"Type10": game.i18n.localize("torchlight.lightType.type10"),
			"Type11": game.i18n.localize("torchlight.lightType.type11"),
			"Type12": game.i18n.localize("torchlight.lightType.type12"),
			"Type13": game.i18n.localize("torchlight.lightType.type13"),
			"Type14": game.i18n.localize("torchlight.lightType.type14"),
			"Type15": game.i18n.localize("torchlight.lightType.type15"),
		}
	});


	// Lantern Parameters
	game.settings.register("torchlight", "lanternBrightRadius", {
		name: game.i18n.localize("torchlight.lanternBrightRadius.name"),
		hint: game.i18n.localize("torchlight.lanternBrightRadius.hint"),
		scope: "world",
		config: true,
		default: 20,
		type: Number
	});
	game.settings.register("torchlight", "lanternDimRadius", {
		name: game.i18n.localize("torchlight.lanternDimRadius.name"),
		hint: game.i18n.localize("torchlight.lanternDimRadius.hint"),
		scope: "world",
		config: true,
		default: 40,
		type: Number
	});
	game.settings.register('torchlight', 'lanternType', {
		name: game.i18n.localize("torchlight.lanternType.name"),
		hint: game.i18n.localize("torchlight.lanternType.hint"),
		scope: "world",
		config: true,
		type: String,
		default: "Type1",
		choices: {
			"Type0": game.i18n.localize("torchlight.lanternType.type0"),
			"Type1": game.i18n.localize("torchlight.lanternType.type1"),
			"Type2": game.i18n.localize("torchlight.lanternType.type2"),
			"Type3": game.i18n.localize("torchlight.lanternType.type3"),
			"Type4": game.i18n.localize("torchlight.lanternType.type4"),
			"Type5": game.i18n.localize("torchlight.lanternType.type5"),
			"Type6": game.i18n.localize("torchlight.lanternType.type6"),
			"Type7": game.i18n.localize("torchlight.lanternType.type7"),
			"Type8": game.i18n.localize("torchlight.lanternType.type8"),
			"Type9": game.i18n.localize("torchlight.lanternType.type9"),
		}
	});
	if (game.system.id === 'dnd5e') {
		game.settings.register("torchlight", "nameConsumableLantern", {
			name: game.i18n.localize("torchlight.nameConsumableLantern.name"),
			hint: game.i18n.localize("torchlight.nameConsumableLantern.hint"),
			scope: "world",
			config: true,
			default: "Oil (flask)",
			type: String
		});
	}

	// Torch Parameters
	game.settings.register("torchlight", "torchBrightRadius", {
		name: game.i18n.localize("torchlight.torchBrightRadius.name"),
		hint: game.i18n.localize("torchlight.torchBrightRadius.hint"),
		scope: "world",
		config: true,
		default: 20,
		type: Number
	});
	game.settings.register("torchlight", "torchDimRadius", {
		name: game.i18n.localize("torchlight.torchDimRadius.name"),
		hint: game.i18n.localize("torchlight.torchDimRadius.hint"),
		scope: "world",
		config: true,
		default: 40,
		type: Number
	});
	game.settings.register('torchlight', 'torchType', {
		name: game.i18n.localize("torchlight.torchType.name"),
		hint: game.i18n.localize("torchlight.torchType.hint"),
		scope: "world",
		config: true,
		type: String,
		default: "Type1",
		choices: {
			"Type0": game.i18n.localize("torchlight.torchType.type0"),
			"Type1": game.i18n.localize("torchlight.torchType.type1"),
			"Type2": game.i18n.localize("torchlight.torchType.type2"),
			"Type3": game.i18n.localize("torchlight.torchType.type3"),
			"Type4": game.i18n.localize("torchlight.torchType.type4"),
			"Type5": game.i18n.localize("torchlight.torchType.type5"),
			"Type6": game.i18n.localize("torchlight.torchType.type6"),
			"Type7": game.i18n.localize("torchlight.torchType.type7"),
			"Type8": game.i18n.localize("torchlight.torchType.type8"),
			"Type9": game.i18n.localize("torchlight.torchType.type9"),
		}
	});
	if (game.system.id === 'dnd5e') {
		game.settings.register("torchlight", "nameConsumableTorch", {
			name: game.i18n.localize("torchlight.nameConsumableTorch.name"),
			hint: game.i18n.localize("torchlight.nameConsumableTorch.hint"),
			scope: "world",
			config: true,
			default: "Torch",
			type: String
		});
	}
});

console.log("--- Flame on!");
