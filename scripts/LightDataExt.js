export class LightDataExt extends foundry.data.LightData {
  name;
  type;
  state;

  constructor(name, type, state, app) {
    super();
    this.name = name ?? "SampleName";
    this.type = type ?? "LightType";
    this.state = state ?? "false";
    this._initFlag(app);
  };

  async _initFlag(app){
    this.state = app.object.document.getFlag("LightsHUD", this._getFlagName()) ?? false;
    await app.object.document.setFlag("LightsHUD",this._getFlagName(),this.state);
  };

  _getFlagName(){
    return this.name + this.type;
  };

}
