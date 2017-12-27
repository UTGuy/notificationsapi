if ('Notification' in window) {
    document.body.classList.add('notifications');
}

document.addEventListener("submit", function (e: Event) {
    var element = e.target as Node;
    var mwSubmit = element.attributes.getNamedItem('mw-submit');
    if (mwSubmit) {
        eval(mwSubmit.value);
    }

    e.stopPropagation();
    e.preventDefault();
});

class Notifier {
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

let notifier: Notifier;
Notifier.create(_notifier => {
    notifier = _notifier;
});