import * as fs from 'fs';

let CommonUtils = {
  readFile: (path: string): string[] => {
    let lines: string[] = [];
    const allFileContents = fs.readFileSync(path, 'utf-8');
    
    allFileContents.split(/\r?\n/).forEach(line =>  {
      lines.push(line.trim());
    });
    
    return lines;
  },

  getNewId: <T extends { id: number }>(items: T[]): number => {
    let max: number = 0;
    for (let i = 0; i < items.length; i++) {
      if(items[i].id > max) {
        max = items[i].id;
      }
    }

    return max + 1;
  },

  updateInList: <T extends {id: number | string}>(list: T[], obj: T): T[] => {
    let indx:number = list.findIndex(l => l.id == obj.id)
    if(indx > -1) {
      list[indx] = obj
    }
    return list;
  },

  calculateDiscountAmount: (amount: number, discountPercentage: number): number => {
    return (amount  * (discountPercentage/100))
  },

  getAmountAfterDiscount: (amount: number, discount: number): number => {
    return amount - (amount * (discount/100))
  }
};

export default CommonUtils
