import { watch } from 'fs';
import { Observable, ISubject } from './observable';
import { extname } from 'path';

enum FileWatchEventType {
    Rename,
    Change
}

interface FileWatchEvent {
    type: FileWatchEventType;
    fileName: string;
    extension: string;
}

type FileWatchHandler = (event: FileWatchEvent) => void;

export function directory(dir: string): ISubject<FileWatchEvent> {
    var options = {
        recursive: true
    }

    var obs = new Observable<FileWatchEvent>();
    watch(dir, options, (eventType, fileName) => {
        var type: FileWatchEventType;
        switch (eventType) {
            case 'rename':
                type = FileWatchEventType.Rename;
                break;
            case 'change':
                type = FileWatchEventType.Change;
                break;
        }

        obs.next({
            fileName: fileName,
            extension: extname(fileName),
            type: type
        });
    });
    return obs;
}