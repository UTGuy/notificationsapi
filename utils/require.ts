interface Window {
    require: (path: string) => any;
    exports: any;
}

(() => {
    class RequireCache {
        constructor() {
            this.cache = {};
        }

        get(path: string): any {
            return this.cache[path];
        }

        set(path: string, value: any) {
            this.cache[path] = value;
        }

        private cache: { [index: string]: any }
    }

    const cache = new RequireCache();

    function getExtension(path: string, defaultExt: string | null = ".js"): string | null {
        const [ext] = path.match(/\.[0-9a-z]+$/i) || [defaultExt];
        return ext;
    }

    function getUrl(path: string): string {
        const isRelative = path.indexOf('./') == 0;
        const basePath = isRelative ? path.substr(2, path.length - 2) : path;
        const ext = getExtension(path);
        return `${location.href}${basePath}${ext}`;
    }

    function require(path: string) {
        let value = cache.get(path);
        if (value == null) {
            value = getFromServer(path);
            cache.set(path, value);
        }
        return value;
    }

    function parseModule(text: string): any {
        let exports = {};
        const module = new Function("exports", text);
        module(exports);
        return exports
    }

    function getFromServer(path: string): any {
        const url = getUrl(path);
        const ext = getExtension(path);

        const $timer = setTimeout(() => {
            throw "timeout";
        }, 3000);

        const request = new XMLHttpRequest();
        request.open("GET", url, false);
        request.send(null);

        clearTimeout($timer);
        switch (ext) {
            case '.js':
                return parseModule(request.responseText);
            default:
                return request.responseText;
        }
    }

    window.require = require;
    window.exports = {};
})();