import { Injectable, signal } from '@angular/core';

export interface TableCell {
  uniqueNumber: string; // td_0_0 etc.
  value: string;
  status: 'available' | 'booked' | 'unavailable';
  patientName?: string;
  message?: string;
}

export interface TableRow {
  cols: TableCell[];
}

@Injectable({
  providedIn: 'root'
})
export class TableDataService {
  readonly tableHeaders = signal([
    { num: 17, day: 'ორშ' },
    { num: 18, day: 'სამ' },
    { num: 19, day: 'ოთხ' },
    { num: 20, day: 'ხუთ' },
    { num: 21, day: 'პარ' },
    { num: 22, day: 'შაბ' },
    { num: 23, day: 'კვი' },
  ]);

  readonly tableData = signal<TableRow[]>(this.createInitialData());

  private createInitialData(): TableRow[] {
    const rows: TableRow[] = [];
    for (let i = 0; i < 9; i++) {
      const row: TableRow = { cols: [] };
      for (let j = 0; j < 7; j++) {
        row.cols.push({
          uniqueNumber: `td_${i}_${j}`,
          value: `${i}-${j}`,
          status: 'available'
        });
      }
      rows.push(row);
    }
    return rows;
  }

  resetTable() {
    this.tableData.set(this.createInitialData());
  }
}
