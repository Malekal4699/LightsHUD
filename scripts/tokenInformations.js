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
        if (this.isLinked){
            this.itemList = game.actors.get(this.actorId).data._source.items;
        }
        else{
           this.itemList = game.actors.tokens[this.tokenId].data._source.items;
        }
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
            this.getItemsList();
        } catch (error) {
            console.error("Error in setting TokenObject: ", error);
            return error;
        }
    }

}      
