
import bcrypt from 'bcrypt'
import {createAuditable} from "../auditable/auditableService";
import {toMinimalUser} from "./userMapper";
import {UserModel} from "./userModel";
import {MinimalUser, UserAuthProjection, UserDocument} from "./user";

export class UserRepository {
    static async create(name: string, password: string): Promise<UserDocument> {
        // validar username (opcional usar zod)
        Validation.username(name)
        Validation.password(password)

        //2. asegurarse que username no existe
        const user: UserDocument | null = await UserModel.findOne({name})
        if (!!user) throw new Error('user already exists');

        //hash password
        const hashPassword = await bcrypt.hash(password, 10)

        return await UserModel.create({
            name,
            password: hashPassword,
            auditable: createAuditable()
        });
    }

    static async login(name: string, password: string): Promise<MinimalUser | null> {
        Validation.username(name)
        Validation.password(password)

        const user: UserAuthProjection | null = await UserModel.findOne({name})
            .select("_id name password")
            .lean();

        if (!user) throw new Error('user does not exists');

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) throw new Error('password is invalid');

        return user ? toMinimalUser(user) : null;
    }
}

class Validation {
    static username(name: string) {
        if (name.length < 3) throw new Error('username must be at least 3 characters long')
    }

    static password(password: string) {
        if (password.length < 3) throw new Error('username must be at least 3 characters long')
    }
}