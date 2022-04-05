![](https://img.shields.io/badge/Maintainer-Malekal-green)
My discord server: https://discord.gg/Ee2cmeRsN3
# LightsHUD - A FoundryVTT Module

Derived and updated version of Torchlight, which in turn was derived from Torch.

Dnd5e AND PF2e are now both supported for availability check and consumption.

## Known Issues
* When using french locale, there seems to be a conflict when using LightsHUD & Minimal UI with pf2 system.

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
- Extract the contents of the zip in `{USER_DATA_PATH}\data\modules\`
- Restart Foundry.

### Examples

##### HUD with TorchLight Icons
![](./assets/HUDwithTorchLightIcons.png)

##### Light Spell Activated
![](./assets/LightSpellActivated.png)

All the lights are animated and look much better "live".

## Implemented Features
* 3 Dedicated buttons on the token's HUD, Spell-like Light ability, Lantern and Torch.
* Module settings with presets and custom types.
* Optional Availability check for resource.
* Optional Torch and Lantern resource consomption for DnD5e and PF2e.
* Toggle Player access to HUD icons.
* Toggle Storing existing token light data.


## Planned Features
- Better settings, I feel the current presentation and layout are not easy to read or work with.
- Presets in JSON file, to be imported/exported.
- Rework of the code behind the scene to make it more polymorphic.
- More options in the HUD's display (Kill existing light on token?)

## License
The source code is licensed under "THE BEER-WARE LICENSE" (Revision 42).
