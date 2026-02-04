import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PolicyService, Policy } from '../policy.service';

@Component({
  selector: 'app-policy-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.css']
})
export class PolicyListComponent implements OnInit {
  currentProgram: string = 'CalFresh';
  programs: string[] = [];
  policies: Policy[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private policyService: PolicyService
  ) {}

  ngOnInit() {
    this.programs = this.policyService.getAllPrograms();
    
    this.route.params.subscribe(params => {
      this.currentProgram = params['program'] || 'CalFresh';
      this.loadPolicies();
    });
  }

  loadPolicies() {
    this.policies = this.policyService.getPoliciesByProgram(this.currentProgram);
  }

  switchProgram(program: string) {
    this.router.navigate(['/policies', program]);
  }

  viewPolicy(policyId: string) {
    this.router.navigate(['/policy', policyId]);
  }
}