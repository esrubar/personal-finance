import {MinimalUser, UserAuthProjection} from "./user";

export function toMinimalUser(user: UserAuthProjection): MinimalUser {
    return {
        id: user._id.toString(),
        name: user.name,
    };
}