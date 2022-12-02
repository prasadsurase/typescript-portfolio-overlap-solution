"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_utils_1 = __importDefault(require("./utils/common_utils"));
// var data = JSON.parse(fs.readFileSync('./input/stock_data.json', 'utf-8'))
const data = __importStar(require("./input/stock_data.json"));
// let parsedData: Object = JSON.parse(data);
let lines = common_utils_1.default.readFile('./input/input2.txt');
let funds = [];
let stocks = [];
let fund;
data.funds.forEach((f) => {
    // console.log("===".repeat(40))
    // console.log("===".repeat(40))
    let fundIndx = funds.findIndex(cf => cf.name == f['name']);
    if (fundIndx > -1) {
        fund = funds[fundIndx];
    }
    else {
        fund = { id: common_utils_1.default.getNewId(funds), name: f['name'], stockIds: [] };
        funds.push(fund);
    }
    f['stocks'].forEach(stk => {
        let stock;
        let stockIndx = stocks.findIndex(s => s.name === stk);
        if (stockIndx == -1) {
            stock = { id: common_utils_1.default.getNewId(stocks), name: stk };
            stocks.push(stock);
        }
        else {
            stock = stocks[stockIndx];
        }
        fund.stockIds.push(stock.id);
    });
});
let currentPortfolios = [];
lines.forEach(line => {
    if (line.trim() !== '') {
        let data = line.split(' ');
        // console.log(data)
        switch (data[0]) {
            case 'CURRENT_PORTFOLIO': {
                for (let i = 1; i < data.length; i++) {
                    let fund = funds.find(cf => cf.name == data[i].trim());
                    if (fund !== undefined) {
                        currentPortfolios.push(fund.id);
                    }
                    else {
                        console.log('FUND_NOT_FOUND: ', data[i]);
                    }
                }
                break;
            }
            case 'CALCULATE_OVERLAP': {
                let fund;
                let f;
                let commonStockIds = [];
                fund = funds.find(cf => cf.name == data[1].trim());
                if (fund !== undefined) {
                    currentPortfolios.forEach(fId => {
                        f = funds.find(cf => cf.id == fId);
                        if (f !== undefined) {
                            commonStockIds = fund?.stockIds.filter(sId => f?.stockIds.includes(sId));
                            if ((commonStockIds != undefined) && (fund != undefined)) {
                                let overlap = (2 * commonStockIds?.length / (fund?.stockIds?.length + f?.stockIds.length)) * 100;
                                console.log(fund.name + " " + f.name + " " + overlap + " %");
                            }
                        }
                    });
                }
                else {
                    console.log('FUND_NOT_FOUND: ', data[1]);
                }
                break;
            }
            case 'ADD_STOCK': {
                let fund = funds.find(cf => cf.name == data[1].trim());
                let stock = stocks.find(s => s.name == data[2]);
                if (fund !== undefined) {
                    // console.log('-'.repeat(100))
                    // console.log("FUND", fund.name, "STOCK COUNT", fund.stockIds.length)
                    if (stock !== undefined) {
                        if (fund.stockIds.includes(stock.id)) {
                            console.log('FUND', data[1], "already includes STOCK", data[2]);
                        }
                        else {
                            fund.stockIds.push(stock.id);
                            funds = common_utils_1.default.updateInList(funds, fund);
                            // console.log("FUND", fund.name, "STOCKS COUNT", fund.stockIds.length)
                        }
                    }
                    else {
                        stock = { id: common_utils_1.default.getNewId(stocks), name: data[2].trim() };
                        stocks.push(stock);
                        fund.stockIds.push(stock.id);
                        // console.log('STOCK_NOT_FOUND: ', data[2])
                    }
                }
                else {
                    console.log('FUND_NOT_FOUND: ', data[1]);
                }
                break;
            }
            default: {
                break;
            }
        }
    }
});
