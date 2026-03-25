import express, { Application, Request, Response } from 'express';
import fs from 'node:fs';
import EventEmitter from 'node:events';
import { Collection } from '@discordjs/collection';
import { ApisConfigType, ApisSubConfigType, MessagesType } from '../enums/Types';
import { ApiInterface } from '../enums/Interfaces';
import path from 'node:path';

export default class Apis extends EventEmitter {
    messages: MessagesType[];
    subConfigs: ApisSubConfigType[];
    port: number;
    files: Collection<string, ApiInterface> = new Collection();
    app: Application = express();
    constructor(config: ApisConfigType) {
        super({ captureRejections: true });
        const { port, messages, subConfigs } = config;
        this.port = port;
        this.messages = messages;
        this.subConfigs = subConfigs;
        this.app.use(express.json());
    }

    async set(config: ApisSubConfigType): Promise<void> {
        //? Set express configs.
        return void this.app.set(config.key, config.value);
    }

    async startListening(listenConfig: ApisConfigType): Promise<void> {
        let message: string =
            listenConfig.messages.find((msg) => msg.ListenersMessage)?.ListenersMessage ??
            'App has been launched successfully.';
        this.app.listen(listenConfig.port, () => message);
        return void this.emit('listening', this);
    }

    async trackFolder(): Promise<void> {
        //? Track a folder and the folders in this one while there's no folder remaining.
        const processItems = async (items: string[], directory: string): Promise<void> => {
            for (const item of items) {
                const filePath = path.join(directory, item);
                const stats = fs.statSync(filePath);

                if (stats.isDirectory()) {
                    await processItems(fs.readdirSync(filePath), filePath);
                } else {
                    const api = require(filePath);
                    let name = `${item}/${directory}`
                    if (!this.files.has(name)) {
                        this.files.set(name, api);
                    }
                }
            }
        };

        const items: string[] = fs.readdirSync(path.join(path.resolve(__dirname, '..'), 'apis'));
        await processItems(items, path.join(path.resolve(__dirname, '..'), 'apis'));
    }

    async launch(): Promise<void> {
        for (const subConfigs of this.subConfigs) await this.set(subConfigs);

        await this.trackFolder();
        this.startListening({ port: this.port, messages: this.messages, subConfigs: this.subConfigs });
        this.files.forEach((file, name) => {
            let { path, type, run } = 'default' in file ? (file?.default as ApiInterface) : file;

            switch (type) {
                case 'get':
                    this.app.get(path, async (...args) => run(...(args as unknown as [Request, Response])));
                    break;
                case 'post':
                    this.app.post(path, async (...args) => run(...(args as unknown as [Request, Response])));
                    break;
                case 'patch':
                    this.app.patch(path, async (...args) => run(...(args as unknown as [Request, Response])));
                    break;
                case 'put':
                    this.app.put(path, async (...args) => run(...(args as unknown as [Request, Response])));
                    break;
                case 'delete':
                    this.app.delete(path, async (...args) => run(...(args as unknown as [Request, Response])));
                    break;
            }
            console.log(`${name} has been initialized at ${path}`);
        });
        console.log(
            this.messages.find((message) => message.initializatingFinished)?.initializatingFinished ??
                'The initialization ended. All seems correct.'
        );
    }
}
