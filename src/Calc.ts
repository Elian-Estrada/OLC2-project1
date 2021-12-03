class Calc {

    add (a: number, b: number): number {
        return a + b;
    }

    inc (a: number) {
        return a += 1;
    }
}

let calc = new Calc();
console.log(calc.inc(4));
