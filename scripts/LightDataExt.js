export class LightDataExt extends foundry.data.LightData {
  name;
  tokenID;
  type;
  state;

  constructor(name, type, state, app) {
    super();
    this.name = name ?? "SampleName";
    this.type = type ?? "LightType";
    this.state = state ?? "false";
    this.tokenID = app.object.id;
    this._initFlag(app);
  };

  async _initFlag(app){
    this.state = app.object.document.getFlag("LightsHUD", this._getFlagName()) ?? false;
    await app.object.document.setFlag("LightsHUD",this._getFlagName(),this.state);
  };

  _getFlagName(){
    return this.name + this.type;
  };

  async turnOff() {
    this.state = false;
    await game.actor.setFlag("LightsHUD", _getFlagName(), false);
    tbuttonLantern.removeClass("active");
    // Lantern is inactive, enable the relevant light sources according to parameters
    enableRelevantButtons();
    // Restore the initial light source
    updateTokenLighting(
      tokenD.getFlag("LightsHUD", "InitialBrightRadius"),
      tokenD.getFlag("LightsHUD", "InitialDimRadius"),
      tokenD.getFlag("LightsHUD", "InitialLightColor"),
      tokenD.getFlag("LightsHUD", "InitialColorIntensity"),
      tokenD.getFlag("LightsHUD", "Initiallight.angle"),
      tokenD.getFlag("LightsHUD", "InitialAnimationType"),
      tokenD.getFlag("LightsHUD", "InitialAnimationSpeed"),
      tokenD.getFlag("LightsHUD", "InitialAnimationIntensity")
    );
  }
}


