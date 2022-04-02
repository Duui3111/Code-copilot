import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export class Copilot {
    private  GetData = async (q: string, l: string) => {
        let response = await fetch(`https://gist.github.com/search?l=${l}&q=${q}`);
        let data = await response.text();
        return data;
    }
    
    private GetSnippet = async (q: string) => {
        let response = await fetch(`https://gist.github.com${q}`);
        let data = await response.text();
        return data;
    }
    
    private isNumber = (n: any) => {
        return !isNaN(parseFloat(n)) && !isNaN(n - 0);
    }

    private removeDuplect = (data: any) => {
        return data.filter((value: any, index: any) => data.indexOf(value) === index);
    }

    public gistRequest = async (q: string, l: string) => {
        const data = await this.GetData(q, l);
    
        let final_arr_parsed: Array<string> = [];
        let index_arr: Array<number> = [];
        
        const dom = new JSDOM(data);

        const arr = Array.from(dom.window.document.querySelectorAll("a")).map(item => item.href)
            .filter(item =>  item.split("/").length === 3 && !item.includes("://") && !item.includes("#")) // this.isNumber(item.split("/")[2]) && item.split("/").length == 3
            .map(item => item.split("/").join("/"));
        //console.log(arr);
            
        const dArr = this.removeDuplect(arr);
    
        for (let i = 0; i < dArr.length; i++) {
            const data = await this.GetSnippet(dArr[i]);

            const dom = new JSDOM(data);
            const text: any = dom.window.document.querySelector("table.highlight")?.textContent;
            final_arr_parsed.push(text);
            index_arr.push(text.length)
        }

        return final_arr_parsed[index_arr.indexOf(Math.min(...index_arr))];
    }  
}
