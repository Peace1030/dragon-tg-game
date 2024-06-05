import {Manager} from "socket.io-client";
import WebApp from "@twa-dev/sdk";
import {showToast} from "../helpers/helper.ts";

export default class Service {
    static Connect() {
        const URL = import.meta.env.VITE_REACT_APP_BACKEND_URL ?? "http://localhost:6000";
        const manager = new Manager(URL, {
            // reconnectionDelayMax: 10000,
            transports: ["websocket"],
        });
        const socket = manager.socket('/game', {
            auth: {
                tg_id: (WebApp?.initDataUnsafe?.user?.id ?? '').toString(),
                initData: WebApp.initData,
            }
        });
        socket.on('connection', () => {

        }).on('connect_error', (err: any) => {
            if (err.message.includes('INVALID_AUTH_DATA')) {
                showToast("Error", `Hmm...`, 'error','top-center');
            } else {
                showToast("Error", `Connection issue, Please restart the game`, 'error','top-center');
            }            // console.log("Websocket connection error: " + err.message);
        })
        return socket;
    }
}