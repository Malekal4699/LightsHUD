/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <shurd@FreeBSD.ORG> wrote this file.  As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return.        Stephen Hurd
 * ----------------------------------------------------------------------------
 * <philippe@krait.net> updated this file.  As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and you
 * think this stuff is worth it, you can buy me a beer in return.     
 *                                                               Philippe Krait
 * ----------------------------------------------------------------------------
 * https://www.fontawesomecheatsheet.com/font-awesome-cheatsheet-5x/
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
						// Extinguish the Light source
						await app.object.update({brightLight: 0,
												dimLight: 0});
					} else {
						// The token does not have the light spell on
						console.log("Clicked on the light button when the light is off.");
						statusLight = true;
						await app.object.setFlag("torchlight", "statusLight", true);
						tbuttonLight.addClass("active");
						// Light is active, disable the other light sources
						disableTorchlightButton(tbuttonLantern);
						disableTorchlightButton(tbuttonTorch);
						// Enable the Light Source
						// "torch" / "pulse" / "chroma" / "wave" / "fog" / "sunburst" / "dome"
						// "emanation" / "hexa" / "ghost" / "energy" / "roiling" / "hole"
						//app.object.light.animation.type = "roiling";
						await app.object.update({brightLight: game.settings.get("torchlight", "lightBrightRadius"),
												dimLight: game.settings.get("torchlight", "lightDimRadius")
												
												});
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
						// Extinguish the Light source
						await app.object.update({brightLight: 0,
												dimLight: 0});
					} else {
						// The token does not have the lantern on
						console.log("Clicked on the lantern when the lantern is off.");
						statusLantern = true;
						await app.object.setFlag("torchlight", "statusLantern", true);
						tbuttonLantern.addClass("active");
						// Lantern is active, disable the other light sources
						disableTorchlightButton(tbuttonLight);
						disableTorchlightButton(tbuttonTorch);
						// Enable the Lantern Source
						//app.object.light.animation.type = "pulse";
						await app.object.update({brightLight: game.settings.get("torchlight", "lanternBrightRadius"),
												dimLight: game.settings.get("torchlight", "lanternDimRadius")
												
												});
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
						// Extinguish the Light source
						await app.object.update({brightLight: 0,
												dimLight: 0});
					} else {
						// The token does not have the torch on
						console.log("Clicked on the torch when the torch is off.");
						statusTorch = true;
						await app.object.setFlag("torchlight", "statusTorch", true);
						tbuttonTorch.addClass("active");
						// Torch is active, disable the other light sources
						disableTorchlightButton(tbuttonLight);
						disableTorchlightButton(tbuttonLantern);
						// Enable the Torch Source
						//app.object.light.animation.type = "torch";
						//await app.object.update({light.animation.type: "torch"});
						lightEffect = {
							'type': 'torch',
							'speed': 1,
							'intensity': 1
						};
						await app.object.update({brightLight: game.settings.get("torchlight", "torchBrightRadius"),
												 dimLight: game.settings.get("torchlight", "torchDimRadius"),
												 "lightAnimation": JSON.parse(lightEffect)
												});
					}
				}

			});
		}

		// Visually and functionally disable a torchlight button
		function disableTorchlightButton(tbutton) {
			tbutton.find('i').addClass('fa-disabled');
			tbutton.find('i').off( "click" );
		}

		// Define all three buttons
		let tbuttonLight   = $(`<div class="control-icon torchlight"><i class="fas fa-sun"></i></div>`);
		let tbuttonLantern = $(`<div class="control-icon torchlight"><i class="fas fa-lightbulb"></i></div>`);
		let tbuttonTorch   = $(`<div class="control-icon torchlight"><i class="fas fa-fire"></i></div>`);

		// Get the position of the column
		let position = game.settings.get('torchlight', 'position');

		// Create the column
		let buttonsdiv =  $(`<div class="col torchlight-column-${position}"></div>`);
		//buttonsdiv.appendChild(tbuttonLight);

		// Wrap the previous icons
		let newdiv = '<div class="torchlight-container"></div>';
		html.find('.col.left').wrap(newdiv);

		// Add the column
		html.find('.col.left').before(buttonsdiv);

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
		console.log("Initialised statusLight:" + statusLight);
		console.log("Initialised statusLantern:" + statusLantern);
		console.log("Initialised statusTorch:" + statusTorch);

		// If all light sources are off, store the initial status of illumination
		// for the token to restore if all light sources are extinguished
		if (!statusLight && !statusLantern && !statusTorch) {
			await app.object.setFlag("torchlight", "InitialEmitsLight", app.object.emitsLight);
			await app.object.setFlag("torchlight", "InitialBrightRadius", app.object.brightRadius);
			await app.object.setFlag("torchlight", "InitialDimRadius", app.object.dimRadius);
			await app.object.setFlag("torchlight", "InitialAnimationType", app.object.light.animation.type);
			console.log("Stored emitsLight:" + app.object.getFlag("torchlight", "InitialEmitsLight"));
			console.log("Stored brightRadius:" + app.object.getFlag("torchlight", "InitialBrightRadius"));
			console.log("Stored dimRadius:" + app.object.getFlag("torchlight", "InitialDimRadius"));
			console.log("Stored animationType:" + app.object.getFlag("torchlight", "InitialAnimationType"));
		}

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
			} else if (statusLantern) {
				disableTorchlightButton(tbuttonLight);
				enableTorchlightButton(tbuttonLantern);
				disableTorchlightButton(tbuttonTorch);
			} else if (statusTorch) {
				disableTorchlightButton(tbuttonLight);
				disableTorchlightButton(tbuttonLantern);
				enableTorchlightButton(tbuttonTorch);
			} else {
				enableTorchlightButton(tbuttonLight);
				enableTorchlightButton(tbuttonLantern);
				enableTorchlightButton(tbuttonTorch);
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

		async function createDancingLights() {
			let tkn = canvas.tokens.get(app.object.id);
			let voff = tkn.h;
			let hoff = tkn.w;
			let c = tkn.center;
			let v = game.settings.get("torchlight", "dancingLightVision")

			await canvas.scene.createEmbeddedEntity("Token", [
				{"actorData":{}, "actorId":tkn.actor._id, "actorLink":false, "bar1":{"attribute":""}, "bar2":{"attribute":""}, "brightLight":0, "brightSight":0, "dimLight":10, "dimSight":0, "displayBars":CONST.TOKEN_DISPLAY_MODES.NONE, "displayName":CONST.TOKEN_DISPLAY_MODES.HOVER, "disposition":CONST.TOKEN_DISPOSITIONS.FRIENDLY, "flags":{}, "height":1, "hidden":false, "img":"systems/dnd5e/icons/spells/light-air-fire-1.jpg", "lightAlpha":1, "lightAngle":360, "lockRotation":false, "mirrorX":false, "name":"Dancing Light", "randomimg":false, "rotation":0, "scale":0.25, "sightAngle":360, "vision":v, "width":1, "x":c.x - hoff, "y":c.y - voff},
				{"actorData":{}, "actorId":tkn.actor._id, "actorLink":false, "bar1":{"attribute":""}, "bar2":{"attribute":""}, "brightLight":0, "brightSight":0, "dimLight":10, "dimSight":0, "displayBars":CONST.TOKEN_DISPLAY_MODES.NONE, "displayName":CONST.TOKEN_DISPLAY_MODES.HOVER, "disposition":CONST.TOKEN_DISPOSITIONS.FRIENDLY, "flags":{}, "height":1, "hidden":false, "img":"systems/dnd5e/icons/spells/light-air-fire-1.jpg", "lightAlpha":1, "lightAngle":360, "lockRotation":false, "mirrorX":false, "name":"Dancing Light", "randomimg":false, "rotation":0, "scale":0.25, "sightAngle":360, "vision":v, "width":1, "x":c.x, "y":c.y - voff},
				{"actorData":{}, "actorId":tkn.actor._id, "actorLink":false, "bar1":{"attribute":""}, "bar2":{"attribute":""}, "brightLight":0, "brightSight":0, "dimLight":10, "dimSight":0, "displayBars":CONST.TOKEN_DISPLAY_MODES.NONE, "displayName":CONST.TOKEN_DISPLAY_MODES.HOVER, "disposition":CONST.TOKEN_DISPOSITIONS.FRIENDLY, "flags":{}, "height":1, "hidden":false, "img":"systems/dnd5e/icons/spells/light-air-fire-1.jpg", "lightAlpha":1, "lightAngle":360, "lockRotation":false, "mirrorX":false, "name":"Dancing Light", "randomimg":false, "rotation":0, "scale":0.25, "sightAngle":360, "vision":v, "width":1, "x":c.x - hoff, "y":c.y},
				{"actorData":{}, "actorId":tkn.actor._id, "actorLink":false, "bar1":{"attribute":""}, "bar2":{"attribute":""}, "brightLight":0, "brightSight":0, "dimLight":10, "dimSight":0, "displayBars":CONST.TOKEN_DISPLAY_MODES.NONE, "displayName":CONST.TOKEN_DISPLAY_MODES.HOVER, "disposition":CONST.TOKEN_DISPOSITIONS.FRIENDLY, "flags":{}, "height":1, "hidden":false, "img":"systems/dnd5e/icons/spells/light-air-fire-1.jpg", "lightAlpha":1, "lightAngle":360, "lockRotation":false, "mirrorX":false, "name":"Dancing Light", "randomimg":false, "rotation":0, "scale":0.25, "sightAngle":360, "vision":v, "width":1, "x":c.x, "y":c.y}],
				{"temporary":false, "renderSheet":false});
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
							await createDancingLights();
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
	game.settings.register("torchlight", "checkAvailability", {
		name: game.i18n.localize("torchlight.checkAvailability.name"),
		hint: game.i18n.localize("torchlight.checkAvailability.hint"),
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
	if (game.system.id === 'dnd5e') {
		game.settings.register("torchlight", "gmUsesInventory", {
			name: game.i18n.localize("torchlight.gmUsesInventory.name"),
			hint: game.i18n.localize("torchlight.gmUsesInventory.hint"),
			scope: "world",
			config: true,
			default: false,
			type: Boolean
		});

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
		default: "left",
		choices: {
			"Type1": game.i18n.localize("torchlight.lightType.type1"),
			"Type2": game.i18n.localize("torchlight.lightType.type2"),
			"Type3": game.i18n.localize("torchlight.lightType.type3"),
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
		default: "left",
		choices: {
			"Type1": game.i18n.localize("torchlight.lanternType.type1"),
			"Type2": game.i18n.localize("torchlight.lanternType.type2"),
			"Type3": game.i18n.localize("torchlight.lanternType.type3"),
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
		default: "left",
		choices: {
			"Type1": game.i18n.localize("torchlight.torchType.type1"),
			"Type2": game.i18n.localize("torchlight.torchType.type2"),
			"Type3": game.i18n.localize("torchlight.torchType.type3"),
		}
	});

// Legacy Parameters
		game.settings.register("torchlight", "gmInventoryItemName", {
			name: game.i18n.localize("torchlight.gmInventoryItemName.name"),
			hint: game.i18n.localize("torchlight.gmInventoryItemName.hint"),
			scope: "world",
			config: true,
			default: "torch",
			type: String
		});
	}
	game.settings.register("torchlight", "brightRadius", {
		name: game.i18n.localize("LIGHT.LightBright"),
		hint: game.i18n.localize("torchlight.brightRadius.hint"),
		scope: "world",
		config: true,
		default: 20,
		type: Number
	});
	game.settings.register("torchlight", "dimRadius", {
		name: game.i18n.localize("LIGHT.LightDim"),
		hint: game.i18n.localize("torchlight.dimRadius.hint"),
		scope: "world",
		config: true,
		default: 40,
		type: Number
	});
	game.settings.register("torchlight", "offBrightRadius", {
		name: game.i18n.localize("torchlight.offBrightRadius.name"),
		hint: game.i18n.localize("torchlight.offBrightRadius.hint"),
		scope: "world",
		config: true,
		default: 0,
		type: Number
	});
	game.settings.register("torchlight", "offDimRadius", {
		name: game.i18n.localize("torchlight.offDimRadius.name"),
		hint: game.i18n.localize("torchlight.offDimRadius.hint"),
		scope: "world",
		config: true,
		default: 0,
		type: Number
	});
	game.settings.register("torchlight", "dancingLightVision", {
		name: game.i18n.localize("torchlight.dancingLightVision.name"),
		hint: game.i18n.localize("torchlight.dancingLightVision.hint"),
		scope: "world",
		config: true,
		default: false,
		type: Boolean
	});
});

console.log("--- Flame on!");
