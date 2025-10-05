import UserSchema from "../models/userModel";
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'

export class UserRepository {
    static async create (name:string, password: string ) {
        // validar username (opcional usar zod)
        Validation.username(name)
        Validation.password(password)        
        
        //2. asegurarse que username no existe
        const user = await UserSchema.find({name})
        if(!!user) throw new Error('user already exists');
        
        //hash password
        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await UserSchema.create({
            name,
            hashPassword
        });

        return newUser
    }
    static async login (name:string, password: string ) {
        Validation.username(name)
        Validation.password(password)

        const user = await UserSchema.findOne({name})
        if(!user) throw new Error('user does not exists');
        
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) throw new Error('password is invalid');
        
        // Forma elegante de quitarle campos a algo
        const {password: _, ...publicUser} = user
        
        return publicUser
    }
} 
class Validation {
    static username (name: string) {
        if(typeof name !== "string") throw new Error('username must be a string')
        if(name.length < 3) throw new Error('username must be at least 3 characters long')
    }
    static password (password: string) {
        if(typeof password !== "string") throw new Error('username must be a string')
        if(password.length < 3) throw new Error('username must be at least 3 characters long')
    }
}