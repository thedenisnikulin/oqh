import { IUserData, IRoomData } from './types';
const UserModel = require('../models/index').user;
import Sequelize from 'sequelize';

export default class User {
    private data: IUserData;

    constructor();
    constructor(data?: IUserData) {
        if (data) {
            this.data = data;
        }
    };

    public async setData(id: string): Promise<void>;
    public async setData(id?: string, username?: string): Promise<void> {
        if (id) {
            try{
                const data: Sequelize.Model = await UserModel.findOne({where: { id }});
                this.data = {
                    id: data.dataValues.id
                }
            } catch(e) {
                console.log(e);
            }
        } else if (username) {
            try{
                const data: object = await UserModel.findOne({where: { username }});
            } catch(e) {
                console.log(e);
            }
        }
    };

    public getData(): IUserData {
        return this.data;
    }
}