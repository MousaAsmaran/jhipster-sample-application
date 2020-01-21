import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRegion } from 'app/shared/model/region.model';
import { RegionService } from './region.service';
import { RegionDeleteDialogComponent } from './region-delete-dialog.component';

@Component({
  selector: 'jhi-region',
  templateUrl: './region.component.html'
})
export class RegionComponent implements OnInit, OnDestroy {
  regions?: IRegion[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected regionService: RegionService,
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
      this.regionService
        .search({
          query: this.currentSearch
        })
        .subscribe((res: HttpResponse<IRegion[]>) => (this.regions = res.body ? res.body : []));
      return;
    }
    this.regionService.query().subscribe((res: HttpResponse<IRegion[]>) => {
      this.regions = res.body ? res.body : [];
      this.currentSearch = '';
    });
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInRegions();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IRegion): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInRegions(): void {
    this.eventSubscriber = this.eventManager.subscribe('regionListModification', () => this.loadAll());
  }

  delete(region: IRegion): void {
    const modalRef = this.modalService.open(RegionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.region = region;
  }
}
