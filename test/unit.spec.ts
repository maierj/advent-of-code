import "./../utils/utils";
import {expect} from "chai";

const scalarTestArray = [0, 5, 3, 1, 9];

const objectTestArray = [
	{
		a: "test",
		b: 1
	},
	{
		a: "test",
		b: 2
	},
	{
		a: "test",
		b: 1
	},
	{
		a: "test",
		b: 100
	},
];

describe("should extract max value", () => {
	it("max from scalar values", () => {
		expect(scalarTestArray.max((element) => element)).to.be.equal(9);
	})

	it("max from object values", () => {
		expect(objectTestArray.max((element) => element.b)).to.be.deep.equal({a: "test", b: 100});
	})
})

describe("should extract min value", () => {
	it("min from scalar values", () => {
		expect(scalarTestArray.min((element) => element)).to.be.equal(0);
	})

	it("min from object values", () => {
		expect(objectTestArray.min((element) => element.b)).to.be.deep.equal({a: "test", b: 1});
	})
})