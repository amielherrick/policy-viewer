import { Routes } from '@angular/router';
import { PolicyListComponent } from './policy-list/policy-list.component';
import { PolicyViewerComponent } from './policy-viewer/policy-viewer.component';
import { CalfreshDetailComponent } from './calfresh-detail/calfresh-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/policies/CalFresh', pathMatch: 'full' },
  { path: 'policies/CalFresh', component: CalfreshDetailComponent },
  { path: 'policies/:program', component: PolicyListComponent },
  { path: 'policy/:id', component: PolicyViewerComponent }
]