export class tokenInformations {
  tokenId;
  actorId;
  itemList;
  isLinked;
  

  constructor(tokenObject = {}) {
    this.setTokenInfo(tokenObject);
  }

  getLinked(){
      return this.isLinked;
  }

  getItemsList(){
      return this.itemList;
  }

  getTokenID(){
      return this.tokenId;
  }

  getActorID(){
      return this.actorId;
}

setTokenInfo(tokenObject){
    try{
        this.tokenId  = tokenObject._id;
        this.actorId  = tokenObject.actorId;
        this.isLinked = tokenObject.actorLink;
        this.itemList = tokenObject.actorData.items ?? game.actors.get(tokenObject.actorId).data.items.contents;
    } catch (error) {
        console.error("Error in setting TokenObject: ", error);
        return error;
    }
}

}
