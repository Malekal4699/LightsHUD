CHANGELOG
===================================

## 0.10.8f
* #24 Tentative fix, unable to reproduce after code change and tests. Let me know if and how to reproduce.
* Added a new Setting: 
* Preserve light data : This setting turns on/off storing light data before activating a light with the HUD. This means that :

1. On: if you add a light effect from another module or modified manually, clicking on the HUD will store current light data, then activate light as configured in the settings. On deactivating the light via the HUD, stored data will be restored.
2. Off: Whatever the token's light was before, deactivation of the HUD Light will turn light off.

**Full Changelog**: https://github.com/Malekal4699/LightsHUD/compare/0.10.8a...0.10.8f

## 0.10.8
* 25 LightsHUD - Bug - No Setting for custom "Light spell" - Added setting.
* 34 LightsHUD - Bug - Presets incorrect - Corrected and somewhat streamlined presets.

## 0.10.7
* Adjust button positions based on token size. by @strongpauly in #31
* Adjust top and bottom button positions based on presence of attribute bars by @strongpauly in #32
* Only add active class when light source is active. by @strongpauly in #33

* Full Changelog: <a href="https://github.com/Malekal4699/LightsHUD/compare/0.10.6...0.10.7">0.10.6...0.10.7</a>

## 0.10.6
* Enable and disable custom inputs based on type. (#30) Co-authored-by: Paul Potsides <paul@koble.ai>

## 0.10.5
* Fixed #16 #8 #1 partially. 
* Known issue: Flags on linked tokens are set on the actor rather than the token.
* Special thanks to Martín Chaves (https://github.com/kiov) for the hardcoded name fixes.

## 0.10.4
* add japanese localization by @BrotherSharper in https://github.com/Malekal4699/LightsHUD/pull/9
* @BrotherSharper made their first contribution in https://github.com/Malekal4699/LightsHUD/pull/9

## 0.10.3
* Module name Changed.
* Added debug option. (It's verbose, don't check unless there is a need to or it is requested.)
* Console Module Name in Ascii art.

## 0.10.2
* Script upgraded to work with Foundry 0.9.x


