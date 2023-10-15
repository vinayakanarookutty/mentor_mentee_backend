"use strict";
import mongoose, { Schema } from 'mongoose';
import { HTTP_RESOURCES } from '../../reqRouters/resourses';
import { IUser,IMentorUser } from '../../interfaces/db/mongoDb/mongoSchema';
import { http } from 'winston';

const userSchema= new Schema<IUser>(
    {
        name:{
            type:String
        },
        phoneNumber:{
            type:String
        },
        emailId:{
            type:String
        },
       password:{
            type:String
        },
    },
    { strict: true, timestamps: true }
)
mongoose.model(HTTP_RESOURCES.users,userSchema,HTTP_RESOURCES.users)
const mentoruserSchema= new Schema<IMentorUser>(
    {
        name:{
            type:String
        },
        phoneNumber:{
            type:String
        },
        emailId:{
            type:String
        },
       password:{
            type:String
        },
        designation:{
            type:String
        },
    },
    { strict: false, timestamps: true }
)
mongoose.model(HTTP_RESOURCES.users,userSchema,HTTP_RESOURCES.users)