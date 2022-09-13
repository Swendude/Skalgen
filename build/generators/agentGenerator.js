"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const story_1 = require("../story");
const fates_1 = require("../utils/fates");
const _names = ["roger", "bill", "joe", "gina", "leslie", "amalia"];
const _bioforms = ["bunny", "raccoon", "mouse", "badger"];
const agentGenerator = (seed, amount) => {
    let fate = (0, fates_1.createFates)(seed);
    const names = (0, fates_1.makeChoices)(fate, _names, amount);
    const bioforms = (0, fates_1.makeChoices)(fate, _bioforms, amount);
    return Array.from({ length: amount }, (v, i) => ({
        name: names[i],
        bioform: bioforms[i],
        posessions: [],
        actions: {
            DO_NOTHING: {
                requires: "Nothing",
                effect: (self, fate, story) => [
                    story,
                    `${(0, story_1.showAgent)(self)} decided to do nothing`
                ]
            },
            GIVE_ITEM: {
                requires: "Artefact_Self",
                effect: (self, fate, story) => {
                    const agentToGift = (0, fates_1.makeChoice)(fate, story.agents);
                    if (self.posessions.length > 0) {
                        const artefactChoice = fate(self.posessions.length);
                        const artefact = self.posessions[artefactChoice - 1];
                        agentToGift.posessions = [...agentToGift.posessions, artefact];
                        self.posessions = self.posessions.filter((p, i) => i !== artefactChoice);
                        return [
                            story,
                            `${(0, story_1.showAgent)(self)} gave ${(0, story_1.showAgent)(agentToGift)} ${artefact.show(artefact)}`
                        ];
                    }
                    return [
                        story,
                        `${(0, story_1.showAgent)(self)} wanted to gift an artefact but had none`
                    ];
                }
            }
        }
    }));
};
exports.default = agentGenerator;
