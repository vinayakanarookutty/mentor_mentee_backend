import mongoose, { Schema } from 'mongoose';
import { DB_ERRORS,DB_ERROR_MESSAGES } from '../../constants/errors/apiErrors';
import { HTTP_RESOURCES } from '../../reqRouters/resourses';
import { MongoQueryBuilder } from './queryBuilder';
import { config } from '../../config';
import { IMongoDALCreateArg } from '../../interfaces/db';
export class MongoDAL {
    public mongoDBUrl: string;
    constructor() {
      this.getItem = this.getItem.bind(this);
      this.getItemList = this.getItemList.bind(this);
      this.patchItem = this.patchItem.bind(this);
      this.createItem = this.createItem.bind(this);
      this.createItems = this.createItems.bind(this);
      this.createOrUpdateItem = this.createOrUpdateItem.bind(this);
      this.deleteItem = this.deleteItem.bind(this);
      this.getItemCount = this.getItemCount.bind(this);
      this.getAgregateList = this.getAgregateList.bind(this)
      this.getItemsByLimit = this.getItemsByLimit.bind(this)
      this.patchMultipleItems = this.patchMultipleItems.bind(this)
      this.mongoDBUrl = process.env.mongoUrl;
  
    }

  
    async createItem(resource: string, arg: IMongoDALCreateArg) {
      try {
        await mongoose.connect(this.mongoDBUrl);
        const collectionName = config.mongoCollectionMap[resource];
        const model = mongoose.model(collectionName);
        if (arg.constraints?.unique) {
          const uniqQuery = MongoQueryBuilder.checkUnique(arg.constraints.unique);
          const result = await model.findOne(uniqQuery);
          if (result) {
            const errorObj = new Error();
            errorObj.message = DB_ERROR_MESSAGES.uniqueCheckFailed;
            errorObj.name = DB_ERRORS.uniqueCheckFailed;
            throw errorObj
          }
        }
        const newDoc = new model(arg.data);
        const result = JSON.parse(JSON.stringify(newDoc));
        await newDoc.save();
        return result;
      } catch (err) {
        if (err.code === 11000) {
          return "item already exists"
        }
        throw err;
      }
    }
  
    async insertMany({ resource, data }) {
      try {
        await mongoose.connect(this.mongoDBUrl);
        const collectionName = config.mongoCollectionMap[resource];
        const model = mongoose.model(collectionName);
        const result = await model.insertMany(data);
        return result;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  
    async deleteMany({ resource, filters }) {
      try {
        const conditions = {
          $or: filters
        };
        await mongoose.connect(this.mongoDBUrl);
        const collectionName = config.mongoCollectionMap[resource];
        const model = mongoose.model(collectionName);
        const result = await model.deleteMany(conditions);
        return result;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
    async createOrUpdateItem({ resource, queryObj, data }) {
      try {
        await mongoose.connect(this.mongoDBUrl);
        const collectionName = config.mongoCollectionMap[resource];
        const model = mongoose.model(collectionName);
        const result = await model.findOneAndUpdate(
          queryObj,
          { $set: data },
          { upsert: true, new: true }
        );
        return result;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  
    async createItems( resource,  data ) {
      try {
        await mongoose.connect(this.mongoDBUrl);
        const collectionName = config.mongoCollectionMap[resource];
        const model = mongoose.model(collectionName);
        const result = await model.insertMany(data);
        return result;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
    
  
    async getItem({ resource, queryObj }) {
      try {
        await mongoose.connect(this.mongoDBUrl);
        const collectionName = config.mongoCollectionMap[resource];
        const model = mongoose.model(collectionName);
        const result = await model.findOne(queryObj);
        return result;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  
  
    async deleteItem({ resource, queryObj }) {
      try {
        await mongoose.connect(this.mongoDBUrl);
        const collectionName = config.mongoCollectionMap[resource];
        const model = mongoose.model(collectionName);
        const result = await model.deleteOne(queryObj);
        return result;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  
    async incrementAnAttribute({ resource, filter, attributeToUpdate }) {
      try {
        await mongoose.connect(this.mongoDBUrl);
        const collectionName = config.mongoCollectionMap[resource];
        const model = mongoose.model(collectionName);
        const result = await model.findOneAndUpdate(filter, { $inc: attributeToUpdate }, {
          new: true
        });
        return result;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  
    async getSortedItemList({ resource, queryObj = {}, sortObj }) {
      try {
        await mongoose.connect(this.mongoDBUrl);
        const collectionName = config.mongoCollectionMap[resource];
        const model = mongoose.model(collectionName);
        const result = await model.find(queryObj).sort(sortObj).limit(1000);
        return result;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  
  
  async getAgregateTime({resource,queryObj}){
    try {
      await mongoose.connect(this.mongoDBUrl);
      const collectionName = config.mongoCollectionMap[resource];
      const model = mongoose.model(collectionName);
      console.log(queryObj)
      const result = await model.aggregate([
        {
          $match: {
           createdAt:{
            "user":queryObj.user,
            "$gte": {
              "$date": queryObj.date1
            },
            "$lt": {
              "$date": queryObj.date2
            }
          }
          }
        },
      ])
  
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  
  }
  
  
    async getAgregateList({ resource, queryObj }) {
      try {
        await mongoose.connect(this.mongoDBUrl);
        const collectionName = config.mongoCollectionMap[resource];
        const model = mongoose.model(collectionName);
  
        if (queryObj.value == 'status') {
          const fieldValues = await model.distinct("status")
  
          const result = await model.aggregate([
            {
              $match: {
                status: { $in: fieldValues }
              }
            },
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 }
              }
            }
          ])
  
          return result;
        }
  
        if (queryObj.value == 'financialYear') {
          const fieldValues = await model.distinct("financialYear")
  
          const result = await model.aggregate([
            {
              $match: {
                financialYear: { $in: fieldValues }
              }
            },
            {
              $group: {
                _id: "$financialYear",
                count: { $sum: 1 }
              }
            }
          ])
  
          return result;
        }
  
        if (queryObj.value == 'financialYearValues') {
          const fieldValues = await model.distinct("financialYear")
          return fieldValues;
        }
  
        if (queryObj.value == 'taskCategoryId') {
          const fieldValues = await model.distinct("taskCategoryId")
          const result = await model.aggregate([
            {
              $match: {
                taskCategoryId: { $in: fieldValues }
              }
            },
            {
              $group: {
                _id: "$taskCategoryId",
                count: { $sum: 1 }
              }
            }
          ])
          return result;
        }
        if (queryObj.value == 'clientName') {
          const fieldValues = await model.distinct("clientName")
          const result = await model.aggregate([
            {
              $match: {
                clientName: { $in: fieldValues }
              }
            },
            {
              $group: {
                _id: "$clientName",
                count: { $sum: 1 }
              }
            }
          ])
          return result;
        }
        if (queryObj.value == 'assigneeNameList') {
          const result = await model.aggregate([
            {
              $unwind: "$assigneeNameList"
            },
            {
              $group: {
                _id: "$assigneeNameList",
                count: { $sum: 1 }
              }
            }
          ])
          return result;
        }
  
        if (queryObj.value == 'reviewerNameList') {
          const result = await model.aggregate([
            {
              $unwind: "$reviewerNameList"
            },
            {
              $group: {
                _id: "$reviewerNameList",
                count: { $sum: 1 }
              }
            }
          ])
          return result;
        }
        else {
          const result = await model.find(queryObj)
          const fieldValues = await model.distinct("status")
          const status = await model.aggregate([
            {
              $match: queryObj
            },
            {
              $match: {
                status: { $in: fieldValues }
              }
            },
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 }
              }
            }
          ])
          const fieldValues2 = await model.distinct("financialYear")
          const financialYear = await model.aggregate([
            {
              $match: queryObj
            },
            {
              $match: {
                financialYear: { $in: fieldValues2 }
              }
            },
            {
              $group: {
                _id: "$financialYear",
                count: { $sum: 1 }
              }
            }
          ])
  
          const fieldValues3 = await model.distinct("taskCategoryId")
          const taskCategoryId = await model.aggregate([
            {
              $match: queryObj
            },
            {
              $match: {
                taskCategoryId: { $in: fieldValues3 }
              }
            },
            {
              $group: {
                _id: "$taskCategoryId",
                count: { $sum: 1 }
              }
            }
          ]);
  
          const fieldValues4 = await model.distinct("clientName")
          const clientName = await model.aggregate([
            {
              $match: queryObj
            },
            {
              $match: {
                clientName: { $in: fieldValues4 }
              }
            },
            {
              $group: {
                _id: "$clientName",
                count: { $sum: 1 }
              }
            }
          ]);
          return { result, status, financialYear, taskCategoryId, clientName };
        }
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
    async getAgregateListInvoice({ resource, queryObj }) {
      try {
        await mongoose.connect(this.mongoDBUrl);
        const collectionName = config.mongoCollectionMap[resource];
        const model = mongoose.model(collectionName);
  
      
        if (queryObj.value == 'totalAmountPayable') {
          const cgst = await model.aggregate([
            {
              $group: {
                _id: null,
                totalCgst: { $sum: "$cgst" }
              }
            }
          ])
          const sgst = await model.aggregate([
            {
              $group: {
                _id: null,
                totalCgst: { $sum: "$sgst" }
              }
            }
          ])
          const total = await model.aggregate([
            {
              $group: {
                _id: null,
                totalCgst: { $sum: "$totalAmountPayable" }
              }
            }
          ])
          const fieldValues = await model.distinct("clientInfo.name")
             const result = await model.aggregate([
            {
              $match: {
                "clientInfo.name": { $in: fieldValues }
              }
            },
            {
              $group: {
                _id: "$clientInfo.name",
                count: { $sum:"$totalAmountPayable"  }
              }
            }
          ])
          const fieldValues2 = await model.distinct("status")
          const result2 = await model.aggregate([
         {
           $match: {
             "status": { $in: fieldValues2 }
           }
         },
         {
           $group: {
             _id: "$status",
             count: { $sum: 1 }
           }
         }
       ])
  
      
       const result3 = await model.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: "$totalAmountPayable" }
          }
        }
      ]);
      const fieldValues4 = await model.distinct("assignees")
          const result4 = await model.aggregate([
         {
           $match: {
             "assignees": { $in: fieldValues4 }
           }
         },
         {
          $unwind: "$assignees"
         },
         {
           $group: {
             _id: "$assignees",
             count: { $sum: 1 }
           }
         }
       ])
          
  
         
      const count = await model.countDocuments({});
       
          return {cgst,sgst,total,result,result2,result3,count,result4};
        }
  
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  
    async getItemList({ resource, queryObj }) {
      try {
        await mongoose.connect(this.mongoDBUrl);
        const collectionName = config.mongoCollectionMap[resource];
        const model = mongoose.model(collectionName);
        let result;
        if (!queryObj || Object.entries(queryObj).length === 0) {
          result = await model.find({}).sort({ createdAt: 'desc' }).limit(200);
          result.totalRows = await model.estimatedDocumentCount();
          return result;
        } else if (queryObj.isSubString) {
          delete queryObj['isSubString'];
          const entries = Object.entries(queryObj);
          const attributeName = entries[0][0];
          const searchValue = entries[0][1] as string;
          const mongoQuery = {};
          mongoQuery[attributeName] = new RegExp(searchValue, "i");
          result = await model.find(mongoQuery).limit(200);
          result.totalRows = await model.find(mongoQuery).countDocuments();
          return result;
        } else if (queryObj.isPrefix) {
          delete queryObj['isPrefix'];
          const entries = Object.entries(queryObj);
          const attributeName = entries[0][0];
          const searchValue = entries[0][1] as string;
          const mongoQuery = {};
          mongoQuery[attributeName] = new RegExp("^" + searchValue, "i");
          result = await model.find(mongoQuery).limit(200);
          result.totalRows = await model.find(mongoQuery).countDocuments();
          return result;
        }
        else {
          result = await model.find(queryObj).limit(200);
          return result;
        }
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  
    async queryListWithOr({ resource, filters }) {
      try {
        await mongoose.connect(this.mongoDBUrl);
        const collectionName = config.mongoCollectionMap[resource];
        const model = mongoose.model(collectionName);
        const conditions = {
          $or: filters
        };
        const result = await model.find(conditions);
        return result;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  
    async getItemCount({ resource, queryObj }) {
      try {
        await mongoose.connect(this.mongoDBUrl);
        const collectionName = config.mongoCollectionMap[resource];
        const model = mongoose.model(collectionName);
        if (!queryObj || Object.entries(queryObj).length === 0) {
          return await model.estimatedDocumentCount();
        } else {
          const entries = Object.entries(queryObj);
          const attributeName = entries[0][0];
          const searchValue = entries[0][1] as string;
          const mongoQuery = {};
          mongoQuery[attributeName] = new RegExp("^" + searchValue, "i");
          return await model.find(mongoQuery).countDocuments();
        }
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  
    async getItemsByLimit({resource, limit, queryObj}){
      try {
        await mongoose.connect(this.mongoDBUrl);
        const collectionName = config.mongoCollectionMap[resource];
        const model = mongoose.model(collectionName);
        return await model.find(queryObj).limit(limit).sort({createdAt: 'desc'})
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  
    async findOne({resource, queryObj}){
      try {
        await mongoose.connect(this.mongoDBUrl);
        const collectionName = config.mongoCollectionMap[resource];
        const model = mongoose.model(collectionName);
        return await model.findOne(queryObj);
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  
    async patchItem({ resource, filter, attributesToUpdate }) {
      try {
        await mongoose.connect(this.mongoDBUrl);
        const collectionName = config.mongoCollectionMap[resource];
        const model = mongoose.model(collectionName);
        const result = await model.findOneAndUpdate(filter, attributesToUpdate, {
          new: true,upsert:true
        });
        return result;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  
    async patchMultipleItems({ resource, filter, attributesToUpdate }) {
      try {
        await mongoose.connect(this.mongoDBUrl);
        const collectionName = config.mongoCollectionMap[resource];
        const model = mongoose.model(collectionName);
        console.log(attributesToUpdate)
        const result = await model.updateMany(filter, attributesToUpdate, {
          new: true,
          upsert:true
        });
        return result;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  
    //Autocomplete for client
    async autoCompleteClientOld({ queryKey }) {
      await mongoose.connect(this.mongoDBUrl);
      if (!queryKey) {
        try {
          const model = mongoose.model("clients");
          const result = await model.find()
          return result
        } catch (err) {
          console.log(err);
        }
  
      }
      try {
        const regexp = new RegExp("^" + queryKey, "i");
        const model = mongoose.model("clients");
        const result = await model.find({ clientName: regexp })
        return result
      } catch (err) {
        console.log(err)
      }
    }
  
    async getItemsStartingWithPrefix({ resource, queryObj }) {
      try {
        await mongoose.connect(this.mongoDBUrl);
        const collectionName = config.mongoCollectionMap[resource];
        const model = mongoose.model(collectionName);
        let result;
        if (!queryObj) {
          result = await model.find({});
          return result;
        } else {
          const entries = Object.entries(queryObj);
          const attributeName = entries[0][0];
          const searchValue = entries[0][1] as string;
          const mongoQuery = {};
          mongoQuery[attributeName] = new RegExp("^" + searchValue, "i");
          result = await model.find(mongoQuery);
          return result
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
  
  