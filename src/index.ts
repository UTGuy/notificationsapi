import { MwEngine } from "./engine";
import { Notifier } from "./notifier";

if ('Notification' in window) {
    document.body.classList.add('notifications');
}

declare global {
    interface Window {
        notifier: Notifier;
    }
}

function onCreateNotifier(notifier: Notifier) {
    window.notifier = notifier;
};

function run() {
    Notifier.create(onCreateNotifier);
}

const engine = new MwEngine();
engine.run(run);