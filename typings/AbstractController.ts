import { Response, Router } from 'express';

export default abstract class AbstractController {
    public router: Router = Router();
    abstract path: string = '/';

    abstract initRoute(): void;
    abstract async execute(): Promise<void>;
    protected sendSuccess(res: Response, data: object): void {
        res.status(200).json(data);
    };
    protected sendError (res: Response, error: string): void {
        res.status(500).json(error)
    };
}