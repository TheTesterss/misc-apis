import Apis from './structures/Apis';
import { config } from 'dotenv';
config();

new Apis({
    port: 8080,
    messages: [
        {
            ListenersMessage: 'Apis are successfully connected.',
            initializatingFinished: 'The initialization of apis ended.',
            errorInitializating: 'An error occured while initializating.'
        }
    ],
    subConfigs: [
        {
            key: 'json spaces',
            value: 2
        }
    ]
}).launch();
