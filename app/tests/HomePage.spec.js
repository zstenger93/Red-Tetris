import HomePage from "../src/client/HomePage.vue";
import { mount } from "@vue/test-utils";

describe("HomePage", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(HomePage);
    });

    it("loads successfully", () => {
    // checks if the Vue instance is created
    expect(wrapper.vm).toBeTruthy();
    });

    it("initially shows only the 'Let's Play a Game' button", () => {
        expect(wrapper.find("button").text()).toContain("Let's Play a Game");
        expect(wrapper.findAll("button").length).toBe(1);
    });

    it("shows options when 'Let's Play a Game' is clicked", async () => {
        await wrapper.find("button").trigger("click");
        expect(wrapper.findAll("button").length).toBeGreaterThan(1);
        expect(wrapper.text()).toContain("Solo Tetris");
        expect(wrapper.text()).toContain("Multiplayer");
    });

    it("shows multiplayer options when 'Multiplayer' is selected", async () => {
        await wrapper.find("button").trigger("click"); // Let's Play a Game' is clicked
        await wrapper.findAll("button").at(1).trigger("click"); // click on Multiplayer
        expect(wrapper.text()).toContain("Tetris");
        expect(wrapper.text()).toContain("Tic-Tac-Toe");
    });

    it("can go back to main options from multiplayer options", async () => {
        await wrapper.find("button").trigger("click");
        await wrapper.findAll("button").at(1).trigger("click");
        await wrapper.findAll("button").at(2).trigger("click");
        expect(wrapper.text()).toContain("Solo Tetris");
        expect(wrapper.text()).toContain("Multiplayer");
    });

    it("displays the SoloTetris template when a solo game option is selected", async () => {
    await wrapper.find("button").trigger("click");
    await wrapper.findAll("button").at(0).trigger("click");
    expect(wrapper.findComponent({ name: 'SoloTetris' }).exists()).toBe(true);
});

    it("shows 'How to Play' option when 'Let's Play a Game' is clicked", async () => {
        await wrapper.find("button").trigger("click");
        expect(wrapper.text()).toContain("How to Play");
    });
    
    it("navigates to 'How to Play' when the option is selected", async () => {
        await wrapper.find("button").trigger("click");
        await wrapper.findAll("button").at(2).trigger("click");
        expect(wrapper.text()).not.toContain("Let's Play a Game");
        expect(wrapper.text()).toContain("Back");
    });
});