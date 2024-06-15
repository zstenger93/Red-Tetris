import HowToPlay from "../src/components/HowToPlay.vue";
import { mount } from "@vue/test-utils";

describe("HowToPlay", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(HowToPlay);
    });

    it("displays all control instructions", () => {
        const instructions = ["Left", "Right", "Rotation", "Fall towards the pile"];
        instructions.forEach(instruction => {
            expect(wrapper.text()).toContain(instruction);
        });
    });
});