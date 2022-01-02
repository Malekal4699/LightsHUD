# LightsHUD - A FoundryVTT Module

Derived and updated version of Torchlight, which in turn was derived from Torch.

## Installation
### Method 1
- Start up Foundry and click "Install Module" in the "Add-On Modules" tab.
- Search for "LightsHUD" in the pop up window.
- Click "Install" and it should appear in your modules list.

### Method 2
- Start up Foundry and click "Install Module" in the "Add-On Modules" tab.
- Paste the link: "https://github.com/Malekal4699/LightsHUD/releases/latest/download/module.json",
- Click "Install" and it should appear in your modules list.

### Method 3
	
- Download the [.zip file]("https://github.com/Malekal4699/LightsHUD/releases/latest/download/module.zip") in this repository.
- Extract the contents of the zip in `{YOUR_DATA_FOLDER}\modules\`
- Restart Foundry.

### Examples

##### HUD with TorchLight Icons
![](./assets/HUDwithTorchLightIcons.png)

##### Light Spell Activated
![](./assets/LightSpellActivated.png)

All the lights are animated and look much better "live".

## Implemented Features
Torchlight provides 3 potential sources of light:
- Light Spell of varying aspects, with White Light (possibly for good characters), Red Light (probably not so good) and Green Light (for nature lovers out there, druids and rangers, I'm pointing at you)...
- Lantern, with hooded lanterns in both open and closed position, and bullseye lantern with enhanced range but only in a cone.
- Torch, with various colours and intensity
In addition to standard types of illumination, the module now allows to customise the light and animation for each of the three types of light. Note that, at this stage, I don't know how to make a color picker in the settings, to the light color has to be inserted using the #rrggbb format.

These are toggled on and off from the HUD of tokens, form three icons that can be positioned either to the left or to the right of the standard HUD. The icons are in the order Light >> Lantern >> Torch (top to bottom or left to right), and there are title texts (now, thanks for the suggestion and the way to implement, paullessing). Only one type of light source can be active at a given time, if you change your light source, simply deactivate the current one and activate the new one.

The DM can keep the activation/deactivation to himself (in which case the HUD of the players will just show whether there is a light source active) or he can delegate the management of the light to his player through an option of the module.

In addition, the options allow the independent configuration of the light sources:
- Range for bright and dim light
- Type of light emitted

At this stage, the module also has the option to check whether a character had the resources to create a light, casting the light spell, or having a torch, or a lantern with oil in his inventory. This is optional because very often (at least in our groups) the character bearing the light is not necessarily the one owning it or being able to cast it.

The check can be enabled for players, and the DM can also choose to have it made for him as well.

And there is another check, whether the resource is actually consumed when the light is lit. Finally, the name of the items to check and potentially consume is another parameter, with the default being "Torch" for a torch and "Oil (flask)" for a lantern, as these are the standard names from 5e.

## Tips and Tricks

Note that although it's not obvious from the description, the module really allows you to add different types of lights to different players. For example, you can easily set-up a hooded lantern on a token and a bullseye one on another token.

It just depends on the type selected for a given source of light, as set-up in the Module Settings. The type of light can be changed there, of course, but it's also very easy to set using a macro:
* game.settings.set('torchlight', 'lightType','Type1') for a white light spell
* game.settings.set('torchlight', 'lightType','Type5') for ared light spell
* game.settings.set('torchlight', 'lanternType','Type1') for an intense hooded lantern
* game.settings.set('torchlight', 'lanternType','Type7') for an intense bullseye lantern
* game.settings.set('torchlight', 'torchType','Type8') for an medium purplish torch
* etc.

## Planned Features
- TBD

## Known Issues
* The position of the icons needs to be adjusted according to the size of the token.

## License
The source code is licensed under "THE BEER-WARE LICENSE" (Revision 42).
