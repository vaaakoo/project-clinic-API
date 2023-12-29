import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent {

  activeTab: string = 'doctors';
  activeRole: string = 'doctor';
  tableData: { cols: { value: string; activated: boolean }[] }[] = [];
  tableHeaders: { num: number; day: string }[] = [
    { num: 17, day: 'mon' },
    { num: 18, day: 'tue' },
    { num: 19, day: 'wed' },
    { num: 20, day: 'thu' },
    { num: 21, day: 'fri' },
    { num: 22, day: 'sat' },
    { num: 23, day: 'sun' },
  ];


  constructor( private router: Router ) { }
  
  ngOnInit() {
    for (let i = 1; i <= 9; i++) {
      const row = { cols: [] as { value: string; activated: boolean }[] };
      for (let j = 1; j <= 7; j++) {
        const activated = false;
        const value = activated ? `${i}-${j}` : "დაჯავშნა";
        row.cols.push({ value, activated });
      }
      this.tableData.push(row);
    }
  }

  toggleCellActivation(rowIndex: number, colIndex: number) {
    const isLastTwoColumns = colIndex >= 5;
    if (!isLastTwoColumns) {
      this.tableData[rowIndex].cols[colIndex].activated = !this.tableData[rowIndex].cols[colIndex].activated;
    }
  }

  deleteCell(rowIndex: number, colIndex: number) {
    !this.tableData[rowIndex].cols[colIndex].activated;
  }

  getTimeRange(rowNumber: number): string {
    const startTime = 9;
    const endTime = 18;
    const timeSlot = 1;

    const startHour = startTime + rowNumber * timeSlot;
    const endHour = startHour + timeSlot;

    return `${startHour}:00 - ${endHour}:00`;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'registration') {
      this.router.navigate(['/admin-page/registration']);
    }
    if (tab === 'categories') {
      this.router.navigate(['/admin-page/category']);
    }

  }

  setActiveRole(role: string) {
    this.activeRole = role;
  }
}
