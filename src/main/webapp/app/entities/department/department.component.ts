import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDepartment } from 'app/shared/model/department.model';
import { DepartmentService } from './department.service';
import { DepartmentDeleteDialogComponent } from './department-delete-dialog.component';

@Component({
  selector: 'jhi-department',
  templateUrl: './department.component.html'
})
export class DepartmentComponent implements OnInit, OnDestroy {
  departments?: IDepartment[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected departmentService: DepartmentService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  loadAll(): void {
    if (this.currentSearch) {
      this.departmentService
        .search({
          query: this.currentSearch
        })
        .subscribe((res: HttpResponse<IDepartment[]>) => (this.departments = res.body ? res.body : []));
      return;
    }
    this.departmentService.query().subscribe((res: HttpResponse<IDepartment[]>) => {
      this.departments = res.body ? res.body : [];
      this.currentSearch = '';
    });
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInDepartments();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IDepartment): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInDepartments(): void {
    this.eventSubscriber = this.eventManager.subscribe('departmentListModification', () => this.loadAll());
  }

  delete(department: IDepartment): void {
    const modalRef = this.modalService.open(DepartmentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.department = department;
  }
}
