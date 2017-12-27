export interface ISubject<T> {
    subscribe(observer: IObserver<T>);
}

export interface IObserver<T> {
    next(value: T): void;
    error?(value: Error): void;
    complete?(): void;
}

export class Observable<T> implements ISubject<T> {
    constructor() {
        this.observers = [];
    }

    next(value: T) {
        this.observers.forEach(observer => observer.next(value));
    }

    error(value: Error) {
        this.observers
            .filter(observer => observer.error != undefined)
            .forEach(observer => observer.error(value));
    }

    complete() {
        this.observers
            .filter(observer => observer.complete != undefined)
            .forEach(observer => observer.complete());
    }

    subscribe(observer: IObserver<T>) {
        this.observers = [
            ...this.observers,
            observer
        ];
    }

    private observers: IObserver<T>[];
}