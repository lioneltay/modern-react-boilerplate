# Typescript - Mapped Types

## Mapped Types

Mapped types are a powerful feature of typescript. They provide the ability to transform existing object types reducing repetition and increasing expressivity.

Let’s see an example.

Suppose We have an interface for a `Person` type in our codebase.

```typescript
interface Person {
  name: string
  age: number
}
```

Now let’s say we would like a readonlyversion of Person, we could do this.

```typescript
interface ReadonlyPerson {
  readonly name: string
  readonly age: number
}
```

This works and it’s clear what is happening, but it’s a bit repetitive and error prone. What if we wanted to change what a `Person` is? We would have to go through and edit all the associated interfaces 😮.

Instead, we could define `ReadonlyPerson` in terms of a transformation of the existing `Person` type.

```typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

type ReadonlyPerson = Readonly<Person>
```

This can seem a bit intimidating if you are unfamiliar with mapped types so lets step through what is happening.

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

You may want to read about keyof and lookup types if you don’t know about them already. But even without knowing them in advance you might still be able to put the pieces together.

Also, at this point do we even need to have the `ReadonlyPerson` type at all? It's really just an alias for `Readonly<Person>.` As long as you are okay with adding a few angle brackets here and there this works out in the end. The less things you have to name, the happier you will be 👍.

## Inbuilt Types
The `Readonly` mapped type we wrote before is actually so commonly used that it’s already in the typescript standard library along with some other useful types. Here are some of the inbuilt mapped types and their implementations.

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