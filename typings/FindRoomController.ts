import AbstractController from './AbstractController';
import { IUserData, IRoomData } from './types';
import Matchmaking from './Matchmaking';

export default class FindRoomController extends AbstractController {
    readonly path: string = '/mm/find-room';

    constructor() {
        super();
    };

    initRoute() {
        this.router.post(this.path, this.execute);
    };

    async execute() {
        let mm = new Matchmaking(, 'music')
    }
}