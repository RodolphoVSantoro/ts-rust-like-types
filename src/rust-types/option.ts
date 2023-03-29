import {Err, Ok, Result} from "./result";

abstract class OptionTrait<T>{
	abstract unrwap(): T;
	abstract unrwap_or(alternative: T): T;
	abstract unrwap_or_else(func: ()=>T): T;
	abstract expect(error_message: string): T;
	abstract is_some(): boolean;
	abstract is_none(): boolean;
	abstract is_some_and(fn: ((object: T)=>boolean)): boolean;
	abstract ok_or<E>(error: E): Result<T, E>;
}

class StructNone<T> extends OptionTrait<T> {
	unrwap(): T {
		throw new Error("Called Option::unrwap on a None object");
	}
	expect(error_message: string): T {
		throw new Error(error_message);
	}
	unrwap_or(alternative: T): T {
		return alternative;
	}
	unrwap_or_else(func: ()=>T): T {
		return func();
	}
	is_some(): boolean {
		return false;
	}
	is_none(): boolean {
		return true;
	}
	is_some_and(_fn: ((object: T)=>boolean)): boolean {
		return false;
	}
	ok_or<E>(error: NonNullable<E>): Result<T, E> {
		return Err(error);
	}
}

class StructSome<T> extends OptionTrait<T> {
	constructor(private value: NonNullable<T>){super();}
	unrwap(): T {
		return this.value;
	}
	expect(_error_message: string): T {
		return this.value;
	}
	unrwap_or(_alternative: T): T {
		return this.value;
	}
	unrwap_or_else(_func: ()=>T): T {
		return this.value;
	}
	is_some(): boolean {
		return true;
	}
	is_none(): boolean {
		return false;
	}
	is_some_and(fn: ((object: T)=>boolean)): boolean {
		return fn(this.value);
	}
	ok_or<E>(_error: E): Result<T, E> {
		return Ok(this.value);
	}
}

export type Option<T> = StructSome<T> | StructNone<T>;

export function None<T>(): Option<T> {
	return new StructNone<T>();
}

export function Some<T>(value: NonNullable<T>): Option<NonNullable<T>> {
	return new StructSome<NonNullable<T>>(value);
}

export function OptionFrom<T>(value: T): Option<NonNullable<T>> {
	if(value === null) {
		return None();
	}
	if(value === undefined) {
		return None();
	}
	const a: NonNullable<T> = value;
	return Some(a);
}