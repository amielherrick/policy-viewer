import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PolicyVersion {
  versionNumber: string;
  date: string;
  content: string;
}

export interface Policy {
  id: string;
  title: string;
  program: string;
  versions: PolicyVersion[];
}

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  private policies: Policy[] = [
    {
      id: 'calfresh-eligibility',
      title: 'CalFresh Eligibility Requirements',
      program: 'CalFresh',
      versions: []
    },
    {
      id: 'calworks-time-limits',
      title: 'CalWORKs Time Limits and Extensions',
      program: 'CalWORKs',
      versions: []
    },
    {
      id: 'medi-cal-renewal',
      title: 'Medi-Cal Annual Renewal Process',
      program: 'Medi-Cal',
      versions: []
    }
  ];

  constructor(private http: HttpClient) {
    this.loadPolicies();
  }

  private loadPolicies() {
    // Load each policy's full data
    this.policies.forEach(policy => {
      this.http.get<Policy>(`assets/policies/${policy.id}.json`).subscribe(
        data => {
          policy.versions = data.versions;
        }
      );
    });
  }

  getPoliciesByProgram(program: string): Policy[] {
    return this.policies.filter(p => p.program === program);
  }

  getPolicyById(id: string): Policy | undefined {
    return this.policies.find(p => p.id === id);
  }

  getAllPrograms(): string[] {
    return ['CalFresh', 'CalWORKs', 'Medi-Cal'];
  }
}