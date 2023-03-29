import { Option, None, Some } from "./option";

abstract class ResultTrait<T, E>{
	abstract is_ok(): boolean;
	abstract is_err(): boolean;
	abstract ok(): Option<T>;
	abstract err(): Option<E>;
	abstract unrwap(): T;
	abstract unrwap_or(alternative: T): T;
	abstract unrwap_or_else(func: ()=>T): T;
	abstract expect(error_message: string): T;
}

class StructErr<T, E> extends ResultTrait<T, E> {
	constructor(private error: NonNullable<E>) {
		super();
	}
	is_ok(): boolean {
		return false;
	}
	is_err(): boolean {
		return true;
	}
	ok(): Option<T> {
		return None();
	}
	err(): Option<E> {
		return Some(this.error);
	}
	unrwap(): T {
		throw new Error("Called Result::unrwap on a Err object");
	}
	unrwap_or<T>(alternative: T): T {
		return alternative;
	}
	unrwap_or_else<T>(func: ()=>T): T {
		return func();
	}
	expect(error_message: string): T {
		throw new Error(error_message);
	}
}

class StructOk<T, E> extends ResultTrait<T, E> {
	constructor(private value: T) {
		super();
	}
	is_ok(): boolean {
		return true;
	}
	is_err(): boolean {
		return false;
	}
	ok(): Option<T> {
		if(this.value){
			return None();
		}
		return Some(this.value as NonNullable<T>);
	}
	err(): Option<E> {
		return None();
	}
	unrwap(): T {
		return this.value;
	}
	unrwap_or(_alternative: T): T {
		return this.value;
	}
	unrwap_or_else(_func: ()=>T): T {
		return this.value;
	}
	expect(_error_message: string): T {
		return this.value;
	}
}

export type Result<T, E> = StructOk<T, E> | StructErr<T, E>;

export function Err<T, E>(error: NonNullable<E>): Result<T, E> {
	return new StructErr(error);
}

export function Ok<T, E>(value: T): Result<T, E> {
	return new StructOk(value);
}
