import 'react-native';
import { useToggle } from "../src/useToggle";
import { renderHook, act, type RenderHookResult, cleanup } from '@testing-library/react-native';

describe('App tests', () => {
    let result: (defaultValue: boolean) => RenderHookResult<ReturnType<typeof useToggle>, unknown>;

    beforeEach(() => {
        result = (defaultValue: boolean) => renderHook(() => useToggle(defaultValue));
    });

    afterEach(() => {
        cleanup();
    });

    it('is false on default', () => {
        const { current: [toggle] } = result(false).result;

        expect(toggle).toBe(false);
    });

    it('is true on default', () => {
        const { current: [toggle] } = result(true).result;

        expect(toggle).toBe(true);
    });

    it("is true after called once", () => {
        const res = result(false).result;

        act(() => {
            res.current[1]();
        });

        expect(res.current[0]).toBe(true);
    });

});
