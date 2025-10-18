import {MinimalUser, User} from "../types/user";

export function toMinimalUser(user: User): MinimalUser {
    return {
        id: user._id.toString(),
        name: user.name,
    };
}