import fs from 'fs'
import CommonUtils from './utils/common_utils';
import { MutualFund } from "./mutual_fund/mutual_fund";
import { Stock } from "./stock/stock";
// var data = JSON.parse(fs.readFileSync('./input/stock_data.json', 'utf-8'))
import * as data from './input/stock_data.json';

// let parsedData: Object = JSON.parse(data);
let lines: string[] = CommonUtils.readFile('./input/input2.txt');
let funds: MutualFund[] = []
let stocks: Stock[] = [];
let fund: MutualFund;

data.funds.forEach((f) => {
  // console.log("===".repeat(40))
  // console.log("===".repeat(40))
  let fundIndx: number = funds.findIndex(cf => cf.name == f['name'] )
  
  if(fundIndx > -1){
    fund = funds[fundIndx]
  } else {
    fund = {id: CommonUtils.getNewId(funds), name: f['name'], stockIds: []}
    funds.push(fund)
  }
  f['stocks'].forEach(stk => {
    let stock: Stock;
    let stockIndx: number = stocks.findIndex(s => s.name === stk)
    if(stockIndx == -1){
      stock = {id: CommonUtils.getNewId(stocks), name: stk}
      stocks.push(stock)  
    } else {
      stock = stocks[stockIndx]
    }
    fund.stockIds.push(stock.id)
  })
})

let currentPortfolios: number[] = [];

lines.forEach(line => {
  if(line.trim() !== '') {
    let data: string[] = line.split(' ');
    // console.log(data)
    switch(data[0]) { 
      case 'CURRENT_PORTFOLIO': {
        for(let i = 1; i < data.length; i++){
          let fund: MutualFund | undefined = funds.find(cf => cf.name == data[i].trim())
          if(fund !== undefined){
            currentPortfolios.push(fund.id)
          } else {
            console.log('FUND_NOT_FOUND: ', data[i]) 
          }
        }
        break
      }
      case 'CALCULATE_OVERLAP': {
        let fund: MutualFund | undefined;
        let f: MutualFund | undefined;
        let commonStockIds: number[] | undefined = []
        fund = funds.find(cf => cf.name == data[1].trim())
        if(fund !== undefined){
          currentPortfolios.forEach(fId => {
            f = funds.find(cf => cf.id == fId)
            if (f !== undefined) {
              commonStockIds = fund?.stockIds.filter(sId => f?.stockIds.includes(sId))
              if ((commonStockIds != undefined) && (fund != undefined)) {
                let overlap: number = (2 * commonStockIds?.length/(fund?.stockIds?.length + f?.stockIds.length)) * 100
                console.log(fund.name +" "+ f.name +" "+ overlap + " %")
              }
            }
          })
        } else {
          console.log('FUND_NOT_FOUND: ', data[1]) 
        }
        break
      }
      case 'ADD_STOCK': {
        let fund: MutualFund | undefined = funds.find(cf => cf.name == data[1].trim())
        let stock: Stock | undefined = stocks.find(s => s.name == data[2])
        if(fund !== undefined){
          // console.log('-'.repeat(100))
          // console.log("FUND", fund.name, "STOCK COUNT", fund.stockIds.length)
          if(stock !== undefined){
            if(fund.stockIds.includes(stock.id)) {
              console.log('FUND', data[1], "already includes STOCK", data[2])  
            } else {
              fund.stockIds.push(stock.id)
              funds = CommonUtils.updateInList(funds, fund)
              // console.log("FUND", fund.name, "STOCKS COUNT", fund.stockIds.length)
            }
          } else {
            stock = {id: CommonUtils.getNewId(stocks), name: data[2].trim()}
            stocks.push(stock)
            fund.stockIds.push(stock.id)
            // console.log('STOCK_NOT_FOUND: ', data[2])
          }
        } else {
          console.log('FUND_NOT_FOUND: ', data[1])
        }
        break
      }
      default: {
        break
      }
    }
  }
});