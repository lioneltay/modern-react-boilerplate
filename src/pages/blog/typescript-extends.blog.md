# Typescript - the meaning of extends

The `extends` keyword can be used in a few different ways and situations, some more obvious than others. In this post we'll be going through some of those situations.

## Interfaces

The `extends` keyword can be used in interfaces in quite an intuitive sense.

```typescript
interface LivingThing {
  age: number
}

interface Person extends LivingThing {
  name: string
}

interface Superman extends Person {
  canfly: boolean
}

const livingThing: LivingThing = {
  age: 5,
}

const person: Person = {
  age: 20,
  name: "Bob Jenkins",
}

const superman: Superman = {
  age: 999,
  name: "Superman",
  canfly: true,
}
```

In this case we can treat extends as it sounds, in the sense of "more things". We'll see later that this might not always be the most intuitive intepretation.

## Generics
Generics allow you to define types with a more generic… behaviour.

```typescript
// An interface for a linked list containing a consistent but unspecified type T.
interface LinkedList<T> = {
  next: LinkedList<T> | null
  val: T
}

// Simply returns the input you passed to it.
function identity<T>(input: T): T {
  return input
}
```

In the `LinkedList<T>` interface, we see that the type defines the structure of a linked list, and because it uses a generic type parameter `T` this structure can be applied to any linked list we want, `LinkedList<number>` or `LinkedList<{ item: any }>` for example.

In this way the generic provides a way to write more reusable types.

The function example of identity has a signature of `T => T` where `T` is could be anything. Although this is a trivial example, in this case the generic provides more than just reusability. Since the function can not know what `T` is in advance, it is extremely restricted in what it can do. For example the following implementations would result in errors.

```typescript
function identity<T>(input: T): T {
  input.push(5) // This won't work, input might not be an array
  return input
}

function identity<T>(input: T): T {
  return input + 3 // Will T even work with the '+' operator?
}

function identity<T>(input: T): T {
  return "help" // T would have to be a string for this to work
}
```

We see that the signature of `T => T` for any `T` alone tells us a lot about the function. By being generic in its input and return value, we are narrowing down the possible implementations. Infact, the only possible implementation of `T => T` is the identity function that does nothing but return what it is given.

So how can we “know a little more” about the generic type parameter? We can use the `extends` keyword.

```typescript
interface Person {
  name: string
}

function getTheLength<T extends Person>(person: T): T {
  return { name: person.name.toUpperCase() }
}
```

Here we don’t know exactly what `T` is but we know that it at least has the properties of a `Person`.

## `extends` with unions and functions
When extending interfaces we just get more properties which is quite intuitive. But what about for `union` types?

```typescript
function unionTest<T extends string | number>(input: T) {
  // ...
}
```

What would be valid input types to this function? What could `T` possibly be?

It turns out that valid inputs would be of the type `(string | number)`, `number` or `string` (or `never`, but let's leave that aside for now).

You may have been tempted to think that `T` would be `string | number | ...anything else`. Why isn't this the case?

The reason for this is that when type `A` `extends` type `B` it really means that `A` can do all the things that `B` can.

If I expect to get a `string | number` I would be okay with a `string | number`... as that's what I asked for, but I'd be happy with a `number` or a `string` as well since they can do anything a `string | number` could do. If you gave me a `boolean` however, I wouldn't know what to do with it.

We can apply the same reasoning to function.

Let's use our `interfaces` from earlier.

```typescript
interface LivingThing {
  age: number
}

interface Person extends LivingThing {
  name: string
}

interface Superman extends Person {
  canfly: boolean
}

type FType = (a: Person) => Person

function test<T extends FType>(fn: FType) {
  return fn
}
```

What functions could we pass into `test`?

```typescript
const livingThing: LivingThing = {
  age: 5,
}

const person: Person = {
  age: 20,
  name: "Bob Jenkins",
}

const superman: Superman = {
  age: 999,
  name: "Superman",
  canfly: true,
}

test((a: LivingThing) => livingThing) // Error
test((a: LivingThing) => person)
test((a: LivingThing) => superman)

test((a: Person) => livingThing) // Error
test((a: Person) => person)
test((a: Person) => superman)

test((a: Superman) => livingThing) // Error
test((a: Superman) => person) // Error
test((a: Superman) => superman) // Error
```

The function passed to `test` can expect to receive a `Person`. But if it happens to only need a `LivingThing`, that is fine since a `Person` is a `LivingThing`, so the function should not care.

The function is also expected to return `Person`. But if it happens to return a `Superman`, that is also fine since `Superman` can do everything a `Person` can do, so the consumer of the result shouldn't care.

## Conclusion
It helps to think of extends in terms of “extending functionality”. Extending an object type feels like a **superset** kind of relation only because an object has more functionality the more properties it has. Extending a union type feels more like a **subset** kind of relation as the more types that are “unioned” together, the less you know about the type and the less functionality you can assume. Functions are a little more complicated but it helps to think about “who should be concerned” with a particular type, the function implementation, or the consumer of the result.