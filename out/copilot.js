"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Copilot = void 0;
const node_fetch_1 = require("node-fetch");
const jsdom_1 = require("jsdom");
class Copilot {
    constructor() {
        this.GetData = async (q, l) => {
            let response = await (0, node_fetch_1.default)(`https://gist.github.com/search?l=${l}&q=${q}`);
            let data = await response.text();
            return data;
        };
        this.GetSnippet = async (q) => {
            let response = await (0, node_fetch_1.default)(`https://gist.github.com${q}`);
            let data = await response.text();
            return data;
        };
        this.isNumber = (n) => {
            return !isNaN(parseFloat(n)) && !isNaN(n - 0);
        };
        this.removeDuplect = (data) => {
            return data.filter((value, index) => data.indexOf(value) === index);
        };
        this.gistRequest = async (q, l) => {
            const data = await this.GetData(q, l);
            let final_arr_parsed = [];
            let index_arr = [];
            const dom = new jsdom_1.JSDOM(data);
            const arr = Array.from(dom.window.document.querySelectorAll("a")).map(item => item.href)
                .filter(item => item.split("/").length === 3 && !item.includes("://") && !item.includes("#")) // this.isNumber(item.split("/")[2]) && item.split("/").length == 3
                .map(item => item.split("/").join("/"));
            //console.log(arr);
            const dArr = this.removeDuplect(arr);
            for (let i = 0; i < dArr.length; i++) {
                const data = await this.GetSnippet(dArr[i]);
                const dom = new jsdom_1.JSDOM(data);
                const text = dom.window.document.querySelector("table.highlight")?.textContent;
                final_arr_parsed.push(text);
                index_arr.push(text.length);
            }
            return final_arr_parsed[index_arr.indexOf(Math.min(...index_arr))];
        };
    }
}
exports.Copilot = Copilot;
//# sourceMappingURL=copilot.js.map