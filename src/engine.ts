class MwFormEngine {
    submit() {
        document.addEventListener("submit", function (e: Event) {
            var element = e.target as Node;

            var mwSubmitAttr = element.attributes.getNamedItem('mw-submit');
            if (mwSubmitAttr) {
                var mwSubmit = new Function(mwSubmitAttr.value);
                mwSubmit();
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

