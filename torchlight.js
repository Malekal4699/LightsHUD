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
				console.log("Clicked on a Button.");
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
						// Light is inactive, enable the other light sources
						enableTorchlightButton(tbuttonLantern);
						enableTorchlightButton(tbuttonTorch);
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
							case "Type1":
								updateTokenLighting(nBright,nDim, "#ffffff", "0.5", 360, "torch", 5, 5);
								break;
							case "Type2":
								updateTokenLighting(nBright,nDim, "#ffffff", "0.5", 360, "chroma", 5, 5);
								break;
							case "Type3":
								updateTokenLighting(nBright,nDim, "#ffffff", "0.5", 360, "emanation", 5, 5);
								break;
							case "Type4":
								updateTokenLighting(nBright,nDim, "#ffffff", "0.5", 360, "ghost", 5, 5);
								break;
							case "Type5":
								updateTokenLighting(nBright,nDim, "#ff0000", "0.5", 360, "torch", 5, 5);
								break;
							case "Type6":
								updateTokenLighting(nBright,nDim, "#ff0000", "0.5", 360, "chroma", 5, 5);
								break;
							case "Type7":
								updateTokenLighting(nBright,nDim, "#ff0000", "0.5", 360, "emanation", 5, 5);
								break;
							case "Type8":
								updateTokenLighting(nBright,nDim, "#ff0000", "0.5", 360, "ghost", 5, 5);
								break;
							case "Type9":
								updateTokenLighting(nBright,nDim, "#00ff00", "0.5", 360, "torch", 5, 5);
								break;
							case "Type10":
								updateTokenLighting(nBright,nDim, "#00ff00", "0.5", 360, "chroma", 5, 5);
								break;
							case "Type11":
								updateTokenLighting(nBright,nDim, "#00ff00", "0.5", 360, "emanation", 5, 5);
								break;
							case "Type12":
								updateTokenLighting(nBright,nDim, "#00ff00", "0.5", 360, "ghost", 5, 5);
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
						// Lantern is inactive, enable the other light sources
						enableTorchlightButton(tbuttonLight);
						enableTorchlightButton(tbuttonTorch);
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
						// Torch is inactive, enable the other light sources
						enableTorchlightButton(tbuttonLight);
						enableTorchlightButton(tbuttonLantern);
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
					}
				}

			});
		}

		// Visually and functionally disable a torchlight button
		function disableTorchlightButton(tbutton) {
			tbutton.find('i').addClass('fa-disabled');
			tbutton.find('i').off( "click" );
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
		let tbuttonLight   = $(`<div class="control-icon torchlight"><i class="fas fa-sun"></i></div>`);
		let tbuttonLantern = $(`<div class="control-icon torchlight"><i class="fas fa-lightbulb"></i></div>`);
		let tbuttonTorch   = $(`<div class="control-icon torchlight"><i class="fas fa-fire"></i></div>`);

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
			} else {
				let noCheck = (data.isGM && !game.settings.get("torchlight", "dmAsPlayer")) || game.system.id !== 'dnd5e' || !game.settings.get("torchlight", "checkAvailability");
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


		/*
		 * Returns true if a torch can be used... ie:
		 * 1) If the user is the GM.
		 * 2) If the system is not dnd5e, and the playerActivation setting is enabled.
		 * 3) If a dnd5e player knows the Light spell.
		 * 4) if a dnd5e player has at least one torch in inventory
		 */
		function hasTorchLight() {
			let torches = null;

			if (game.system.id !== 'dnd5e') {
				if (game.settings.get("torchlight", "playerActivation"))
					torches = 'Player';
				if (data.isGM)
					torches = 'GM';
			}
			else {
				let actor = game.actors.get(data.actorId);
				if (actor === undefined)
					return false;
				if (!game.settings.get("torchlight", "checkAvailability"))
					torches = 'Player';
				actor.data.items.forEach(item => {
					if (item.type === 'spell') {
						if (item.name === 'Light') {
							torches = 'Light';
							return;
						}
						if (item.name === 'Dancing Lights') {
							torches = 'Dancing Lights';
							return;
						}
					}
					else {
						if (torches === null) {
							var itemToCheck = game.settings.get("torchlight", "gmInventoryItemName");
							if (item.name.toLowerCase() === itemToCheck.toLowerCase()) {
								if (item.data.quantity > 0) {
									torches = itemToCheck;
									return;
								}
							}
						}
					}
				});
				if (torches === null && data.isGM)
					torches = 'GM';
			}
			return torches;
		}

		/*
		 * Performs inventory tracking for torch uses.  Deducts one
		 * torch from inventory if all of the following are true:
		 * 1) The system is dnd5e.
		 * 2) The player doesn't know the Light spell.
		 * 3) The player has at least one torch.
		 * 4) The user is not the GM or the gmUsesInventory setting is enabled.
		 */
		async function useTorchLight() {
			let torch = -1;

			if (data.isGM && !game.settings.get("torch", "gmUsesInventory"))
				return;
			if (game.system.id !== 'dnd5e')
				return;
			let actor = game.actors.get(data.actorId);
			if (actor === undefined)
				return;

			// First, check for the light cantrip...
			actor.data.items.forEach((item, offset) => {
				if (item.type === 'spell') {
					if (item.name === 'Light') {
						torch = -2;
						return;
					}
					if (item.name === 'Dancing Lights') {
						torch = -3;
						return;
					}
				}
				else {
					var itemToCheck = game.settings.get("torch", "gmInventoryItemName");
					if (torch === -1 && item.name.toLowerCase() === itemToCheck.toLowerCase() && item.data.quantity > 0) {
						torch = offset;
					}
				}
			});
			if (torch < 0)
				return;

			// Now, remove a torch from inventory...
			await actor.updateOwnedItem({"_id": actor.data.items[torch]._id, "data.quantity": actor.data.items[torch].data.quantity - 1});
		}


		if (false) {
		//if (data.isGM === true || game.settings.get("torchlight", "playerActivation") === true) {
			let dimRadius = game.settings.get("torchlight", "dimRadius");
			let brightRadius = game.settings.get("torchlight", "brightRadius");
			//let tbutton = $(`<div class="control-icon torch"><i class="fas fa-fire"></i></div>`);
			let allowEvent = true;
			let ht = hasTorchLight();
			let oldTorch = app.object.getFlag("torchlight", "oldValue");
			let newTorch = app.object.getFlag("torchlight", "newValue");

			// Clear torch flags if light has been changed somehow.
			if (newTorch !== undefined && newTorch !== null && newTorch !== 'Dancing Lights' && (newTorch !== data.brightLight + '/' + data.dimLight)) {
				await app.object.setFlag("torchlight", "oldValue", null);
				await app.object.setFlag("torchlight", "newValue", null);
				oldTorch = null;
				newTorch = null;
			}

			if (newTorch !== undefined && newTorch !== null) {
				// If newTorch is still set, light hasn't changed.
				tbuttonTorch.addClass("active");
			}
			else if ((data.brightLight >= brightRadius && data.dimLight >= dimRadius && ht !== 'Dancing Lights') || ht === null) {
				/*
				 * If you don't have a torch, *or* you're already emitting more light than a torch,
				 * disallow the torch button
				 */
				let disabledIcon = $(`<i class="fas fa-slash" style="position: absolute; color: tomato"></i>`);
				tbuttonTorch.addClass("fa-stack");
				tbuttonTorch.find('i').addClass('fa-stack-1x');
				disabledIcon.addClass('fa-stack-1x');
				tbuttonTorch.append(disabledIcon);
				allowEvent = false;
			}
			//html.find('.col.left').prepend(tbutton);
			if (allowEvent) {
				tbuttonTorch.find('i').click(async (ev) => {
					let btn = $(ev.currentTarget.parentElement);
					let dimRadius = game.settings.get("torchlight", "dimRadius");
					let brightRadius = game.settings.get("torchlight", "brightRadius");
					let oldTorch = app.object.getFlag("torchlight", "oldValue");
					let newTorch = app.object.getFlag("torchlight", "newValue");

					ev.preventDefault();
					ev.stopPropagation();
					if (ev.ctrlKey) {	// Forcing light off...
						data.brightLight = game.settings.get("torchlight", "offBrightRadius");
						data.dimLight = game.settings.get("torchlight", "offDimRadius");
						await app.object.setFlag("torchlight", "oldValue", null);
						await app.object.setFlag("torchlight", "newValue", null);
						await sendRequest({"requestType": "removeDancingLights"});
						btn.removeClass("active");
					}
					else if (oldTorch === null || oldTorch === undefined) {	// Turning light on...
						await app.object.setFlag("torchlight", "oldValue", data.brightLight + '/' + data.dimLight);
						if (ht === 'Dancing Lights') {
							await app.object.setFlag("torchlight", "newValue", 'Dancing Lights');
						}
						else {
							if (brightRadius > data.brightLight)
								data.brightLight = brightRadius;
							if (dimRadius > data.dimLight)
								data.dimLight = dimRadius;
							await app.object.setFlag("torchlight", "newValue", data.brightLight + '/' + data.dimLight);
						}
						btn.addClass("active");
						useTorchLight();
					}
					else { // Turning light off...
						if (newTorch === 'Dancing Lights') {
							await sendRequest({"requestType": "removeDancingLights"});
						}
						else {
							let thereBeLight = oldTorch.split('/');
							data.brightLight = parseFloat(thereBeLight[0]);
							data.dimLight = parseFloat(thereBeLight[1]);
						}
						await app.object.setFlag("torchlight", "newValue", null);
						await app.object.setFlag("torchlight", "oldValue", null);
						btn.removeClass("active");
					}
					await app.object.update({brightLight: data.brightLight, dimLight: data.dimLight});
				});
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

// Legacy Parameters
//	if (game.system.id === 'dnd5e') {
//		game.settings.register("torchlight", "gmInventoryItemName", {
//			name: game.i18n.localize("torchlight.gmInventoryItemName.name"),
//			hint: game.i18n.localize("torchlight.gmInventoryItemName.hint"),
//			scope: "world",
//			config: true,
//			default: "torch",
//			type: String
//		});
//	}
});

console.log("--- Flame on!");
