import {ObjectId} from 'bson';

export type BlocklistEntry = {
    _id?: ObjectId;
    domain?: string;
};
export const PornBlocklistSchema = {
    name: 'porn',
    properties: {
        _id: 'objectId?',
        domain: 'string?',
    },
    primaryKey: '_id',
};

export type GQLResponse<Body, QueryName extends string = "document"> = {
    data: {
        [k in QueryName]: Body
    }
}
