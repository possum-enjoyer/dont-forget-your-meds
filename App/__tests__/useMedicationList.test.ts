import 'react-native';
import { useMedicationList } from "../src/hooks/useMedicationList";
import { renderHook, act, type RenderHookResult, cleanup } from '@testing-library/react-native';

describe('useMedicationList hook tests', () => {
    let result: RenderHookResult<ReturnType<typeof useMedicationList>, unknown>;

    beforeEach(() => {
        result = renderHook(() => useMedicationList());
    });

    afterEach(() => {
        cleanup();
    });

    it('is false on default', () => {
        const { current: [medicationList] } = result.result;

        expect(medicationList).toStrictEqual([]);
    });

    it("should have 1 added item", () => {

        act(() => {
            result.result.current[1].addMedicationToList({id: 1, title: "New Medication", amount: 10});
        });

        expect(result.result.current[0]).toHaveLength(1);
    });

    it("should have 0 items after added 1 and removed 1", () => {
        act(() => {
            result.result.current[1].addMedicationToList({id: 1, title: "New Medication", amount: 10});
        });

        act(() => {
            result.result.current[1].removeMedicationById(1);
        });

        expect(result.result.current[0]).toHaveLength(0);
    });

});
