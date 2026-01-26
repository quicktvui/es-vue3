
import { areStylesEqual } from '../src/modules/style-util';
import assert from 'assert';

function describe(name: string, fn: () => void) {
    console.log(`\n${name}`);
    fn();
}

function it(name: string, fn: () => void) {
    try {
        fn();
        console.log(`  ✓ ${name}`);
    } catch (e) {
        console.error(`  ✗ ${name}`);
        throw e;
    }
}

describe('style-util: areStylesEqual', () => {
    it('should return true for identical references', () => {
        const obj1 = { color: 'red' };
        assert.strictEqual(areStylesEqual(obj1, obj1), true);
    });

    it('should return true for identical content with different references', () => {
        const obj1 = { color: 'red' };
        const obj2 = { color: 'red' };
        assert.strictEqual(areStylesEqual(obj1, obj2), true);
    });

    it('should return false for different content', () => {
        const obj1 = { color: 'red' };
        const obj3 = { color: 'blue' };
        assert.strictEqual(areStylesEqual(obj1, obj3), false);
    });

    it('should return false for different keys', () => {
        const obj1 = { color: 'red' };
        const obj4 = { color: 'red', fontSize: '12px' };
        assert.strictEqual(areStylesEqual(obj1, obj4), false);
    });

    it('should return false for different values', () => {
        const obj4 = { color: 'red', fontSize: '12px' };
        const obj5 = { color: 'red', fontSize: '14px' };
        assert.strictEqual(areStylesEqual(obj4, obj5), false);
    });

    it('should return true for null vs null', () => {
        assert.strictEqual(areStylesEqual(null, null), true);
    });

    it('should return true for undefined vs undefined', () => {
        assert.strictEqual(areStylesEqual(undefined, undefined), true);
    });

    it('should return true for null vs undefined', () => {
        assert.strictEqual(areStylesEqual(null, undefined), true);
    });

    it('should return false for null vs object', () => {
        assert.strictEqual(areStylesEqual(null, {}), false);
    });

    it('should return false for object vs undefined', () => {
        assert.strictEqual(areStylesEqual({}, undefined), false);
    });

    it('should handle arrays with identical content', () => {
        const arr1 = { transform: ['scale(1)'] };
        const arr2 = { transform: ['scale(1)'] };
        assert.strictEqual(areStylesEqual(arr1, arr2), true);
    });

    it('should handle arrays with different content', () => {
        const arr1 = { transform: ['scale(1)'] };
        const arr3 = { transform: ['scale(2)'] };
        assert.strictEqual(areStylesEqual(arr1, arr3), false);
    });

    it('should handle arrays with different lengths', () => {
        const arr1 = { transform: ['scale(1)'] };
        const arr4 = { transform: ['scale(1)', 'rotate(0)'] };
        assert.strictEqual(areStylesEqual(arr1, arr4), false);
    });

    it('should handle identical strings', () => {
        assert.strictEqual(areStylesEqual('color:red', 'color:red'), true);
    });

    it('should handle different strings', () => {
        assert.strictEqual(areStylesEqual('color:red', 'color:blue'), false);
    });
});
