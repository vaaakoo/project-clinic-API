import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableDataService {
  tableData: { cols: { value: string; activated: boolean }[] }[] = [];
  tableHeaders: { num: number; day: string }[] = [
    { num: 17, day: 'ორშ' },
    { num: 18, day: 'სამ' },
    { num: 19, day: 'ოთხ' },
    { num: 20, day: 'ხუთ' },
    { num: 21, day: 'პარ' },
    { num: 22, day: 'შაბ' },
    { num: 23, day: 'კვი' },
  ];

  constructor() {
    this.initializeTableData();
  }

  private initializeTableData() {
    for (let i = 1; i <= 9; i++) {
      const row = { cols: [] as { value: string; activated: boolean }[] };
      for (let j = 1; j <= 7; j++) {
        row.cols.push({ value: `${i}-${j}`, activated: false });
      }
      this.tableData.push(row);
    }
  }
}
