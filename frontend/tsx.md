# TypeScript

## Resources

1. https://www.youtube.com/watch?v=Z5iWr6Srsj8

## Data Type

### Data Type

```tsx
let <variable>: <type> = <value>
```

Available types

```tsx
// Interger
let age: number = 20;

// String
let college: string = 'Tufts University';

// Boolean
let compsci: boolean = true;

// Wildcard - Any variable type assignment is allowed.
let wild: any;
wild = 'hello world';
wild = 0;

/**
 * Arrays can combine the abovementioned data type.
 */
let ages: number[] = [20, 21, 22];
let wildcards: any[] = [true, 15, 'hello world'];

/**
 * Tuple data type can store any data types in specific order.
 */
let profile: [string, number] = ['Nick', 20];

// The compile will yell at you here.
profile = [20, 'Nick'];

// Array that stores tuple.
let pm: [name, boolean][] = [
  ['Jackson', true],
  ['Jason', false],
];

// Union - Allow a variable to accept multiple types.
let union: string | number | boolean;
union = 'hello world';
union = 0;

/**
 * Enum data type is mostly used for integers or string.
 * Resources: https://www.typescriptlang.org/docs/handbook/enums.html
 */
enum Counter {
  First, // First = 0
  Second, // Second = 1
  Third, // Third = 3
  Fourth,
}

// This also works.
enum Counter2 {
  First = 1,
  Second, // Second = 2
  Third, // Third = 3
}

// Objects
let object: { name: string; age: number } = {
  x: 21,
};

// The above declaration can get messy. This is cleaner.
type User = {
  id: number;
  name: string;
};
let user: User;
```

### Type Assertion

Not entirely sure of it's usage.

```tsx
let wild: any;

// Approach 1
let age = <number>wild;

// Approach 2
let year = wild as number;
```

## Functions

Any combination for the data types above work.

```tsx
// The last number specifies the return type for the function.
function addition(x: number, y: number): number {
  return x + y;
}
```

Void function

```tsx
function empty(): void {
  console.log('No return');
}
```

## Interface

```tsx
interface LanguageInterface {
	language: string[]
};

interface StudentInterface {
	name: string;
	matriculation: number;

	age?: number; // Allow for optional key.

	readonly tupit: boolean;

	// Nested interface is allowed.
	language: LanguageInterface;
}

const student: StudentInterface {
	name: 'Tyler',
	matriculation: 2020,
	tupit: true
}

student.tupit = false // Compiler yells at you.
```

## Generics

Makes code more robust by templating.

```tsx
// T - Don't know what item types is passed in advance.
function getArray<T>(items: T[]): T[] {
  const copied = items;
  return copied;
}

let num_array = getArray<number>([1, 2, 3]);
let bool_array = getArray<boolean>([true, false]);

num_array.push(false); // Compiler yells at you.
```

## TypeScript with React

Define function.

```tsx
// Create interface for your function
interface Props {
  text: string;

  // Optional props
  optional?: number;
}

// FC = Function Component
const Section: React.FC<Props> = () => {
  return <section>Hello world</section>;
};
```

Hook - https://reactjs.org/docs/hooks-state.html

```tsx
const App: React.FC = () => {
  const [count, setCount] = useState<number>(5);
  return <div>{count}</div>;
};
```
