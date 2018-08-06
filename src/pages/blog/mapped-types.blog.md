# Typescript - Mapped Types

## Mapped Types

Mapped types are a powerful feature of typescript. They provide a wide range of expressivity in dealing with and transforming object types.

Let's see an example.

Suppose We have an interface for a ```Person``` type in our codebase.

```typescript
interface Person {
  name: string
  age: number
}
```

This is great, it clearly states what you can expect a person type to have. Now let's say we would like a readonly version of `Person`, we could do this.

```typescript
interface ReadonlyPerson {
  readonly name: string
  readonly age: number
}
```

This works and it's clear what is happening, but it's a bit repetitive and error prone. What if we wanted to change what a `Person` is? We would have to go through and edit all the associated interfaces :O.

Instead, we could define `ReadonlyPerson` in terms of a transformation of the existing `Person` type.

```typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

type ReadonlyPerson = Readonly<Person>
```

This can seem a bit daunting if you are unfamiliar with mapped types so lets interpret what's happening step by step.

```typescript
// This is where we start
type ReadonlyPerson = Readonly<Person>

// Substitute Person into the definition of Readonly
type ReadonlyPerson = {
  readonly [K in keyof Person]: Person[K]
}

// Extract the keys of Person
type ReadonlyPerson = {
  readonly [K in "name" | "age"]: Person[K]
}

// Expand the mapped type
type ReadonlyPerson = {
  readonly name: Person["name"]
  readonly age: Person["age"]
}

// Substitute index lookup types with their actual types
type ReadonlyPerson = {
  readonly name: string
  readonly age: number
}

// And that's all!
```

Granted to get through all that you would need to know about keyof and lookup types. But even without knowing them in advance you might still be able to put the pieces together.

Also, at this point do we even need to have the `Readonly` type at all? It's really just an alias for `Readonly<Person>` at this point. As long as your ok with adding a few angle brackets here and there this works out in the end, you'll be happier the less things you have to name :).

### Inbuilt Mapped Types
The `Readonly` mapped type we wrote before is actually so commonly used that its already in the typescript standard library along with some other useful types (not just mapped types). Heres some of the mapped types and their implementations.

```typescript
// Make all properties in T optional
type Partial<T> = {
  [P in keyof T]?: T[P]
}

// Make all properties in T required
type Required<T> = {
  [P in keyof T]-?: T[P]
}

// Make all properties in T readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

// From T pick a set of properties K
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```