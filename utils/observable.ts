export interface ISubscribable<T> {
    subscribe(observer: IObserver<T>): void;
}

export interface IObserver<T> {
    next?(value?: T): void;
    error?(value: any): void;
    complete?(): void;
}

export interface ISubject<T> extends IObserver<T>, ISubscribable<T> {

}

enum ObservableEventType {
    error,
    next,
    complete
}

interface ObservableEvent<T> {
    value?: T;
    type: ObservableEventType;
}

export class Observable<T> implements ISubject<T> {
    constructor() {
        this.observers = [];
        this.events = [];
    }

    static create(): Observable<void> {
        return new Observable<void>();
    }

    private notify(event: ObservableEvent<T>, observers: IObserver<T>[]) {
        switch (event.type) {
            case ObservableEventType.next:
                this.notifyNext(observers, event.value);
                break;
            case ObservableEventType.error:
                this.notifyError(observers, event.value);
                break;
            case ObservableEventType.complete:
                this.notifyComplete(observers);
                break
        }
    }

    private notifyNext(observers: IObserver<T>[], value?: T) {
        this.observers
            .filter(observer => observer.next != null)
            .forEach(observer => observer.next!(value));
    }

    private notifyError(observers: IObserver<T>[], value: any) {
        this.observers
            .filter(observer => observer.error != null)
            .forEach(observer => observer.error!(value));
    }

    private notifyComplete(observers: IObserver<T>[]) {
        this.observers
            .filter(observer => observer.complete != null)
            .forEach(observer => observer.complete!());
    }

    private addEvent(event: ObservableEvent<T>) {
        this.events = [
            ...this.events,
            event
        ];
    }

    next(value?: T) {
        this.addEvent({ value: value, type: ObservableEventType.next });
        this.notifyNext(this.observers, value);
    }

    error(value: any) {
        this.addEvent({ value: value, type: ObservableEventType.error });
        this.notifyError(this.observers, value);
    }

    complete() {
        this.addEvent({ type: ObservableEventType.complete });
        this.notifyComplete(this.observers);
    }

    private addObserver(observer: IObserver<T>) {
        this.observers = [
            ...this.observers,
            observer
        ];
    }

    subscribe(observer: IObserver<T>) {
        if (observer == null)
            return;

        this.addObserver(observer);
        this.events.forEach(event => this.notify(event, [observer]));
    }

    private observers: IObserver<T>[];
    private events: ObservableEvent<T>[];
}