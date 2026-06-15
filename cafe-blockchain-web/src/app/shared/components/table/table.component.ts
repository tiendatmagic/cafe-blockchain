import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, Directive, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { IconComponent } from '../icon/icon.component';

export interface TableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  class?: string;
  headerClass?: string;
}

@Directive({
  selector: '[appCell]',
  standalone: true
})
export class TableCellDirective {
  @Input('appCell') columnName!: string;
  constructor(public template: TemplateRef<any>) {}
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent, PaginationComponent, IconComponent],
  templateUrl: './table.component.html',
  styleUrls: []
})
export class TableComponent {
  public readonly Math = Math;

  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() isLoading: boolean = false;
  @Input() skeletonType: 'table' | 'dashboard' | 'reports' | 'card-grid' = 'table';
  @Input() skeletonRows: number = 5;
  @Input() noDataMessage: string = 'Không tìm thấy dữ liệu nào.';

  // Hỗ trợ phân trang trực tiếp (nếu có cấu hình)
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 20;
  @Input() currentPage: number = 1;
  @Input() itemName: string = 'bản ghi';
  @Input() showPagination: boolean = false;

  // Sorting
  @Input() sortKey: string = '';
  @Input() sortDirection: 'asc' | 'desc' | '' = '';

  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<{ key: string, direction: 'asc' | 'desc' | '' }>();

  @ContentChildren(TableCellDirective) customCells!: QueryList<TableCellDirective>;

  public getCustomTemplate(columnName: string): TemplateRef<any> | null {
    if (!this.customCells) return null;
    const match = this.customCells.find(cell => cell.columnName === columnName);
    return match ? match.template : null;
  }

  public onSort(column: TableColumn) {
    if (!column.sortable) return;

    let nextDir: 'asc' | 'desc' | '' = 'asc';
    if (this.sortKey === column.key) {
      if (this.sortDirection === 'asc') {
        nextDir = 'desc';
      } else if (this.sortDirection === 'desc') {
        nextDir = '';
      }
    }

    this.sortChange.emit({
      key: nextDir ? column.key : '',
      direction: nextDir
    });
  }

  public onPageChange(page: number) {
    this.pageChange.emit(page);
  }
}
