export class Notifier {
    private constructor() {
    }

    static create(callback: (notifier: Notifier) => void) {
        Notification.requestPermission(result => {
            switch (result) {
                case 'granted':
                    callback(new Notifier());
                    break;
            }
        });
    }

    notify(text: string) {
        console.log('notify', text);
        const title: string = "Notification";
        const body: string = text;
        new Notification(title, {
            body: body
        });
    }
}