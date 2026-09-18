function* generator(){
    yield 1;
    yield 2;
    yield 3;
}
let gen=generator();
let gen1=generator();
console.log(gen.next().value);
console.log(gen.next().done);
console.log(gen.next().done);
console.log(gen.next().done);
console.log(gen.next());

console.log(gen1.next().value);

