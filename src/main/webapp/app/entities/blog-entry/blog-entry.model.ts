import { BaseEntity } from './../../shared';

export class BlogEntry implements BaseEntity {
    constructor(
        public id?: number,
        public title?: string,
        public text?: string,
        public creationDate?: any,
        public lastModified?: any,
        public blog?: BaseEntity,
    ) {
    }
}
