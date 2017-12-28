class MwFormEngine {
    submit() {
        document.addEventListener("submit", function (e: Event) {
            var element = e.target as Node;

            var mwSubmit = element.attributes.getNamedItem('mw-submit');
            if (mwSubmit) {
                eval(mwSubmit.value);
            }

            e.stopPropagation();
            e.preventDefault();
        });
    }

    run() {
        this.submit();
    }
}

export function foo() {}

export class MwEngine {
    run(fn: Function) {
        var formEngine = new MwFormEngine();
        formEngine.run();

        if (fn == null)
            return;
            
        fn();
    }
}

