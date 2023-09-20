"use strict";
import mongoose, { Schema } from 'mongoose';
import { HTTP_RESOURCES } from '../../reqRouters/resourses';
import { IUser } from '../../interfaces/db/mongoDb/mongoSchema';
import { http } from 'winston';

const userSchema= new Schema<IUser>(
    {
        name:{
            type:String
        },
        dateofbirth:{
            type:String
        },
        age:{
            type:String
        },
        phoneNumber:{
            type:String
        },
        permanentAddress:{
            type:String
        },
        guardian:{
            type:String
        },
        guardianPhNo:{
            type:String
        },
        emailId:{
            type:String
        },
        intrest:{
            type:String
        },
    },
    { strict: false, timestamps: true }
)
mongoose.model(HTTP_RESOURCES.users,userSchema,HTTP_RESOURCES.users)