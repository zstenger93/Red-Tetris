import SoloTetris from "../src/client/SoloTetris.vue";
import { mount } from "@vue/test-utils";

describe("SoloTetris", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(SoloTetris);
    });

    it("renders the Tetris grid correctly", () => {
        expect(wrapper.findAll("div.border-2").length).toBe(200); // Assuming the grid consists of 200 divs
    });
});