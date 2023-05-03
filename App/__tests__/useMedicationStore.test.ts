import 'react-native';
import { useMedicationStore } from "../src/hooks";
import { renderHook, type RenderHookResult, cleanup } from '@testing-library/react-native';

describe("useMedicationStore hook tests", () => {
    let result: RenderHookResult<ReturnType<typeof useMedicationStore>, unknown>;

    beforeEach(() => {
        result = renderHook(() => useMedicationStore());
    });


    afterEach(() => cleanup());

    it.todo("must have one test");
});
