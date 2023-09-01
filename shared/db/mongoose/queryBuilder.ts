export class MongoQueryBuilder {
    static checkUnique(attributes:Array<object>){
      const query = { $or: attributes };
      return query;
    }
  }
  