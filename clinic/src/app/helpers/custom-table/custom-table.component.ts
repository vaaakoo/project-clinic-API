import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableRow, TableCell } from '../../core/auth/table-data-service.service';

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css']
})
export class AppCustomTableComponent {
  @Input() tableData: TableRow[] = [];
  @Input() tableHeaders: { num: number; day: string }[] = [];
  
  @Output() cellClick = new EventEmitter<TableCell>();
  @Output() deleteClick = new EventEmitter<{event: MouseEvent, cell: TableCell}>();

  getTimeRange(rowNumber: number): string {
    const startHour = 9 + rowNumber;
    const endHour = startHour + 1;
    return `${startHour}:00 - ${endHour}:00`;
  }

  onCellClick(cell: TableCell) {
    this.cellClick.emit(cell);
  }

  onDeleteClick(event: MouseEvent, cell: TableCell) {
    event.stopPropagation();
    this.deleteClick.emit({ event, cell });
  }
}
