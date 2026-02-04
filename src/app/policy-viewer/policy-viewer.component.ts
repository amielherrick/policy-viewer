import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PolicyService, Policy, PolicyVersion } from '../policy.service';

@Component({
  selector: 'app-policy-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './policy-viewer.component.html',
  styleUrls: ['./policy-viewer.component.css']
})
export class PolicyViewerComponent implements OnInit {
  policy: Policy | undefined;
  selectedVersion: PolicyVersion | undefined;

  constructor(
    private route: ActivatedRoute,
    private policyService: PolicyService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const policyId = params['id'];
      this.policy = this.policyService.getPolicyById(policyId);
      if (this.policy && this.policy.versions.length > 0) {
        this.selectedVersion = this.policy.versions[0];
      }
    });
  }

  selectVersion(version: PolicyVersion) {
    this.selectedVersion = version;
  }
}
